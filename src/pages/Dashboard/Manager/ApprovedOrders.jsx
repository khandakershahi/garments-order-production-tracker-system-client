import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const ApprovedOrders = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: orders = [], isLoading, refetch } = useQuery({
        queryKey: ['manager-approved-orders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/manager/orders', { params: { status: 'Approved' } });
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

    const handleDeliveryStatusUpdate = async (orderId, deliveryStatus) => {
        if (userData?.status === 'suspended') {
            Swal.fire('Error', 'Your account is suspended. Cannot update delivery status.', 'error');
            return;
        }
        try {
            await axiosSecure.patch(`/orders/${orderId}/delivery-status`, { deliveryStatus });
            refetch(); // Refresh the data
        } catch (err) {
            console.error('Status update failed', err);
            Swal.fire('Error', err.response?.data?.message || 'Failed to update delivery status', 'error');
        }
    };

    const handleWithdrawPayment = async (orderId) => {
        Swal.fire({
            title: 'Withdraw Payment?',
            text: 'Are you sure you want to withdraw the payment for this order?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Withdraw'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.patch(`/orders/${orderId}/withdraw-payment`);
                    refetch(); // Refresh the data
                    Swal.fire('Success', 'Payment withdrawn successfully', 'success');
                } catch (err) {
                    console.error('Withdrawal failed', err);
                    Swal.fire('Error', err.response?.data?.message || 'Failed to withdraw payment', 'error');
                }
            }
        });
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Approved Orders</h1>
            
            {/* Suspend Alert */}
            {userData?.status === 'suspended' && (
                <div className="alert alert-warning shadow-lg mb-4">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span>Account suspended - You cannot modify orders or update delivery status.</span>
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
                            <th>Delivery Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={8} className="text-center py-8">No approved orders.</td>
                            </tr>
                        )}
                        {orders.map((order, idx) => (
                            <tr key={order._id}>
                                <td>{idx + 1}</td>
                                <td>{order.productTitle || order.productName}</td>
                                <td>{order.userEmail}</td>
                                <td>{order.orderQuantity}</td>
                                <td>{order.orderStatus}</td>
                                <td>{order.paymentStatus || order.paymentOption}</td>
                                <td>
                                    <select
                                        value={order.deliveryStatus || 'order_placed'}
                                        onChange={(e) => handleDeliveryStatusUpdate(order._id, e.target.value)}
                                        className="select select-bordered select-sm"
                                    >
                                        <option value="order_placed">Order Placed</option>
                                        <option value="cutting_completed">Cutting Completed</option>
                                        <option value="sewing_started">Sewing Started</option>
                                        <option value="finishing">Finishing</option>
                                        <option value="qc_checked">QC Checked</option>
                                        <option value="packed">Packed</option>
                                        <option value="shipped_out_for_delivery">Shipped / Out for Delivery</option>
                                        <option value="delivered">Delivered</option>
                                    </select>
                                </td>
                                <td>
                                    {order.deliveryStatus === 'delivered' && order.paymentStatus && order.paymentStatus.includes('Paid') && (
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => handleWithdrawPayment(order._id)}
                                        >
                                            Withdraw Payment
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApprovedOrders;