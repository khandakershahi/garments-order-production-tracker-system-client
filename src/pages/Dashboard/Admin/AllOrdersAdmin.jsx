import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AllOrdersAdmin = () => {
    const axiosSecure = useAxiosSecure();
    const [statusFilter, setStatusFilter] = useState('');

    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['admin-orders', statusFilter],
        queryFn: async () => {
            const res = await axiosSecure.get(`/admin/orders${statusFilter ? `?status=${statusFilter}` : ''}`);
            return res.data;
        }
    });

    if (isLoading) return <div className="flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">All Orders (Admin)</h1>
            <div className="mb-4">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="select select-bordered"
                >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User Email</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>Order Status</th>
                            <th>Payment Status</th>
                            <th>Order Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.userEmail}</td>
                                <td>{order.productTitle || order.productName}</td>
                                <td>{order.orderQuantity}</td>
                                <td>${order.totalPrice}</td>
                                <td>
                                    <span className={`badge ${order.orderStatus === 'Approved' ? 'badge-success' : order.orderStatus === 'Pending' ? 'badge-warning' : 'badge-error'}`}>
                                        {order.orderStatus}
                                    </span>
                                </td>
                                <td>{order.paymentStatus}</td>
                                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllOrdersAdmin;