import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const OrderRow = ({ order, index, onApprove, onReject, approvingId, rejectingId, isSuspended }) => (
    <tr>
        <td>{index + 1}</td>
        <td>{order.productTitle || order.productName}</td>
        <td>{order.userEmail}</td>
        <td>{order.orderQuantity}</td>
        <td>{order.orderStatus}</td>
        <td>{order.paymentStatus || order.paymentOption}</td>
        <td>
            <div className="flex gap-2">
                <button
                    className="btn btn-sm btn-success"
                    onClick={() => onApprove(order._id)}
                    disabled={order.orderStatus !== 'Pending' || approvingId === order._id || rejectingId === order._id || isSuspended}
                >
                    {approvingId === order._id ? 'Approving...' : 'Approve'}
                </button>
                <button
                    className="btn btn-sm btn-error"
                    onClick={() => onReject(order._id)}
                    disabled={order.orderStatus !== 'Pending' || approvingId === order._id || rejectingId === order._id || isSuspended}
                >
                    {rejectingId === order._id ? 'Rejecting...' : 'Reject'}
                </button>
            </div>
        </td>
    </tr>
);

const PendingOrders = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [approvingId, setApprovingId] = useState(null);
    const [rejectingId, setRejectingId] = useState(null);

    const { data: orders = [], isLoading, refetch } = useQuery({
        queryKey: ['manager-pending-orders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/manager/orders', { params: { status: 'Pending' } });
            return res.data || [];
        },
    });

    // Fetch user data to check suspend status
    const { data: userData = null } = useQuery({
        queryKey: ['user-suspend-check', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}/role`);
            return res.data;
        }
    });

    const handleApprove = async (orderId) => {
        if (userData?.status === 'suspended') {
            Swal.fire('Error', 'Your account is suspended. Cannot approve orders.', 'error');
            return;
        }
        try {
            setApprovingId(orderId);
            const res = await axiosSecure.patch(`/orders/${orderId}/approve`);
            if (res?.data?.modifiedCount) {
                // refresh the list
                refetch();
                Swal.fire('Success', 'Order approved successfully!', 'success');
            }
        } catch (err) {
            console.error('Approve failed', err);
            Swal.fire('Error', err.response?.data?.message || 'Failed to approve order', 'error');
        } finally {
            setApprovingId(null);
        }
    };

    const handleReject = async (orderId) => {
        if (userData?.status === 'suspended') {
            Swal.fire('Error', 'Your account is suspended. Cannot reject orders.', 'error');
            return;
        }

        // Show confirmation dialog before rejecting
        const result = await Swal.fire({
            title: 'Reject Order?',
            text: 'Are you sure you want to reject this order? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Reject it!'
        });

        if (!result.isConfirmed) return;

        try {
            setRejectingId(orderId);
            const res = await axiosSecure.patch(`/orders/${orderId}/reject`);
            if (res?.data?.modifiedCount) {
                // refresh the list
                refetch();
                Swal.fire('Rejected', 'Order has been rejected.', 'success');
            }
        } catch (err) {
            console.error('Reject failed', err);
            Swal.fire('Error', err.response?.data?.message || 'Failed to reject order', 'error');
        } finally {
            setRejectingId(null);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Pending Orders</h1>
            
            {/* Suspend Alert */}
            {userData?.status === 'suspended' && (
                <div className="alert alert-warning shadow-lg mb-4">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span>Account suspended - You cannot approve or reject orders.</span>
                    </div>
                </div>
            )}
            
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-8">No pending orders.</td>
                            </tr>
                        )}
                        {orders.map((order, idx) => (
                            <OrderRow 
                                key={order._id} 
                                order={order} 
                                index={idx} 
                                onApprove={handleApprove}
                                onReject={handleReject}
                                approvingId={approvingId}
                                rejectingId={rejectingId}
                                isSuspended={userData?.status === 'suspended'}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PendingOrders;