import React, { useEffect, useState } from 'react'; // ⭐ Import useEffect & useState ⭐
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Loading/Loading';
import { FaTimes, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';

// Mock data (same as AddProduct.jsx)
const PRODUCT_CATEGORIES = ["Shirt", "Pant", "Jacket", "Panjabi", "Sharee", "Three Piece", "Kurti", "Others"];
const PAYMENT_OPTIONS = ["Cash on Delivery", "PayFast"];


const EditProductModal = ({ isOpen, onClose, productData, onSuccess }) => {
    const axiosSecure = useAxiosSecure();
    const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;

    // State for image management
    const [imagePreviews, setImagePreviews] = useState([]);
    const [featureImagePreview, setFeatureImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // ⭐ 1. Include 'reset' in the useForm destructuring ⭐
    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        reset, // ⭐ Added reset function ⭐
    } = useForm({
        // Keep defaultValues logic simple, but the key work will be done in useEffect
        defaultValues: {
            productName: '', // Initialize blank
            productDescription: '',
            category: '',
            price: 0,
            availableQuantity: 0,
            minOrderQuantity: 0,
            videoLink: '',
            paymentOption: '',
            showInHeroSlider: false,
            showOnHomePage: false,
        }
    });

    // ⭐ 2. Use useEffect to reset the form data when productData becomes available ⭐
    useEffect(() => {
        if (productData) {
            // Map the fetched data to the form fields
            const formValues = {
                productName: productData.title || '',
                productDescription: productData.description || '',
                category: productData.category || '',
                price: productData.price ?? 0,
                availableQuantity: productData.availableQuantity ?? 0,
                minOrderQuantity: productData.minOrderQuantity ?? 0,
                videoLink: productData.videoLink || '',
                paymentOption: productData.paymentOption || '',
                showInHeroSlider: productData.showInHeroSlider || false,
                showOnHomePage: productData.showOnHomePage || false,
            };
            // Call reset to populate the form fields with the fetched data
            reset(formValues);
            
            // Set feature image preview from existing product
            if (productData.featureImage) {
                setFeatureImagePreview(productData.featureImage);
            }
            
            // Set product images previews from existing product
            if (productData.images && Array.isArray(productData.images)) {
                setImagePreviews(productData.images);
            }
        }
    }, [productData, reset]); // Dependency array: run whenever productData changes

    // Helper function to clean up preview URLs (memory management)
    const cleanupImagePreviews = (urls) => {
        urls.forEach(url => {
            if (url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        });
    };

    // --- Image Preview Handler ---
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => file.type.startsWith('image/'));

        if (validFiles.length > 0) {
            const urls = validFiles.map(file => URL.createObjectURL(file));
            // Add new images to existing ones
            setImagePreviews(prev => [...prev, ...urls]);
        }
    };

    // --- Feature Image Preview Handler ---
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

    // --- Remove image from preview ---
    const removeImage = (index) => {
        setImagePreviews(prev => {
            const updated = prev.filter((_, i) => i !== index);
            // Clean up the removed URL if it's a blob
            if (prev[index].startsWith('blob:')) {
                URL.revokeObjectURL(prev[index]);
            }
            return updated;
        });
    };

    // --- Remove feature image ---
    const removeFeatureImage = () => {
        if (featureImagePreview && featureImagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(featureImagePreview);
        }
        setFeatureImagePreview(null);
    };

    // --- Core Upload Function ---
    const uploadImageToImgBB = async (imageFile) => {
        const formData = new FormData();
        formData.append("image", imageFile);
        const response = await axios.post(image_API_URL, formData);
        return response.data.data.url;
    };

    // If productData is null (still fetching), show a loading spinner
    if (!productData) {
        return (
            <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
                <div className="modal-box w-11/12 max-w-2xl text-center">
                    <Loading />
                    <p className="py-4">Loading product details...</p>
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
            </dialog>
        );
    }

    // --- Submission Handler (UPDATED with Image Handling) ---
    const onSubmit = async (data) => {
        const newImages = data.images;
        const newFeatureImage = data.featureImage;

        setIsUploading(true);

        // Prepare updated fields
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

        // 1. Handle Feature Image Upload (if new file selected)
        if (newFeatureImage && newFeatureImage.length > 0) {
            try {
                const featureImageUrl = await uploadImageToImgBB(newFeatureImage[0]);
                updatedFields.featureImage = featureImageUrl;
            } catch (imageError) {
                console.error("Feature Image Upload Failed:", imageError);
                setIsUploading(false);
                Swal.fire("Error", "Failed to upload feature image to ImgBB.", "error");
                return;
            }
        }

        // 2. Handle Product Images (if new files selected)
        if (newImages && newImages.length > 0) {
            try {
                // Filter out existing URLs (non-blob URLs)
                const newImageFiles = Array.from(newImages).filter(img => 
                    img instanceof File
                );
                
                if (newImageFiles.length > 0) {
                    const uploadPromises = newImageFiles.map(image => uploadImageToImgBB(image));
                    const newImageUrls = await Promise.all(uploadPromises);
                    
                    // Combine existing images with new ones
                    const existingImages = imagePreviews.filter(img => !img.startsWith('blob:'));
                    updatedFields.images = [...existingImages, ...newImageUrls];
                } else {
                    // No new files, keep existing images
                    updatedFields.images = imagePreviews;
                }
            } catch (imageError) {
                console.error("Images Upload Failed:", imageError);
                setIsUploading(false);
                Swal.fire("Error", "Failed to upload product images to ImgBB.", "error");
                return;
            }
        } else {
            // Keep existing images
            updatedFields.images = imagePreviews;
        }

        // 3. Save Updated Product to Database
        try {
            const res = await axiosSecure.patch(`/products/${productData._id}`, updatedFields);

            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `${data.productName} updated successfully!`,
                    showConfirmButton: false,
                    timer: 2000,
                });
                cleanupImagePreviews(imagePreviews);
                onSuccess();
            } else if (res.data.matchedCount > 0) {
                Swal.fire('Info', 'No changes detected.', 'info');
                onClose();
            } else {
                Swal.fire('Error', 'Update failed on the server. Product not found.', 'error');
            }
        } catch (error) {
            console.error("Product Update Failed:", error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to update product data.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        // The rest of the JSX remains the same
        <dialog className={`modal ${isOpen ? 'modal-open' : ''}`} onClose={onClose}>
            <div className="modal-box w-11/12 max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
                <h3 className="font-bold text-2xl text-primary mb-4">
                    Edit Product: {productData.title} ({productData.productId})
                </h3>

                {/* Close Button */}
                <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={onClose}
                    disabled={isSubmitting || isUploading}
                >
                    <FaTimes />
                </button>

                {/* Upload Overlay Loader */}
                {isUploading && (
                    <div className="fixed inset-0 bg-base-300 bg-opacity-70 z-50 flex items-center justify-center">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="ml-4 text-xl font-semibold text-white">Uploading Images, please wait...</p>
                    </div>
                )}

                {/* --- Edit Form --- */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">

                    {/* Product Name / Title */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Product Name / Title</span>
                        </label>
                        <input
                            type="text"
                            {...register("productName", { required: "Name is required" })}
                            className="input input-bordered w-full"
                        />
                        {errors.productName && <p className="text-error text-sm mt-1">{errors.productName.message}</p>}
                    </div>

                    {/* Product Description */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Description</span>
                        </label>
                        <textarea
                            {...register("productDescription", { required: "Description is required" })}
                            className="textarea textarea-bordered w-full h-24"
                        />
                        {errors.productDescription && <p className="text-error text-sm mt-1">{errors.productDescription.message}</p>}
                    </div>

                    {/* Grid for small fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Category */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Category</span></label>
                            <select
                                {...register("category", { required: "Category is required" })}
                                className="select select-bordered w-full"
                            >
                                {PRODUCT_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Price (Taka)</span></label>
                            <input
                                type="number"
                                step="0.01"
                                {...register("price", {
                                    required: "Price is required",
                                    valueAsNumber: true,
                                    min: 1
                                })}
                                className="input input-bordered w-full"
                            />
                        </div>

                        {/* Available Quantity */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Available Quantity</span></label>
                            <input
                                type="number"
                                {...register("availableQuantity", {
                                    required: "Quantity is required",
                                    valueAsNumber: true,
                                    min: 1
                                })}
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>

                    {/* Grid for remaining fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* MOQ */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">MOQ</span></label>
                            <input
                                type="number"
                                {...register("minOrderQuantity", {
                                    required: "MOQ is required",
                                    valueAsNumber: true,
                                    min: 1
                                })}
                                className="input input-bordered w-full"
                            />
                        </div>

                        {/* Demo Video Link */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Demo Video Link</span></label>
                            <input
                                type="url"
                                {...register("videoLink")}
                                className="input input-bordered w-full"
                                placeholder="Optional URL"
                            />
                        </div>

                        {/* Payment Options */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Payment Option</span></label>
                            <select
                                {...register("paymentOption", { required: "Option is required" })}
                                className="select select-bordered w-full"
                            >
                                {PAYMENT_OPTIONS.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Feature Image Upload */}
                    <div className="form-control border p-4 rounded-lg border-primary/50">
                        <label className="label">
                            <span className="label-text font-semibold">Feature Image (Main Image)</span>
                        </label>
                        <p className="text-sm text-gray-600 mb-2">This image will be displayed as the main product image and in the hero slider if selected.</p>
                        <input
                            type="file"
                            accept="image/*"
                            {...register("featureImage")}
                            onChange={handleFeatureImageChange}
                            className="file-input file-input-bordered w-full"
                        />

                        {/* Feature Image Preview & Remove Option */}
                        {featureImagePreview && (
                            <div className="mt-4">
                                <p className="font-medium mb-2">Current Feature Image:</p>
                                <div className="relative w-48 h-48 mx-auto">
                                    <img
                                        src={featureImagePreview}
                                        alt="Feature image preview"
                                        className="w-full h-full object-cover rounded-md border border-gray-300 shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeFeatureImage}
                                        className="absolute top-2 right-2 btn btn-sm btn-error btn-circle text-white"
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
                        <p className="text-sm text-gray-600 mt-1">Check this to display the product in the homepage hero slider.</p>
                    </div>

                    {/* Product Images Upload */}
                    <div className="form-control border p-4 rounded-lg border-primary/50">
                        <label className="label">
                            <span className="label-text font-semibold">Product Images (Multiple)</span>
                        </label>
                        <p className="text-sm text-gray-600 mb-2">Add new images or view existing ones. You can remove images and add new ones.</p>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            {...register("images")}
                            onChange={(e) => {
                                register('images').onChange(e);
                                handleImageChange(e);
                            }}
                            className="file-input file-input-bordered w-full"
                        />

                        {/* Image Preview & Remove Options */}
                        {imagePreviews.length > 0 && (
                            <div className="mt-4">
                                <p className="font-medium mb-2">Product Images ({imagePreviews.length}):</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {imagePreviews.map((url, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={url}
                                                alt={`Product preview ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-md border border-gray-300 shadow-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 btn btn-xs btn-error btn-circle text-white"
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

                    <div className="modal-action justify-start">
                        <button
                            type="submit"
                            className="btn btn-primary text-white"
                            disabled={isSubmitting || isUploading}
                        >
                            {isSubmitting || isUploading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>

            </div>
        </dialog>
    );
};

export default EditProductModal;