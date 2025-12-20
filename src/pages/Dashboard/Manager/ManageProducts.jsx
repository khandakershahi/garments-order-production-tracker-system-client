import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaEdit, FaTrash, FaHome, FaTimesCircle, FaPlus, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import Loading from '../../../components/Loading/Loading';
import EditProductModal from './EditProductModal';
import { Link } from 'react-router'; // ⭐ Ensure correct import for Link

const ManageProducts = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [searchText, setSearchText] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

    // 1. Fetch Manager's Products
    const {
        data: responseData, // ⭐ CHANGED: Get the full response object
        isLoading,
        refetch
    } = useQuery({
        queryKey: ["manager-products", user?.email, searchText],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/products`, {
                params: {
                    managerEmail: user.email,
                    searchText: searchText,
                    // Optionally, you might want a high limit here since this is a management view
                    limit: 1000
                }
            });
            return res.data; // Returns { products: [...], totalCount: 0, ... }
        },
    });

    // ⭐ NEW LINE: Safely extract the products array ⭐
    const products = responseData?.products || [];
    // const totalCount = responseData?.totalCount || 0; // Optional: for display

    // --- Action Handlers ---

    // Handle Search Submission
    const handleSearch = (e) => {
        e.preventDefault();
        const input = e.target.search.value.trim(); // Trim whitespace
        setSearchText(input);
    };

    // ... (handleToggleHomePage, handleDelete, handleEdit, handleEditSuccess functions remain the same) ...
    // ... (For brevity, keeping action handlers as is, assuming they are correct) ...


    // Handle Toggling Home Page Visibility
    const handleToggleHomePage = async (product) => {
        // ... (implementation remains the same) ...
        const newStatus = !product.showOnHomePage;
        try {
            await axiosSecure.patch(`/products/${product._id}`, { showOnHomePage: newStatus });
            Swal.fire({
                icon: 'success',
                title: 'Status Updated',
                text: `${product.title} is now ${newStatus ? 'featured' : 'removed'} from the home page.`,
                timer: 2000,
                showConfirmButton: false
            });
            refetch();
        } catch (error) {
            Swal.fire('Error', 'Failed to update feature status.', 'error');
        }
    };

    // Handle Deleting a Product
    const handleDelete = (product) => {
        // ... (implementation remains the same) ...
        Swal.fire({
            title: `Are you sure you want to delete "${product.title}"?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/products/${product._id}`);
                    if (res.data.deletedCount > 0) {
                        Swal.fire(
                            'Deleted!',
                            'Your product has been deleted.',
                            'success'
                        );
                        refetch();
                    } else {
                        Swal.fire('Error', 'Could not delete product.', 'error');
                    }
                } catch (error) {
                    Swal.fire('Error', 'Failed to delete product.', 'error');
                }
            }
        });
    };


    // Handle Edit - Fetches data and opens modal
    const handleEdit = async (product) => {
        // ... (implementation remains the same) ...
        setIsModalOpen(true);
        setProductToEdit(null);

        try {
            const res = await axiosSecure.get(`/products/${product._id}`);
            setProductToEdit(res.data);
        } catch (error) {
            console.error("Failed to fetch product for editing:", error);
            setIsModalOpen(false);
            Swal.fire('Error', 'Failed to load product details for editing.', 'error');
        }
    };

    // Helper to close modal and refresh data after successful edit
    const handleEditSuccess = () => {
        // ... (implementation remains the same) ...
        setIsModalOpen(false);
        setProductToEdit(null);
        refetch();
    };


    if (isLoading) {
        return <Loading />;
    }


    return (
        <div className="bg-base-100 min-h-screen p-8">
            <div className="bg-base-200 p-8 rounded-xl shadow-lg">
                <h2 className="text-4xl font-bold text-center mb-8 text-primary">
                    Manage My Products ({products.length})
                </h2>

            {/* ⭐ Search Input and Add Button ⭐ */}
            <div className="flex justify-between items-center mb-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        name="search"
                        defaultValue={searchText}
                        placeholder="Search by title..."
                        className="input input-bordered w-full max-w-xs bg-base-100 text-base-content"
                    />
                    <button type="submit" className="btn btn-primary">
                        <FaSearch />
                    </button>
                </form>

                {/* Assuming you have a way to navigate to Add Product page */}
                <Link to='/dashboard/add-product'
                    className="btn btn-secondary text-white"
                >
                    <FaPlus /> Add New Product
                </Link>
            </div>

            <div className="overflow-x-auto border border-base-content/20 rounded-lg bg-base-100">
                <table className="table w-full">
                    {/* ⭐ Table Head ⭐ */}
                    <thead>
                        <tr className="bg-base-300 text-base-content">
                            <th>#</th>
                            <th>Image</th>
                            <th>Product Info</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>SKU / ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-12 text-xl text-base-content/70">
                                    No products found for your account. Try adding one!
                                </td>
                            </tr>
                        ) : (
                            products.map((product, index) => (
                                <tr key={product._id} className="hover:bg-base-200 transition-colors">
                                    <td className="text-base-content">{index + 1}</td>

                                    {/* ⭐ Product Data Columns ⭐ */}
                                    <td>
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12 aspect-auto">
                                                {/* Use the first image for the thumbnail */}
                                                <img src={product.featureImage || 'placeholder-image-url'} alt={`Image of ${product.title}`} />
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-bold text-base-content">{product.title}</div>
                                        <div className="text-sm opacity-50 text-base-content">{product.category}</div>
                                    </td>
                                    <td className="text-base-content">
                                        Available: {product.availableQuantity}
                                        <br />
                                        <span className="badge badge-ghost badge-sm">MOQ: {product.minOrderQuantity}</span>
                                    </td>
                                    <td className="text-base-content">
                                        ${product.price?.toFixed(2)}
                                    </td>
                                    <td>
                                        <span className="text-xs text-base-content">{product.productId}</span>
                                    </td>

                                    {/* Action Buttons */}
                                    <td className="flex items-center gap-2">

                                        {/* Toggle Home Page Button */}
                                        <button
                                            onClick={() => handleToggleHomePage(product)}
                                            className={`btn btn-sm ${product.showOnHomePage ? 'btn-success' : 'btn-ghost'}`}
                                            title={product.showOnHomePage ? "Remove from Home Page" : "Feature on Home Page"}
                                        >
                                            {product.showOnHomePage ? <FaTimesCircle /> : <FaHome />}
                                        </button>

                                        {/* Edit Button */}
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="btn btn-warning btn-sm"
                                            title="Edit Product Details"
                                        >
                                            <FaEdit />
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDelete(product)}
                                            className="btn btn-error btn-sm text-white"
                                            title="Delete Product"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Product Modal Component */}
            {isModalOpen && (
                <EditProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    productData={productToEdit}
                    onSuccess={handleEditSuccess}
                />
            )}
            </div>
        </div>
    );
};

export default ManageProducts;