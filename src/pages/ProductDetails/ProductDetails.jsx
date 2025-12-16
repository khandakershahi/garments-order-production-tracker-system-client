import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import {
    FaDollarSign,
    FaBoxes,
    FaVideo,
    FaInfoCircle,
    FaRegCheckCircle,
    FaShoppingBag,
    FaBan
} from 'react-icons/fa';
import { motion } from 'framer-motion';

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

    // Sync main image when product loads
    useEffect(() => {
        if (product?.images?.length) {
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
        if (role === 'admin' || role === 'manager') return 'Admins/Managers Cannot Order';
        return 'Order Now / Book';
    };

    return (
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
                        {product.images?.slice(0, 5).map((imgUrl, index) => (
                            <img
                                key={index}
                                src={imgUrl}
                                alt={`${product.title} thumbnail ${index + 1}`}
                                onClick={() => setSelectedImage(imgUrl)}
                                className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition-all
                  ${selectedImage === imgUrl
                                        ? 'border-primary scale-105'
                                        // ⭐ FIX: Changed border-gray-200 to border-base-300 (or border-base-content/20) ⭐
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
                        className={`btn btn-lg w-full shadow-xl transition-transform ${isUser ? 'btn-secondary hover:scale-[1.01]' : 'btn-disabled'
                            }`}
                        onClick={() => isUser && setIsModalOpen(true)}
                        disabled={!isUser}
                        title={getButtonMessage()}
                    >
                        {isUser ? <FaShoppingBag /> : <FaBan />}
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

            {/* ================= BOOKING MODAL ================= */}
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