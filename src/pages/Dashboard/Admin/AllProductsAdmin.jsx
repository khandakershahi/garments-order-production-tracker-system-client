import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';

const PRODUCT_CATEGORIES = ["Shirt", "Pant", "Jacket", "Panjabi", "Sharee", "Three Piece", "Kurti", "Others"];
const PAYMENT_OPTIONS = ["Cash on Delivery", "PayFast"];

const AllProductsAdmin = () => {
    const axiosSecure = useAxiosSecure();
    const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;
    
    const [searchText, setSearchText] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [featureImagePreview, setFeatureImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const { data: products = [], refetch, isLoading } = useQuery({
        queryKey: ['admin-products', searchText],
        queryFn: async () => {
            const res = await axiosSecure.get(`/admin/products?search=${searchText}`);
            return res.data;
        }
    });

    // Populate form when editing product
    useEffect(() => {
        if (editingProduct) {
            reset({
                productName: editingProduct.title || '',
                productDescription: editingProduct.description || '',
                category: editingProduct.category || '',
                price: editingProduct.price ?? editingProduct.unitPrice ?? 0,
                availableQuantity: editingProduct.availableQuantity ?? 0,
                minOrderQuantity: editingProduct.minOrderQuantity ?? 0,
                videoLink: editingProduct.videoLink || '',
                paymentOption: editingProduct.paymentOption || '',
                showInHeroSlider: editingProduct.showInHeroSlider || false,
                showOnHomePage: editingProduct.showOnHomePage || false,
            });
            
            // Set existing images
            if (editingProduct.featureImage) {
                setFeatureImagePreview(editingProduct.featureImage);
            }
            if (editingProduct.images && Array.isArray(editingProduct.images)) {
                setImagePreviews(editingProduct.images);
            }
        }
    }, [editingProduct, reset]);

    const handleEdit = (product) => {
        setEditingProduct(product);
    };

    const handleCloseModal = () => {
        setEditingProduct(null);
        setImagePreviews([]);
        setFeatureImagePreview(null);
        reset();
    };

    // Image handling functions
    const cleanupImagePreviews = (urls) => {
        urls.forEach(url => {
            if (url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => file.type.startsWith('image/'));

        if (validFiles.length > 0) {
            const urls = validFiles.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...urls]);
        }
    };

    const handleFeatureImageChange = (e) => {
        const file = e.target.files[0];
        
        if (file && file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            if (featureImagePreview && featureImagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(featureImagePreview);
            }
            setFeatureImagePreview(url);
        }
    };

    const removeImage = (index) => {
        setImagePreviews(prev => {
            const updated = prev.filter((_, i) => i !== index);
            if (prev[index].startsWith('blob:')) {
                URL.revokeObjectURL(prev[index]);
            }
            return updated;
        });
    };

    const removeFeatureImage = () => {
        if (featureImagePreview && featureImagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(featureImagePreview);
        }
        setFeatureImagePreview(null);
    };

    const uploadImageToImgBB = async (imageFile) => {
        const formData = new FormData();
        formData.append("image", imageFile);
        const response = await axios.post(image_API_URL, formData);
        return response.data.data.url;
    };

    const handleUpdate = async (data) => {
        const newImages = data.images;
        const newFeatureImage = data.featureImage;

        setIsUploading(true);

        const updatedFields = {
            title: data.productName,
            description: data.productDescription,
            category: data.category,
            price: parseFloat(data.price),
            availableQuantity: parseInt(data.availableQuantity),
            minOrderQuantity: parseInt(data.minOrderQuantity),
            videoLink: data.videoLink || null,
            paymentOption: data.paymentOption,
            showInHeroSlider: data.showInHeroSlider || false,
            showOnHomePage: data.showOnHomePage || false,
        };

        // Handle Feature Image Upload
        if (newFeatureImage && newFeatureImage.length > 0) {
            try {
                const featureImageUrl = await uploadImageToImgBB(newFeatureImage[0]);
                updatedFields.featureImage = featureImageUrl;
            } catch (error) {
                console.error("Feature Image Upload Failed:", error);
                setIsUploading(false);
                Swal.fire("Error", "Failed to upload feature image.", "error");
                return;
            }
        }

        // Handle Product Images
        if (newImages && newImages.length > 0) {
            try {
                const newImageFiles = Array.from(newImages).filter(img => img instanceof File);
                
                if (newImageFiles.length > 0) {
                    const uploadPromises = newImageFiles.map(image => uploadImageToImgBB(image));
                    const newImageUrls = await Promise.all(uploadPromises);
                    
                    const existingImages = imagePreviews.filter(img => !img.startsWith('blob:'));
                    updatedFields.images = [...existingImages, ...newImageUrls];
                } else {
                    updatedFields.images = imagePreviews;
                }
            } catch (error) {
                console.error("Images Upload Failed:", error);
                setIsUploading(false);
                Swal.fire("Error", "Failed to upload product images.", "error");
                return;
            }
        } else {
            updatedFields.images = imagePreviews;
        }

        try {
            await axiosSecure.patch(`/products/${editingProduct._id}`, updatedFields);
            refetch();
            cleanupImagePreviews(imagePreviews);
            handleCloseModal();
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Product has been updated successfully.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire('Error!', 'Failed to update product.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleToggleShowOnHome = async (id, currentStatus) => {
        try {
            await axiosSecure.patch(`/products/${id}`, {
                showOnHomePage: !currentStatus
            });
            refetch();
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: `Product ${!currentStatus ? 'will now' : 'will no longer'} show on home page.`,
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire('Error!', 'Failed to update product.', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/products/${id}`);
                refetch();
                Swal.fire('Deleted!', 'Product has been deleted.', 'success');
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete product.', 'error');
            }
        }
    };

    if (isLoading) return <div className="flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">All Products (Admin)</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Available Qty</th>
                            <th>Manager</th>
                            <th>Show on Home</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>{product.title}</td>
                                <td>{product.category}</td>
                                <td>${product.price || product.unitPrice}</td>
                                <td>{product.availableQuantity}</td>
                                <td>{product.managerEmail}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-success"
                                        checked={product.showOnHomePage || false}
                                        onChange={() => handleToggleShowOnHome(product._id, product.showOnHomePage)}
                                    />
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="btn btn-sm btn-info"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="btn btn-sm btn-error"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Update Product Modal */}
            {editingProduct && (
                <div className="modal modal-open" onClick={handleCloseModal}>
                    <div className="modal-box max-w-4xl bg-base-200 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <h3 className="font-bold text-2xl text-primary mb-4">
                            Edit Product: {editingProduct.title} ({editingProduct.productId})
                        </h3>

                        {/* Upload Overlay Loader */}
                        {isUploading && (
                            <div className="fixed inset-0 bg-base-300 bg-opacity-70 z-50 flex items-center justify-center">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                                <p className="ml-4 text-xl font-semibold text-white">Uploading Images, please wait...</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4 pt-4">
                            {/* Product Name / Title */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Product Name / Title</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("productName", { required: "Name is required" })}
                                    className="input input-bordered w-full bg-base-100 text-base-content"
                                />
                                {errors.productName && <p className="text-error text-sm mt-1">{errors.productName.message}</p>}
                            </div>

                            {/* Product Description */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Description</span>
                                </label>
                                <textarea
                                    {...register("productDescription", { required: "Description is required" })}
                                    className="textarea textarea-bordered w-full h-24 bg-base-100 text-base-content"
                                />
                                {errors.productDescription && <p className="text-error text-sm mt-1">{errors.productDescription.message}</p>}
                            </div>

                            {/* Grid for small fields */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Category */}
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-semibold">Category</span></label>
                                    <select
                                        {...register("category", { required: "Category is required" })}
                                        className="select select-bordered w-full bg-base-100 text-base-content"
                                    >
                                        {PRODUCT_CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price */}
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-semibold">Price (Taka)</span></label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register("price", {
                                            required: "Price is required",
                                            valueAsNumber: true,
                                            min: 1
                                        })}
                                        className="input input-bordered w-full bg-base-100 text-base-content"
                                    />
                                </div>

                                {/* Available Quantity */}
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-semibold">Available Quantity</span></label>
                                    <input
                                        type="number"
                                        {...register("availableQuantity", {
                                            required: "Quantity is required",
                                            valueAsNumber: true,
                                            min: 1
                                        })}
                                        className="input input-bordered w-full bg-base-100 text-base-content"
                                    />
                                </div>
                            </div>

                            {/* Grid for remaining fields */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* MOQ */}
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-semibold">MOQ</span></label>
                                    <input
                                        type="number"
                                        {...register("minOrderQuantity", {
                                            required: "MOQ is required",
                                            valueAsNumber: true,
                                            min: 1
                                        })}
                                        className="input input-bordered w-full bg-base-100 text-base-content"
                                    />
                                </div>

                                {/* Demo Video Link */}
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-semibold">Demo Video Link</span></label>
                                    <input
                                        type="url"
                                        {...register("videoLink")}
                                        className="input input-bordered w-full bg-base-100 text-base-content"
                                        placeholder="Optional URL"
                                    />
                                </div>

                                {/* Payment Options */}
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-semibold">Payment Option</span></label>
                                    <select
                                        {...register("paymentOption", { required: "Option is required" })}
                                        className="select select-bordered w-full bg-base-100 text-base-content"
                                    >
                                        {PAYMENT_OPTIONS.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Feature Image Upload */}
                            <div className="form-control border p-4 rounded-lg border-primary/50 bg-base-100">
                                <label className="label">
                                    <span className="label-text font-semibold">Feature Image (Main Image)</span>
                                </label>
                                <p className="text-sm text-base-content/70 mb-2">This image will be displayed as the main product image and in the hero slider if selected.</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...register("featureImage")}
                                    onChange={handleFeatureImageChange}
                                    className="file-input file-input-bordered w-full bg-base-100"
                                />

                                {featureImagePreview && (
                                    <div className="mt-4">
                                        <p className="font-medium mb-2">Current Feature Image:</p>
                                        <div className="relative w-48 h-48 mx-auto">
                                            <img
                                                src={featureImagePreview}
                                                alt="Feature"
                                                className="w-full h-full object-cover rounded-md border shadow-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeFeatureImage}
                                                className="absolute top-2 right-2 btn btn-sm btn-error btn-circle"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Show in Hero Slider Toggle */}
                            <div className="form-control pt-2">
                                <label className="label cursor-pointer justify-start gap-3">
                                    <input
                                        type="checkbox"
                                        {...register("showInHeroSlider")}
                                        className="checkbox checkbox-primary"
                                    />
                                    <span className="label-text">Show in Hero Slider</span>
                                </label>
                            </div>

                            {/* Product Images Upload */}
                            <div className="form-control border p-4 rounded-lg border-primary/50 bg-base-100">
                                <label className="label">
                                    <span className="label-text font-semibold">Product Images (Multiple)</span>
                                </label>
                                <p className="text-sm text-base-content/70 mb-2">Add new images or view existing ones.</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    {...register("images")}
                                    onChange={(e) => {
                                        register('images').onChange(e);
                                        handleImageChange(e);
                                    }}
                                    className="file-input file-input-bordered w-full bg-base-100"
                                />

                                {imagePreviews.length > 0 && (
                                    <div className="mt-4">
                                        <p className="font-medium mb-2">Product Images ({imagePreviews.length}):</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {imagePreviews.map((url, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={url}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-md border shadow-sm"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-1 right-1 btn btn-xs btn-error btn-circle"
                                                    >
                                                        <FaTrash size={10} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Show on Home Page Toggle */}
                            <div className="form-control pt-2">
                                <label className="label cursor-pointer justify-start gap-3">
                                    <input
                                        type="checkbox"
                                        {...register("showOnHomePage")}
                                        className="checkbox checkbox-primary"
                                    />
                                    <span className="label-text">Show on Home Page "Our Products" section</span>
                                </label>
                            </div>

                            {/* Modal Actions */}
                            <div className="modal-action">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="btn btn-ghost"
                                    disabled={isUploading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isUploading}
                                >
                                    {isUploading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllProductsAdmin;