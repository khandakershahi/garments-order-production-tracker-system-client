import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const AllProductsAdmin = () => {
    const axiosSecure = useAxiosSecure();
    const [searchText, setSearchText] = useState('');

    const { data: products = [], refetch, isLoading } = useQuery({
        queryKey: ['admin-products', searchText],
        queryFn: async () => {
            const res = await axiosSecure.get(`/admin/products?search=${searchText}`);
            return res.data;
        }
    });

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
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="btn btn-sm btn-error"
                                    >
                                        Delete
                                    </button>
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