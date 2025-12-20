import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const PRODUCT_CATEGORIES = [
    "T-Shirt",
    "Polo Shirt",
    "Shirt",
    "Pant",
    "Jacket",
    "Sweater",
    "Hoodie",
    "Jeans",
    "Shorts",
    "Dress",
    "Skirt",
    "Uniform",
    "Activewear",
    "Accessories",
    "Other"
];

const AllProductsAdmin = () => {
    const axiosSecure = useAxiosSecure();
    const [searchText, setSearchText] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        unitPrice: '',
        availableQuantity: ''
    });

    const { data: products = [], refetch, isLoading } = useQuery({
        queryKey: ['admin-products', searchText],
        queryFn: async () => {
            const res = await axiosSecure.get(`/admin/products?search=${searchText}`);
            return res.data;
        }
    });

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            title: product.title,
            description: product.description,
            category: product.category,
            unitPrice: product.unitPrice,
            availableQuantity: product.availableQuantity
        });
    };

    const handleCloseModal = () => {
        setEditingProduct(null);
        setFormData({
            title: '',
            description: '',
            category: '',
            unitPrice: '',
            availableQuantity: ''
        });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        try {
            const updateData = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                unitPrice: parseFloat(formData.unitPrice),
                availableQuantity: parseInt(formData.availableQuantity)
            };

            await axiosSecure.patch(`/products/${editingProduct._id}`, updateData);
            refetch();
            handleCloseModal();
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Product has been updated successfully.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire('Error!', 'Failed to update product.', 'error');
        }
    };

    const handleToggleShowOnHome = async (id, currentStatus) => {
        try {
            await axiosSecure.patch(`/products/${id}`, {
                showOnHomePage: !currentStatus
            });
            refetch();
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: `Product ${!currentStatus ? 'will now' : 'will no longer'} show on home page.`,
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire('Error!', 'Failed to update product.', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/products/${id}`);
                refetch();
                Swal.fire('Deleted!', 'Product has been deleted.', 'success');
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete product.', 'error');
            }
        }
    };

    if (isLoading) return <div className="flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">All Products (Admin)</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Available Qty</th>
                            <th>Manager</th>
                            <th>Show on Home</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>{product.title}</td>
                                <td>{product.category}</td>
                                <td>${product.unitPrice}</td>
                                <td>{product.availableQuantity}</td>
                                <td>{product.managerEmail}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-success"
                                        checked={product.showOnHomePage || false}
                                        onChange={() => handleToggleShowOnHome(product._id, product.showOnHomePage)}
                                    />
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="btn btn-sm btn-info"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="btn btn-sm btn-error"
                                        >
                                            Delete

            {/* Update Product Modal */}
            {editingProduct && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl bg-base-100">
                        <h3 className="font-bold text-lg mb-4">Update Product</h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            {/* Product Title */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Product Title</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleFormChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Description</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    className="textarea textarea-bordered h-24 w-full"
                                    required
                                />
                            </div>

                            {/* Category, Price, Quantity Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Category */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Category</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleFormChange}
                                        className="select select-bordered w-full"
                                        required
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {PRODUCT_CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Price (Taka)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="unitPrice"
                                        value={formData.unitPrice}
                                        onChange={handleFormChange}
                                        step="0.01"
                                        min="0"
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                {/* Available Quantity */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Available Qty</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="availableQuantity"
                                        value={formData.availableQuantity}
                                        onChange={handleFormChange}
                                        min="0"
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="modal-action">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Update Product
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-backdrop" onClick={handleCloseModal}></div>
                </div>
            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllProductsAdmin;