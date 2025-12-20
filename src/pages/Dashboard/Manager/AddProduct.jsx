import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from '@tanstack/react-query';
import Swal from "sweetalert2";
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import axios from "axios";
import Loading from '../../../components/Loading/Loading';

// Mock data remains the same
const PRODUCT_CATEGORIES = ["Shirt", "Pant", "Jacket", "Panjabi", "Sharee", "Three Piece", "Kurti", "Others"];
const PAYMENT_OPTIONS = ["Cash on Delivery", "PayFast"];

// ⭐ REMOVE THE generateProductId FUNCTION HERE! It is now on the server. ⭐

const AddProduct = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;

    const [imagePreviews, setImagePreviews] = useState([]);
    const [featureImagePreview, setFeatureImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Fetch user data to check suspend status
    const { data: userData = null, isLoading: userDataLoading } = useQuery({
        queryKey: ['user-suspend-check', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}/role`);
            return res.data;
        }
    });

    // Show loading while checking user status
    if (userDataLoading) {
        return <Loading />;
    }

    // Helper function to clean up preview URLs (memory management)
    const cleanupImagePreviews = (urls) => {
        urls.forEach(url => URL.revokeObjectURL(url));
    };

    // --- Image Preview Handler (same) ---
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        cleanupImagePreviews(imagePreviews);
        const validFiles = files.filter(file => file.type.startsWith('image/'));

        if (validFiles.length > 0) {
            const urls = validFiles.map(file => URL.createObjectURL(file));
            setImagePreviews(urls);
        } else {
            setImagePreviews([]);
        }
    };

    // --- Feature Image Preview Handler ---
    const handleFeatureImageChange = (e) => {
        const file = e.target.files[0];
        if (featureImagePreview) {
            URL.revokeObjectURL(featureImagePreview);
        }
        
        if (file && file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setFeatureImagePreview(url);
        } else {
            setFeatureImagePreview(null);
        }
    };

    // --- Core Upload Function (same) ---
    const uploadImageToImgBB = async (imageFile) => {
        const formData = new FormData();
        formData.append("image", imageFile);
        const response = await axios.post(image_API_URL, formData);
        return response.data.data.url;
    };


    // --- Form Submission Handler (UPDATED) ---
    const handleAddProduct = async (data) => {
        const images = data.images;
        const featureImage = data.featureImage;

        if (images.length === 0) {
            Swal.fire("Error", "Please select at least one product image.", "error");
            return;
        }

        if (!featureImage || featureImage.length === 0) {
            Swal.fire("Error", "Please select a feature image.", "error");
            return;
        }

        setIsUploading(true);

        // 1. **Upload Feature Image**
        let featureImageUrl = null;
        try {
            featureImageUrl = await uploadImageToImgBB(featureImage[0]);
        } catch (imageError) {
            console.error("Feature Image Upload Failed:", imageError);
            setIsUploading(false);
            Swal.fire("Error", "Failed to upload feature image to ImgBB. Check your API key or network.", "error");
            return;
        }

        // 2. **Image Upload and URL Collection**
        let imageUrls = [];
        try {
            const uploadPromises = Array.from(images).map(image => uploadImageToImgBB(image));
            imageUrls = await Promise.all(uploadPromises);

        } catch (imageError) {
            console.error("Image Upload Failed:", imageError);
            setIsUploading(false);
            Swal.fire("Error", "Failed to upload product images to ImgBB. Check your API key or network.", "error");
            return;
        }

        // 3. **Prepare Product Data (NO ID GENERATED HERE)**
        // The productId will be generated and added by the server.
        const productInfo = {
            title: data.productName,
            description: data.productDescription,
            category: data.category,
            price: parseFloat(data.price),
            availableQuantity: parseInt(data.availableQuantity),
            minOrderQuantity: parseInt(data.minOrderQuantity),
            featureImage: featureImageUrl,
            images: imageUrls,
            videoLink: data.demoVideoLink || null,
            paymentOption: data.paymentOption,
            showInHeroSlider: data.showInHeroSlider || false,
            createdAt: new Date(),
        };

        // 3. **Save Product to Database**
        try {
            // ⭐ EXPECT THE productId BACK IN THE RESPONSE DATA ⭐
            const res = await axiosSecure.post("/products", productInfo);
            const { insertedId, productId } = res.data; // Destructure the new productId

            if (insertedId) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    // Use the productId returned by the server
                    title: `${data.productName} (ID: ${productId}) has been successfully added!`,
                    showConfirmButton: false,
                    timer: 4000,
                });

                // Cleanup and navigation (placeholder since react-router-dom is excluded)
                reset();
                cleanupImagePreviews(imagePreviews);
                setImagePreviews([]);
                if (featureImagePreview) {
                    URL.revokeObjectURL(featureImagePreview);
                    setFeatureImagePreview(null);
                }

            } else {
                Swal.fire("Error", "Product creation failed on the server.", "error");
            }
        } catch (dbError) {
            console.error("Database Submission Failed:", dbError.response?.data?.message || dbError.message);
            Swal.fire("Error", "Failed to save product data. Check your network or API response.", "error");
        } finally {
            setIsUploading(false);
        }
    };

    // --- Render JSX (same) ---
    return (
        <div className="bg-base-100 min-h-screen p-8">
            <div className="bg-base-200 rounded-4xl p-8 shadow-xl">
                <h2 className="text-4xl font-bold text-center mb-10 text-primary">
                    Add New Product (Manager Access)
                </h2>

            {/* Suspend Alert */}
            {userData?.status === 'suspended' && (
                <div className="alert alert-error shadow-lg mb-6">
                    <div className="flex-col items-start w-full">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Account Suspended - Cannot Add Products
                        </h3>
                        <div className="mt-2">
                            <p className="font-semibold">Reason: <span className="font-normal">{userData.suspendReason}</span></p>
                            <p className="text-sm mt-1">Contact admin to resolve this issue.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay Loader */}
            {isUploading && (
                <div className="fixed inset-0 bg-base-300 bg-opacity-70 z-50 flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="ml-4 text-xl font-semibold text-white">Uploading Images, please wait...</p>
                </div>
            )}

            <form onSubmit={handleSubmit(handleAddProduct)} className="p-4 text-base-content space-y-6">

                {/* Product Name / Title */}
                <fieldset className="fieldset">
                    <label className="label text-lg font-semibold text-base-content">Product Name / Title <span className="text-error">*</span></label>
                    <input
                        type="text"
                        {...register("productName", { required: "Product Name is required" })}
                        className="input input-bordered w-full bg-base-100 text-base-content"
                        placeholder="e.g., Slim Fit Cotton Shirt"
                    />
                    {errors.productName && <p className="text-error text-sm mt-1">{errors.productName.message}</p>}
                </fieldset>

                {/* Product Description */}
                <fieldset className="fieldset">
                    <label className="label text-lg font-semibold text-base-content">Product Description <span className="text-error">*</span></label>
                    <textarea
                        {...register("productDescription", { required: "Description is required" })}
                        className="textarea textarea-bordered w-full h-32 bg-base-100 text-base-content"
                        placeholder="Provide detailed product specifications, materials, and sizing info."
                    />
                    {errors.productDescription && <p className="text-error text-sm mt-1">{errors.productDescription.message}</p>}
                </fieldset>

                {/* GRID: Category, Price, Quantity */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Category */}
                    <fieldset className="fieldset">
                        <label className="label text-lg font-semibold text-base-content">Category <span className="text-error">*</span></label>
                        <select
                            {...register("category", { required: "Category is required" })}
                            className="select select-bordered w-full bg-base-100 text-base-content"
                            defaultValue=""
                        >
                            <option value="" disabled>Select a Category</option>
                            {PRODUCT_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        {errors.category && <p className="text-error text-sm mt-1">{errors.category.message}</p>}
                    </fieldset>

                    {/* Price */}
                    <fieldset className="fieldset">
                        <label className="label text-lg font-semibold text-base-content">Price (Taka) <span className="text-error">*</span></label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("price", {
                                required: "Price is required",
                                min: { value: 1, message: "Price must be positive" },
                                valueAsNumber: true
                            })}
                            className="input input-bordered w-full bg-base-100 text-base-content"
                            placeholder="e.g., 850.50"
                        />
                        {errors.price && <p className="text-error text-sm mt-1">{errors.price.message}</p>}
                    </fieldset>

                    {/* Available Quantity */}
                    <fieldset className="fieldset">
                        <label className="label text-lg font-semibold text-base-content">Available Quantity <span className="text-error">*</span></label>
                        <input
                            type="number"
                            {...register("availableQuantity", {
                                required: "Quantity is required",
                                min: { value: 1, message: "Must be at least 1" },
                                valueAsNumber: true
                            })}
                            className="input input-bordered w-full bg-base-100 text-base-content"
                            placeholder="e.g., 500"
                        />
                        {errors.availableQuantity && <p className="text-error text-sm mt-1">{errors.availableQuantity.message}</p>}
                    </fieldset>
                </div>

                {/* GRID: MOQ, Demo Video, Payment Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Minimum Order Quantity (MOQ) */}
                    <fieldset className="fieldset">
                        <label className="label text-lg font-semibold text-base-content">Minimum Order Quantity (MOQ) <span className="text-error">*</span></label>
                        <input
                            type="number"
                            {...register("minOrderQuantity", {
                                required: "MOQ is required",
                                min: { value: 1, message: "MOQ must be at least 1" },
                                valueAsNumber: true
                            })}
                            className="input input-bordered w-full bg-base-100 text-base-content"
                            placeholder="e.g., 50"
                        />
                        {errors.minOrderQuantity && <p className="text-error text-sm mt-1">{errors.minOrderQuantity.message}</p>}
                    </fieldset>

                    {/* Demo Video Link */}
                    <fieldset className="fieldset">
                        <label className="label text-lg font-semibold text-base-content">Demo Video Link (Optional)</label>
                        <input
                            type="url"
                            {...register("demoVideoLink")}
                            className="input input-bordered w-full bg-base-100 text-base-content"
                            placeholder="e.g., https://youtube.com/..."
                        />
                    </fieldset>

                    {/* Payment Options */}
                    <fieldset className="fieldset">
                        <label className="label text-lg font-semibold text-base-content">Payment Option <span className="text-error">*</span></label>
                        <select
                            {...register("paymentOption", { required: "Payment option is required" })}
                            className="select select-bordered w-full bg-base-100 text-base-content"
                            defaultValue=""
                        >
                            <option value="" disabled>Select Option</option>
                            {PAYMENT_OPTIONS.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        {errors.paymentOption && <p className="text-error text-sm mt-1">{errors.paymentOption.message}</p>}
                    </fieldset>
                </div>

                {/* Feature Image Upload */}
                <fieldset className="fieldset border p-4 rounded-lg border-primary/50 bg-base-100">
                    <label className="label text-lg font-semibold text-base-content">Feature Image (Main Image) <span className="text-error">*</span></label>
                    <p className="text-sm text-base-content/70 mb-2">This image will be displayed as the main product image and in the hero slider if selected.</p>
                    <input
                        type="file"
                        accept="image/*"
                        {...register("featureImage", { required: "Feature image is required" })}
                        onChange={handleFeatureImageChange}
                        className="file-input file-input-bordered w-full bg-base-100"
                    />
                    {errors.featureImage && <p className="text-error text-sm mt-1">{errors.featureImage.message}</p>}

                    {/* Feature Image Preview */}
                    {featureImagePreview && (
                        <div className="mt-4">
                            <p className="col-span-full font-medium mb-2 text-base-content">Feature Image Preview:</p>
                            <div className="w-48 h-48 mx-auto">
                                <img
                                    src={featureImagePreview}
                                    alt="Feature image preview"
                                    className="w-full h-full object-cover rounded-md border border-base-content/20 shadow-sm"
                                />
                            </div>
                        </div>
                    )}
                </fieldset>

                {/* Hero Slider Checkbox */}
                <fieldset className="fieldset">
                    <label className="label cursor-pointer justify-start gap-4">
                        <input
                            type="checkbox"
                            {...register("showInHeroSlider")}
                            className="checkbox checkbox-primary"
                        />
                        <span className="label-text text-lg text-base-content">Show in Hero Slider</span>
                    </label>
                    <p className="text-sm text-base-content/70 mt-1">Check this to display the product in the homepage hero slider.</p>
                </fieldset>

                {/* Images Upload */}
                <fieldset className="fieldset border p-4 rounded-lg border-primary/50 bg-base-100">
                    <label className="label text-lg font-semibold text-base-content">Product Images Upload (Multiple) <span className="text-error">*</span></label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        {...register("images", { required: "At least one image is required" })}
                        onChange={(e) => {
                            register('images').onChange(e);
                            handleImageChange(e);
                        }}
                        className="file-input file-input-bordered w-full bg-base-100"
                    />
                    {errors.images && <p className="text-error text-sm mt-1">{errors.images.message}</p>}

                    {/* Image Preview */}
                    {imagePreviews.length > 0 && (
                        <div className="mt-4">
                            <p className="col-span-full font-medium mb-2 text-base-content">Image Previews:</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {imagePreviews.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`Product preview ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-md border border-base-content/20 shadow-sm"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </fieldset>

                {/* Show on Home Page Toggle */}
                <fieldset className="flex items-center space-x-3 pt-4">
                    <input
                        type="checkbox"
                        {...register("showOnHomePage")}
                        className="checkbox checkbox-primary"
                        id="showhome"
                    />

                    <label
                        htmlFor="showhome"
                        className="label cursor-pointer"
                    >
                        <span className="label-text text-lg font-medium text-base-content">Show on Home Page "Our Products" section</span>
                    </label>
                </fieldset>

                <input
                    type="submit"
                    value={isUploading ? "Adding Product..." : "Add Product"}
                    className="btn btn-primary text-white w-fit mt-8 text-xl px-10"
                    disabled={isUploading || userData?.status === 'suspended'}
                />
            </form>
            </div>
        </div>
    );
};

export default AddProduct;