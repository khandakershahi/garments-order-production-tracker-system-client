import React, { useEffect } from 'react'; // ⭐ Import useEffect ⭐
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Loading/Loading';
import { FaTimes } from 'react-icons/fa';

// Mock data (same as AddProduct.jsx)
const PRODUCT_CATEGORIES = ["Shirt", "Pant", "Jacket", "Panjabi", "Sharee", "Others"];
const PAYMENT_OPTIONS = ["Cash on Delivery", "PayFast"];


const EditProductModal = ({ isOpen, onClose, productData, onSuccess }) => {
    const axiosSecure = useAxiosSecure();

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
                showOnHomePage: productData.showOnHomePage || false,
            };
            // Call reset to populate the form fields with the fetched data
            reset(formValues);
        }
    }, [productData, reset]); // Dependency array: run whenever productData changes

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

    // --- Submission Handler (Remains Unchanged) ---
    const onSubmit = async (data) => {
        const updatedFields = {
            title: data.productName,
            description: data.productDescription,
            category: data.category,
            price: parseFloat(data.price),
            availableQuantity: parseInt(data.availableQuantity),
            minOrderQuantity: parseInt(data.minOrderQuantity),
            videoLink: data.videoLink || null,
            paymentOption: data.paymentOption,
            showOnHomePage: data.showOnHomePage,
        };

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
        }
    };

    return (
        // The rest of the JSX remains the same
        <dialog className={`modal ${isOpen ? 'modal-open' : ''}`} onClose={onClose}>
            <div className="modal-box w-11/12 max-w-4xl p-6">
                <h3 className="font-bold text-2xl text-primary mb-4">
                    Edit Product: {productData.title} ({productData.productId})
                </h3>

                {/* Close Button */}
                <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={onClose}
                    disabled={isSubmitting}
                >
                    <FaTimes />
                </button>

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

                    {/* Show on Home Page Toggle */}
                    <div className="form-control pt-2">
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="checkbox"
                                {...register("showOnHomePage")}
                                className="checkbox checkbox-primary"
                            />
                            <span className="label-text">Feature on Home Page</span>
                        </label>
                    </div>


                    <div className="modal-action justify-start">
                        <button
                            type="submit"
                            className="btn btn-primary text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>

            </div>
        </dialog>
    );
};

export default EditProductModal;