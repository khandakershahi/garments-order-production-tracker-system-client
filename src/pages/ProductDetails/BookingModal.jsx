import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router';
import { FaTimes, FaDollarSign } from 'react-icons/fa';
import { bangladeshDistricts } from '../../data/districts';

const BookingModal = ({ isOpen, onClose, productData, isUser }) => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    // Determine the user's email for pre-filling
    const userEmail = user?.email || '';

    // Quantity constraints from productData
    const availableQuantity = productData?.availableQuantity || 0;
    const minOrderQuantity = productData?.minOrderQuantity || 1;
    const unitPrice = productData?.price || 0;

    // Initialize react-hook-form
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { isSubmitting, errors },
    } = useForm({
        defaultValues: {
            email: userEmail,
            productTitle: productData?.title || '',
            unitPrice: unitPrice,
            orderQuantity: minOrderQuantity, // Start with MOQ as default
            totalPrice: unitPrice * minOrderQuantity, // Initial calculation
            firstName: user?.displayName?.split(' ')[0] || '', // Pre-fill first name if available
            lastName: user?.displayName?.split(' ')[1] || '', // Pre-fill last name if available
            contactNumber: '',
            district: '',
            deliveryAddress: '',
            additionalNotes: '',
        }
    });

    // Watch the orderQuantity field to calculate the total price dynamically
    const watchedQuantity = watch('orderQuantity');

    // Effect to recalculate totalPrice whenever quantity changes
    React.useEffect(() => {
        const quantity = parseFloat(watchedQuantity) || 0;
        const total = quantity * unitPrice;
        // Use setValue to update the read-only totalPrice field, rounded to 2 decimal places
        setValue('totalPrice', total.toFixed(2));
    }, [watchedQuantity, unitPrice, setValue]);

    // --- Submission Handler ---
    const onSubmit = async (data) => {
        // Construct the booking object for the backend
        const bookingData = {
            productId: productData._id,
            productTitle: data.productTitle,
            userEmail: data.email,
            unitPrice: data.unitPrice,
            orderQuantity: parseFloat(data.orderQuantity),
            totalPrice: parseFloat(data.totalPrice),
            customerName: `${data.firstName} ${data.lastName}`,
            contactNumber: data.contactNumber,
            district: data.district,
            deliveryAddress: data.deliveryAddress,
            paymentOption: productData.paymentOption,
            additionalNotes: data.additionalNotes || null,
        };

        try {
            const res = await axiosSecure.post('/bookings', bookingData);

            if (res.data.insertedId) {

                // Close modal and reset form
                onClose();
                reset();

                if (productData.paymentOption === "PayFast") {
                    Swal.fire({
                        icon: 'info',
                        title: 'Payment Required',
                        text: `Order submitted. Please complete the ${productData.paymentOption} payment.`,
                        confirmButtonText: 'Go to Payment',
                    }).then(() => {
                        // ⭐ To be implemented: Redirect to the payment processing page
                        // navigate(`/payment/${res.data.insertedId}`); 
                    });

                } else { // Cash on Delivery
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `Order Placed Successfully!`,
                        text: `Your ${productData.paymentOption} order for ${data.productTitle} is confirmed.`,
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }

                // Redirect user to My Orders page after successful booking
                navigate('/dashboard/my-orders');

            } else {
                Swal.fire('Error', 'Failed to place the order. Please try again.', 'error');
            }
        } catch (error) {
            console.error("Booking submission failed:", error);
            // Use the backend error message if available
            Swal.fire('Error', error.response?.data?.message || 'Failed to complete booking due to a server error.', 'error');
        }
    };

    // If modal is not open, return null immediately
    if (!isOpen) return null;

    // Check if the current user is authorized to book (isUser is passed from parent)
    if (!isUser) {
        return (
            <dialog className="modal modal-open">
                <div className="modal-box bg-red-100 border-l-4 border-error text-error p-6">
                    <h3 className="font-bold text-xl mb-4">Access Denied</h3>
                    <p>You must be a standard member to place an order.</p>
                    <p className='mt-2 text-sm'>Admins and Managers cannot use the booking feature.</p>
                    <div className="modal-action">
                        <button className="btn btn-error text-white" onClick={onClose}>Close</button>
                    </div>
                </div>
            </dialog>
        );
    }


    return (
        <dialog className={`modal ${isOpen ? 'modal-open' : ''}`} onClose={onClose}>
            <div className="modal-box w-11/12 max-w-3xl p-6">
                <h3 className="font-bold text-2xl text-primary mb-6">
                    Place Order for: {productData.title}
                </h3>

                {/* Close Button */}
                <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={onClose}
                    disabled={isSubmitting}
                >
                    <FaTimes />
                </button>

                {/* --- Booking Form --- */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Read-Only Info Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Your Email (Read-Only)</span></label>
                            <input type="email" {...register("email")} readOnly className="input input-bordered w-full bg-gray-100" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Product Title (Read-Only)</span></label>
                            <input type="text" {...register("productTitle")} readOnly className="input input-bordered w-full bg-gray-100" />
                        </div>
                    </div>

                    {/* Quantity and Price */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Unit Price (Read-Only)</span></label>
                            <input type="number" {...register("unitPrice")} readOnly className="input input-bordered w-full bg-gray-100" />
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text">Order Quantity</span></label>
                            <input
                                type="number"
                                {...register("orderQuantity", {
                                    required: "Quantity is required",
                                    valueAsNumber: true,
                                    min: {
                                        value: minOrderQuantity,
                                        message: `Must be at least the MOQ (${minOrderQuantity})`
                                    },
                                    max: {
                                        value: availableQuantity,
                                        message: `Cannot exceed available stock (${availableQuantity})`
                                    },
                                })}
                                className="input input-bordered w-full"
                                placeholder={`Min: ${minOrderQuantity}, Max: ${availableQuantity}`}
                            />
                            {errors.orderQuantity && <p className="text-error text-sm mt-1">{errors.orderQuantity.message}</p>}
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text">Total Price (Read-Only)</span></label>
                            <div className="relative">
                                <input type="number" {...register("totalPrice")} readOnly className="input input-bordered w-full pl-8 bg-success/20 text-success font-bold" />
                                <FaDollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 text-success" />
                            </div>
                        </div>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">First Name</span></label>
                            <input type="text" {...register("firstName", { required: "First Name is required" })} className="input input-bordered w-full" />
                            {errors.firstName && <p className="text-error text-sm mt-1">{errors.firstName.message}</p>}
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Last Name</span></label>
                            <input type="text" {...register("lastName", { required: "Last Name is required" })} className="input input-bordered w-full" />
                            {errors.lastName && <p className="text-error text-sm mt-1">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    {/* Contact & Address */}
                    <div className="form-control">
                        <label className="label"><span className="label-text">Contact Number</span></label>
                        <input type="text" {...register("contactNumber", { required: "Contact Number is required" })} className="input input-bordered w-full" />
                        {errors.contactNumber && <p className="text-error text-sm mt-1">{errors.contactNumber.message}</p>}
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text">District</span></label>
                        <select {...register("district", { required: "District is required" })} className="select select-bordered w-full">
                            <option value="">Select District</option>
                            {bangladeshDistricts.map((district) => (
                                <option key={district} value={district}>{district}</option>
                            ))}
                        </select>
                        {errors.district && <p className="text-error text-sm mt-1">{errors.district.message}</p>}
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text">Delivery Address</span></label>
                        <textarea {...register("deliveryAddress", { required: "Delivery Address is required" })} className="textarea textarea-bordered w-full h-20" placeholder="House/Flat, Road, Area" />
                        {errors.deliveryAddress && <p className="text-error text-sm mt-1">{errors.deliveryAddress.message}</p>}
                    </div>

                    {/* Additional Notes */}
                    <div className="form-control">
                        <label className="label"><span className="label-text">Additional Notes / Instructions (Optional)</span></label>
                        <textarea {...register("additionalNotes")} className="textarea textarea-bordered w-full h-16" />
                    </div>

                    <div className="modal-action justify-start pt-4">
                        <button
                            type="submit"
                            className="btn btn-primary text-white btn-lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Processing Order...' : `Confirm Order (${productData.paymentOption})`}
                        </button>
                    </div>
                </form>

            </div>
        </dialog>
    );
};

export default BookingModal;