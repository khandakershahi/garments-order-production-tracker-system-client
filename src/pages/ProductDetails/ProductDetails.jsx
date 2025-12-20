import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import {
    FaDollarSign,
    FaBoxes,
    FaVideo,
    FaInfoCircle,
    FaRegCheckCircle,
    FaShoppingBag,
    FaBan,
    FaStar
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';
import BookingModal from './BookingModal';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Loading from '../../components/Loading/Loading';

const ProductDetails = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { user, loading: authLoading } = useAuth();
    const { role, roleLoading: isRoleLoading } = useRole();

    // Support both 'member' and 'buyer' role labels as standard users
    const isUser = role === 'member' || role === 'buyer';

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [feedbackData, setFeedbackData] = useState({ rating: 5, comment: '' });
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

    // Fetch product
    const {
        data: product = null,
        isLoading: isProductLoading,
        error
    } = useQuery({
        queryKey: ['product', id],
        enabled: !!id && !authLoading,
        queryFn: async () => {
            const res = await axiosSecure.get(`/products/${id}`);
            return res.data;
        }
    });

    // Fetch current user data to check suspend status
    const { data: userData = null } = useQuery({
        queryKey: ['user-data', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}/role`);
            return res.data;
        }
    });

    // Fetch feedbacks for this product
    const {
        data: productFeedbacks = [],
        refetch: refetchFeedbacks
    } = useQuery({
        queryKey: ['product-feedbacks', id],
        enabled: !!id,
        queryFn: async () => {
            const res = await axiosSecure.get(`/feedbacks/product/${id}`);
            return res.data || [];
        }
    });

    // Sync main image when product loads - prioritize feature image
    useEffect(() => {
        if (product?.featureImage) {
            setSelectedImage(product.featureImage);
        } else if (product?.images?.length) {
            setSelectedImage(product.images[0]);
        }
    }, [product]);

    // Loading state
    if (authLoading || isProductLoading || isRoleLoading) {
        return <Loading />;
    }

    // Error state
    if (error || !product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-base-200 p-8">
                <FaInfoCircle className="w-12 h-12 text-error mb-4" />
                <h1 className="text-3xl font-bold text-error">Product Details Error</h1>
                {/* ⭐ FIX: Changed text-gray-600 to text-base-content/70 ⭐ */}
                <p className="text-lg text-base-content/70 mt-2">
                    {error?.response?.status === 404
                        ? 'The requested product was not found.'
                        : 'Failed to load product details. Please try again.'}
                </p>
            </div>
        );
    }

    const getButtonMessage = () => {
        if (!user) return 'Log In to Order';
        if (userData?.status === 'suspended') return 'Account Suspended - Cannot Order';
        if (role === 'admin' || role === 'manager') return 'Admins/Managers Cannot Order';
        return 'Order Now / Book';
    };

    const isOrderButtonDisabled = !user || !isUser || userData?.status === 'suspended';

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            Swal.fire('Error', 'Please login to submit feedback', 'error');
            return;
        }

        if (!feedbackData.comment.trim()) {
            Swal.fire('Error', 'Please write a comment', 'error');
            return;
        }

        setIsSubmittingFeedback(true);
        try {
                        // Fallback to email username if displayName is not set
                        const userName = user.displayName || user.email?.split('@')[0] || 'Anonymous';
            
            const feedback = {
                productId: product._id,
                productName: product.title,
                userName: userName,
                userEmail: user.email,
                rating: feedbackData.rating,
                comment: feedbackData.comment,
                createdAt: new Date()
            };

            await axiosSecure.post('/feedbacks', feedback);
            
            Swal.fire({
                icon: 'success',
                title: 'Thank you!',
                text: 'Your feedback has been submitted successfully',
                timer: 2000,
                showConfirmButton: false
            });
            
            setFeedbackData({ rating: 5, comment: '' });
            refetchFeedbacks(); // Refresh feedbacks list
        } catch (error) {
            console.error('Feedback submission error:', error);
            Swal.fire('Error', 'Failed to submit feedback. Please try again.', 'error');
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>{product?.productName ? `${product.productName} - Product Details` : 'Product Details'} | Garments Order Tracker</title>
                <meta name="description" content={product?.description || 'View product details and place your order'} />
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                // ⭐ FIX: Changed bg-white to theme-aware bg-base-100 ⭐
                className="container mx-auto px-4 py-12 bg-base-100 shadow-xl rounded-xl my-4"
            >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* ================= IMAGE GALLERY ================= */}
                <div className="space-y-6">
                    {/* Main Image */}
                    <figure className="aspect-square rounded-lg overflow-hidden shadow-md">
                        <img
                            src={
                                selectedImage ||
                                'https://via.placeholder.com/600x400?text=No+Image'
                            }
                            alt={product.title}
                            // Removed aspect-square class from the image itself as it was conflicting with aspect-video on figure
                            className="w-full h-full object-cover"
                        />
                    </figure>

                    {/* Thumbnails */}
                    <div className="flex space-x-3 overflow-x-auto pb-2">
                        {/* Feature Image First */}
                        {product.featureImage && (
                            <img
                                src={product.featureImage}
                                alt={`${product.title} feature image`}
                                onClick={() => setSelectedImage(product.featureImage)}
                                className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition-all
                  ${selectedImage === product.featureImage
                                        ? 'border-primary scale-105'
                                        : 'border-base-300 hover:border-primary/50'
                                    }`}
                            />
                        )}
                        {/* Other Product Images */}
                        {product.images?.map((imgUrl, index) => (
                            <img
                                key={index}
                                src={imgUrl}
                                alt={`${product.title} thumbnail ${index + 1}`}
                                onClick={() => setSelectedImage(imgUrl)}
                                className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition-all
                  ${selectedImage === imgUrl
                                        ? 'border-primary scale-105'
                                        : 'border-base-300 hover:border-primary/50'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Demo Video */}
                    {product.videoLink && (
                        <a
                            href={product.videoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline btn-info w-full"
                        >
                            <FaVideo /> Watch Demo Video
                        </a>
                    )}
                </div>

                {/* ================= PRODUCT INFO ================= */}
                <div className="space-y-6">
                    {/* ⭐ FIX: Changed text-gray-800 to theme-aware text-base-content ⭐ */}
                    <h1 className="text-4xl font-extrabold text-base-content border-b pb-3">
                        {product.title}
                    </h1>

                    <div className="bg-primary/10 p-4 rounded-lg shadow-inner">
                        <span className="flex items-center text-4xl font-extrabold text-primary">
                            <FaDollarSign className="w-7 h-7 mr-1" />
                            {product.price?.toLocaleString()}
                        </span>
                        {/* ⭐ FIX: Changed text-gray-600 to text-base-content/70 ⭐ */}
                        <p className="text-md text-base-content/70 mt-2">
                            Payment: <span className="font-bold">{product.paymentOption}</span>
                        </p>
                    </div>

                    <button
                        className={`btn btn-lg w-full shadow-xl transition-transform ${!isOrderButtonDisabled ? 'btn-secondary hover:scale-[1.01]' : 'btn-disabled'
                            }`}
                        onClick={() => !isOrderButtonDisabled && setIsModalOpen(true)}
                        disabled={isOrderButtonDisabled}
                        title={getButtonMessage()}
                    >
                        {!isOrderButtonDisabled ? <FaShoppingBag /> : <FaBan />}
                        {getButtonMessage()}
                    </button>

                    <div className="space-y-3 pt-4 border-t">
                        {/* ⭐ FIX: Changed text-gray-700 to text-base-content/80 ⭐ */}
                        <p className="text-lg text-base-content/80">
                            <span className="font-semibold">Category:</span> {product.category}
                        </p>
                        {/* ⭐ FIX: Changed text-gray-700 to text-base-content/80 ⭐ */}
                        <p className="flex items-center text-lg text-base-content/80">
                            <FaBoxes className="w-5 h-5 mr-2 text-warning" />
                            <span className="font-semibold">Available Stock:</span>{' '}
                            {product.availableQuantity} units
                        </p>
                        {/* ⭐ FIX: Changed text-gray-700 to text-base-content/80 ⭐ */}
                        <p className="text-lg text-base-content/80">
                            <span className="font-semibold">Minimum Order Quantity:</span>{' '}
                            {product.minOrderQuantity} units
                        </p>
                        {/* ⭐ FIX: Changed text-gray-700 to text-base-content/80 ⭐ */}
                        <p className="flex items-center text-lg text-base-content/80">
                            <FaRegCheckCircle className="w-5 h-5 mr-2 text-success" />
                            <span className="font-semibold">Managed By:</span>{' '}
                            {product.managerEmail}
                        </p>
                        {/* ⭐ FIX: Changed text-gray-500 to text-base-content/50 ⭐ */}
                        <p className="text-sm text-base-content/50 pt-2">
                            <span className="font-semibold">Product ID:</span>{' '}
                            {product.productId}
                        </p>
                    </div>
                </div>
            </div>

            {/* ================= DESCRIPTION ================= */}
            <div className="mt-12 pt-8 border-t">
                {/* ⭐ FIX: Changed text-gray-800 to text-base-content ⭐ */}
                <h2 className="text-3xl font-bold text-base-content mb-4">
                    Product Description
                </h2>
                {/* ⭐ FIX: Changed text-gray-700 to text-base-content/80 ⭐ */}
                <p className="text-lg text-base-content/80 whitespace-pre-wrap">
                    {product.description}
                </p>
            </div>

            {/* ================= EXISTING FEEDBACKS ================= */}
            <div className="mt-12 pt-8 border-t">
                <h2 className="text-3xl font-bold text-base-content mb-6">
                    Customer Reviews ({productFeedbacks.length})
                </h2>
                
                {productFeedbacks.length === 0 ? (
                    <p className="text-base-content/70 text-center py-8">
                        No reviews yet. Be the first to share your experience!
                    </p>
                ) : (
                    <div className="space-y-6">
                        {productFeedbacks.map((feedback) => (
                            <div key={feedback._id} className="bg-base-200 p-6 rounded-lg shadow-md">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-lg text-base-content">
                                            {feedback.userName}
                                        </h3>
                                        <p className="text-sm text-base-content/60">
                                            {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex text-yellow-500">
                                        {[...Array(feedback.rating)].map((_, i) => (
                                            <FaStar key={i} className="text-lg" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-base-content/80 whitespace-pre-wrap">
                                    {feedback.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ================= FEEDBACK FORM ================= */}
            <div className="mt-12 pt-8 border-t">
                <h2 className="text-3xl font-bold text-base-content mb-6">
                    Share Your Feedback
                </h2>
                <form onSubmit={handleFeedbackSubmit} className="bg-base-200 p-6 rounded-lg shadow-md">
                    {/* Rating */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-semibold">Rating</span>
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                                    className="btn btn-circle btn-sm"
                                >
                                    <FaStar
                                        className={`text-xl ${
                                            star <= feedbackData.rating
                                                ? 'text-yellow-500'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                </button>
                            ))}
                            <span className="ml-2 self-center text-base-content/70">
                                {feedbackData.rating} star{feedbackData.rating !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-semibold mr-5">Your Feedback</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered h-32"
                            placeholder="Share your experience with this product..."
                            value={feedbackData.comment}
                            onChange={(e) => setFeedbackData({ ...feedbackData, comment: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmittingFeedback || !user}
                    >
                        {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                    
                    {!user && (
                        <p className="text-sm text-error mt-2">Please login to submit feedback</p>
                    )}
                </form>
            </div>

            {/* ================= BOOKING MODAL ================= */}
            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productData={product}
                isUser={isUser}
            />
        </motion.div>
        </>
    );
};
export default ProductDetails;