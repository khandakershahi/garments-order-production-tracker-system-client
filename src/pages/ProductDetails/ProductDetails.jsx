import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { FaDollarSign, FaBoxes, FaVideo, FaInfoCircle, FaRegCheckCircle, FaShoppingBag, FaBan } from 'react-icons/fa';
import { motion } from 'framer-motion';

// ⭐ Required Project Imports ⭐

import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole'; // Assuming this hook exists

import BookingModal from './BookingModal';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Loading from '../../components/Loading/Loading';

const ProductDetails = () => {
    const { id } = useParams(); // Get the product ID from the URL path: /product/:id
    const axiosSecure = useAxiosSecure();
    const { user, loading: authLoading } = useAuth();

    // ⭐ Role Check: Determine if the current user can place an order ⭐
    const { role, isLoading: isRoleLoading } = useRole();
    const isUser = role === 'member'; // Only standard members can book/order

    // State for the Booking Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. Fetch the single product data
    const {
        data: product = null,
        isLoading: isProductLoading,
        error
    } = useQuery({
        queryKey: ["product", id],
        enabled: !!id && !authLoading, // Only run the query if ID exists and auth is settled
        queryFn: async () => {
            const res = await axiosSecure.get(`/products/${id}`);
            return res.data;
        },
    });

    // Handle combined loading states
    if (authLoading || isProductLoading || isRoleLoading) {
        return <Loading />;
    }

    // Handle Error State (e.g., 404 Not Found)
    if (error || !product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-base-200 p-8">
                <FaInfoCircle className="w-12 h-12 text-error mb-4" />
                <h1 className="text-3xl font-bold text-error">Product Details Error</h1>
                <p className="text-lg text-gray-600 mt-2">
                    {error?.response?.status === 404
                        ? "The requested product was not found."
                        : "Failed to load product details. Please try again."}
                </p>
            </div>
        );
    }

    // Safely access the first image for the main display
    const mainImage = product.images?.[0] || 'https://via.placeholder.com/600x400?text=No+Image';

    // Determine button state message
    const getButtonMessage = () => {
        if (!user) {
            return "Log In to Order";
        }
        if (role === 'admin' || role === 'manager') {
            return "Admins/Managers Cannot Order";
        }
        return "Order Now / Book";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-12 bg-white shadow-xl rounded-xl"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* === A. Image Gallery and Video Link === */}
                <div className="space-y-6">
                    {/* Main Image */}
                    <figure className="aspect-video rounded-lg overflow-hidden shadow-md">
                        <img src={mainImage} alt={product.title} className="w-full h-full object-cover" />
                    </figure>

                    {/* Thumbnail Gallery (Clicking these would change the mainImage in a real app) */}
                    <div className="flex space-x-3 overflow-x-auto pb-2">
                        {product.images?.slice(0, 5).map((imgUrl, index) => (
                            <img
                                key={index}
                                src={imgUrl}
                                alt={`${product.title} thumbnail ${index + 1}`}
                                className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${index === 0 ? 'border-primary' : 'border-gray-200'} transition-colors`}
                            />
                        ))}
                    </div>

                    {/* Demo Video Link */}
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

                {/* === B. Product Information & Ordering === */}
                <div className="space-y-6">
                    <h1 className="text-4xl font-extrabold text-gray-800 border-b pb-3 mb-4">
                        {product.title}
                    </h1>

                    {/* Price and Action */}
                    <div className="bg-primary/10 p-4 rounded-lg shadow-inner">
                        <span className="flex items-center text-4xl font-extrabold text-primary">
                            <FaDollarSign className="w-7 h-7 mr-1" />
                            {product.price?.toLocaleString()}
                        </span>
                        <p className="text-md text-gray-600 mt-2">
                            Payment: <span className='font-bold'>{product.paymentOption}</span>
                        </p>
                    </div>


                    {/* Order / Booking Button */}
                    <button
                        className={`btn btn-lg w-full shadow-xl transition-transform duration-200 ${isUser ? 'btn-secondary hover:scale-[1.01]' : 'btn-disabled'}`}
                        onClick={() => isUser && setIsModalOpen(true)}
                        disabled={!isUser}
                        title={getButtonMessage()}
                    >
                        {isUser ? <FaShoppingBag /> : <FaBan />}
                        {getButtonMessage()}
                    </button>

                    {/* Key Details */}
                    <div className="space-y-3 pt-4 border-t">
                        <p className="text-lg text-gray-700">
                            <span className="font-semibold">Category:</span> {product.category}
                        </p>
                        <p className="flex items-center text-lg text-gray-700">
                            <FaBoxes className="w-5 h-5 mr-2 text-warning" />
                            <span className="font-semibold">Available Stock:</span> {product.availableQuantity} units
                        </p>
                        <p className="text-lg text-gray-700">
                            <span className="font-semibold">Minimum Order Quantity:</span> {product.minOrderQuantity} units
                        </p>
                        <p className="flex items-center text-lg text-gray-700">
                            <FaRegCheckCircle className="w-5 h-5 mr-2 text-success" />
                            <span className="font-semibold">Managed By:</span> {product.managerEmail}
                        </p>
                        <p className="text-sm text-gray-500 pt-2">
                            <span className="font-semibold">Product ID:</span> {product.productId}
                        </p>
                    </div>
                </div>
            </div>

            {/* === C. Full Description === */}
            <div className="mt-12 pt-8 border-t">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Product Description</h2>
                {/* Use whitespace-pre-wrap to respect line breaks from the database */}
                <p className="text-lg text-gray-700 whitespace-pre-wrap">
                    {product.description}
                </p>
            </div>

            {/* === D. Booking Modal === */}
            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productData={product}
                isUser={isUser}
            />
        </motion.div>
    );
};

export default ProductDetails;