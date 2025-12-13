import React from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaDollarSign } from 'react-icons/fa';
import { useNavigate } from 'react-router';
// ⭐ New Imports for dynamic data ⭐
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Loading/Loading';

// =======================================================
// 1. STATIC DATA REMOVED - The fetching logic will replace this
// =======================================================
// The large staticProducts array is removed.

// =======================================================
// 2. FRAMER MOTION VARIANTS (For smooth loading)
// =======================================================
const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

// =======================================================
// 3. COMPONENT
// =======================================================
const ProductsSection = () => {
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure(); // Initialize custom hook

    // ⭐ FETCH LOGIC USING TANSTACK QUERY ⭐
    const {
        data: limitedProducts = [], // Rename data to limitedProducts and default to empty array
        isLoading,
    } = useQuery({
        queryKey: ["featured-products"],
        queryFn: async () => {
            // Assumes your backend /products route supports query parameters 
            // to filter by showOnHomePage (featured: true) and limit results.
            const res = await axiosSecure.get('/products', {
                params: {
                    featured: true, // Filters products where showOnHomePage is true
                    limit: 6        // Ensures we only fetch the first 6
                }
            });
            return res.data;
        },
    });

    const handleViewDetails = (productId) => {
        navigate(`/product/${productId}`);
    };

    // ⭐ Handle Loading State ⭐
    if (isLoading) {
        return <Loading />;
    }

    // ⭐ Handle No Products Found ⭐
    if (limitedProducts.length === 0) {
        return (
            <section className="py-20 bg-base-100 text-center">
                <p className="text-xl text-gray-500">No featured products available right now.</p>
            </section>
        );
    }

    return (
        <section className="py-20 bg-base-100">
            <div className="container mx-auto px-4">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-extrabold text-base-content mb-3">
                        Featured Products
                    </h2>
                    <p className="text-xl text-base-content/70">
                        Explore our top-selling garments, built with quality and tradition.
                    </p>
                </motion.div>

                {/* Product Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                >
                    {/* ⭐ MAPPING FETCHED DATA ⭐ */}
                    {limitedProducts.map((product) => (
                        <motion.div
                            key={product._id}
                            variants={cardVariants}
                            className="card w-full bg-base-200 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                        >
                            <figure className="h-64 overflow-hidden">
                                <img
                                    // Use the first image URL from the array, with a fallback
                                    src={product.images?.[0] || 'placeholder-image-url'}
                                    alt={product.title}
                                    className="object-cover w-full h-full"
                                />
                            </figure>

                            <div className="card-body p-6">
                                {/* Use product.title for the name */}
                                <h3 className="card-title text-2xl font-bold text-base-content mb-2">
                                    {product.title}
                                </h3>

                                {/* Use product.description for the short description */}
                                <p className="text-base text-base-content/80 mb-3 line-clamp-2">
                                    {product.description}
                                </p>

                                {/* Price */}
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="flex items-center text-3xl font-extrabold text-primary">
                                        <FaDollarSign className="w-5 h-5 mr-1" />
                                        {product.price?.toLocaleString()}
                                    </span>

                                    {/* View Details Button, using product._id */}
                                    <button
                                        onClick={() => handleViewDetails(product._id)}
                                        className="btn btn-primary btn-md shadow-lg"
                                    >
                                        <FaEye /> View Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="text-center mt-12">
                    <button className="btn btn-neutral btn-wide shadow-md">
                        Browse All Garments
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ProductsSection;