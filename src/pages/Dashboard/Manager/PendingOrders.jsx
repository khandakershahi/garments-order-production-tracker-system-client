import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const OrderRow = ({ order, index, onApprove, approvingId }) => (
    <tr>
        <td>{index + 1}</td>
        <td>{order.productTitle || order.productName}</td>
        <td>{order.userEmail}</td>
        <td>{order.orderQuantity}</td>
        <td>{order.orderStatus}</td>
        <td>{order.paymentStatus || order.paymentOption}</td>
        <td>
            <button
                className="btn btn-sm btn-primary"
                onClick={() => onApprove(order._id)}
                disabled={order.orderStatus !== 'Pending' || approvingId === order._id}
            >
                {approvingId === order._id ? 'Approving...' : 'Approve'}
            </button>
        </td>
    </tr>
);

const PendingOrders = () => {
    const axiosSecure = useAxiosSecure();
    const [approvingId, setApprovingId] = useState(null);

    const { data: orders = [], isLoading, refetch } = useQuery({
        queryKey: ['manager-pending-orders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/manager/orders', { params: { status: 'Pending' } });
            return res.data || [];
        },
    });

    const handleApprove = async (orderId) => {
        try {
            setApprovingId(orderId);
            const res = await axiosSecure.patch(`/orders/${orderId}/approve`);
            if (res?.data?.modifiedCount) {
                // refresh the list
                refetch();
            }
        } catch (err) {
            console.error('Approve failed', err);
            // optionally show user feedback
        } finally {
            setApprovingId(null);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Pending Orders</h1>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th>Buyer Email</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Payment</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-8">No pending orders.</td>
                            </tr>
                        )}
                        {orders.map((order, idx) => (
                            <OrderRow key={order._id} order={order} index={idx} onApprove={handleApprove} approvingId={approvingId} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PendingOrders;