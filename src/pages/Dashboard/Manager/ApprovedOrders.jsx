import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const ApprovedOrders = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [trackingModalOrder, setTrackingModalOrder] = useState(null);
    const [trackingData, setTrackingData] = useState({
        status: '',
        location: '',
        note: '',
    });

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

    const handleOpenTrackingModal = (order) => {
        setTrackingModalOrder(order);
        setTrackingData({
            status: order.deliveryStatus || 'order_placed',
            location: '',
            note: '',
        });
    };

    const handleCloseTrackingModal = () => {
        setTrackingModalOrder(null);
        setTrackingData({ status: '', location: '', note: '' });
    };

    const handleAddTracking = async (e) => {
        e.preventDefault();
        if (userData?.status === 'suspended') {
            Swal.fire('Error', 'Your account is suspended. Cannot add tracking.', 'error');
            return;
        }

        if (!trackingData.status || !trackingData.location) {
            Swal.fire('Error', 'Status and Location are required', 'error');
            return;
        }

        try {
            const trackingLog = {
                orderId: trackingModalOrder._id,
                status: trackingData.status,
                location: trackingData.location,
                note: trackingData.note,
                timestamp: new Date(),
                addedBy: user.email,
            };

            await axiosSecure.post('/trackings', trackingLog);
            
            // Also update the order's delivery status
            await axiosSecure.patch(`/orders/${trackingModalOrder._id}/delivery-status`, { 
                deliveryStatus: trackingData.status 
            });

            refetch();
            handleCloseTrackingModal();
            Swal.fire('Success', 'Tracking information added successfully', 'success');
        } catch (err) {
            console.error('Add tracking failed', err);
            Swal.fire('Error', err.response?.data?.message || 'Failed to add tracking', 'error');
        }
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
                                    <span className="badge badge-info badge-sm">
                                        {order.deliveryStatus 
                                            ? order.deliveryStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) 
                                            : 'Order Placed'}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex gap-2 flex-wrap">
                                        {/* Add Tracking Button */}
                                        <button
                                            className="btn btn-sm btn-info"
                                            onClick={() => handleOpenTrackingModal(order)}
                                            disabled={userData?.status === 'suspended'}
                                        >
                                            Add Tracking
                                        </button>

                                        {/* Show Withdrawn Status */}
                                        {(order.paymentStatus === 'Withdrawn' || order.paymentStatus?.includes('Withdrawn')) && (
                                            <span className="badge badge-success gap-2">
                                                ✓ Payment Withdrawn
                                            </span>
                                        )}
                                        
                                        {/* Show Withdraw Button when ready */}
                                        {order.deliveryStatus === 'delivered' && 
                                         order.paymentStatus && 
                                         order.paymentStatus.includes('Paid') && 
                                         !order.paymentStatus.includes('Withdrawn') && (
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleWithdrawPayment(order._id)}
                                            >
                                                Withdraw Payment
                                            </button>
                                        )}
                                        
                                        {/* Show Not Ready status */}
                                        {order.deliveryStatus !== 'delivered' && (
                                            <span className="badge badge-warning gap-2">
                                                Pending Delivery
                                            </span>
                                        )}
                                        
                                        {order.deliveryStatus === 'delivered' && 
                                         (!order.paymentStatus || !order.paymentStatus.includes('Paid')) && (
                                            <span className="badge badge-error gap-2">
                                                Payment Pending
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Tracking Modal */}
            {trackingModalOrder && (
                <dialog className="modal modal-open">
                    <div className="modal-box bg-base-200">
                        <h3 className="font-bold text-lg text-base-content mb-4">
                            Add Tracking Information
                        </h3>
                        <p className="text-sm text-base-content/70 mb-4">
                            Order: {trackingModalOrder.productTitle} (ID: {String(trackingModalOrder._id).slice(-8)})
                        </p>
                        
                        <form onSubmit={handleAddTracking}>
                            {/* Status Dropdown */}
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text text-base-content">Status *</span>
                                </label>
                                <select
                                    value={trackingData.status}
                                    onChange={(e) => setTrackingData({ ...trackingData, status: e.target.value })}
                                    className="select select-bordered bg-base-100 text-base-content"
                                    required
                                >
                                    <option value="">Select Status</option>
                                    <option value="cutting_completed">Cutting Completed</option>
                                    <option value="sewing_started">Sewing Started</option>
                                    <option value="finishing">Finishing</option>
                                    <option value="qc_checked">QC Checked</option>
                                    <option value="packed">Packed</option>
                                    <option value="shipped_out_for_delivery">Shipped / Out for Delivery</option>
                                    <option value="delivered">Delivered</option>
                                </select>
                            </div>

                            {/* Location Input */}
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text text-base-content">Location *</span>
                                </label>
                                <input
                                    type="text"
                                    value={trackingData.location}
                                    onChange={(e) => setTrackingData({ ...trackingData, location: e.target.value })}
                                    placeholder="e.g., Dhaka Factory, Warehouse A"
                                    className="input input-bordered bg-base-100 text-base-content"
                                    required
                                />
                            </div>

                            {/* Note Textarea */}
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text text-base-content">Note (Optional)</span>
                                </label>
                                <textarea
                                    value={trackingData.note}
                                    onChange={(e) => setTrackingData({ ...trackingData, note: e.target.value })}
                                    placeholder="Additional details about this update..."
                                    className="textarea textarea-bordered bg-base-100 text-base-content"
                                    rows="3"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={handleCloseTrackingModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Add Tracking
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop" onClick={handleCloseTrackingModal}>
                        <button>close</button>
                    </form>
                </dialog>
            )}
        </div>
    );
};

export default ApprovedOrders;