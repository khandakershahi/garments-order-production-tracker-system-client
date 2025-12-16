import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaDollarSign, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Loading from '../../components/Loading/Loading';

// ================= ANIMATION =================
const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

const PRODUCT_CATEGORIES = [
    "Shirt", "Pant", "Jacket", "Panjabi",
    "Sharee", "Three Piece", "Kurti", "Others"
];

const ITEMS_PER_PAGE = 9;

const AllProducts = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const {
        data,
        isLoading,
    } = useQuery({
        queryKey: ['all-products', searchText, category, page],
        queryFn: async () => {
            const res = await axiosSecure.get('/products', {
                params: {
                    searchText,
                    category,
                    page,
                    limit: ITEMS_PER_PAGE,
                },
            });
            return res.data;
        },
        keepPreviousData: true,
    });


    const products = data?.products || [];
    const totalCount = data?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const handleViewDetails = (id) => {
        navigate(`/product/${id}`);
    };

    if (isLoading) return <Loading />;

    return (
        <section className="py-16 bg-base-100">
            <div className="container mx-auto px-4">

                {/* HEADER */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold mb-2">All Products</h1>
                    <p className="text-base-content/70">
                        Browse our complete garment collection
                    </p>
                </div>

                {/* FILTER BAR */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">

                    {/* Search */}
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            className="input input-bordered w-full pl-10"
                            placeholder="Search products..."
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    {/* Category */}
                    <select
                        className="select select-bordered w-full"
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="">All Categories</option>
                        {PRODUCT_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    {/* Reset */}
                    <button
                        className="btn btn-outline"
                        onClick={() => {
                            setSearchText('');
                            setCategory('');
                            setPage(1);
                        }}
                    >
                        Reset Filters
                    </button>
                </div>

                {/* PRODUCT GRID */}
                {products.length === 0 ? (
                    <p className="text-center text-lg text-gray-500">
                        No products found.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map(product => (
                            <div key={product._id} className="card bg-base-200 shadow-xl">
                                <figure className="h-[500px] w-auto aspect-auto">
                                    <img
                                        src={product.images?.[2]}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                </figure>

                                <div className="card-body">
                                    <h2 className="card-title">{product.title}</h2>
                                    <p className="line-clamp-2">{product.description}</p>

                                    <div className="flex justify-between items-center mt-4">
                                        <span className="flex items-center text-xl font-bold text-primary">
                                            <FaDollarSign className="mr-1" />
                                            {product.price}
                                        </span>

                                        <button
                                            onClick={() => handleViewDetails(product._id)}
                                            className="btn btn-primary btn-md shadow-lg"
                                        >
                                            <FaEye /> View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-4 mt-12">
                        <button
                            className="btn btn-outline"
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            Previous
                        </button>

                        <span className="btn btn-ghost cursor-default">
                            Page {page} of {totalPages}
                        </span>

                        <button
                            className="btn btn-outline"
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                        </button>
                    </div>

                )}
            </div>
        </section>
    );
};

export default AllProducts;
