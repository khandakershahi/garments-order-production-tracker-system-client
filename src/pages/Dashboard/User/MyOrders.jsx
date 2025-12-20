import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const MyOrders = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewOrder, setViewOrder] = useState(null);
    const [cancelOrder, setCancelOrder] = useState(null);

    useEffect(() => {
        if (!user?.email) return;
        setLoading(true);
        axiosSecure
            .get(`/orders?email=${encodeURIComponent(user.email)}`)
            .then((res) => {
                setOrders(res.data || []);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [user, axiosSecure]);

    const handlePay = async (order) => {
        if (!order || !order._id) return;
        try {
            // Call backend to create a Checkout Session
            const res = await axiosSecure.post('/create-checkout-session', { orderId: order._id });
            const url = res.data?.url;
            if (url) {
                // Redirect browser to Stripe Checkout
                window.location.href = url;
            } else {
                Swal.fire('Error', 'Failed to create checkout session.', 'error');
            }
        } catch (err) {
            console.error('Payment redirect failed', err);
            Swal.fire('Error', err.response?.data?.message || 'Payment failed to start', 'error');
        }
    };

    const handleConfirmCancel = async () => {
        if (!cancelOrder) return;
        try {
            const res = await axiosSecure.patch(`/orders/${cancelOrder._id}/cancel`);
            if (res.data?.modifiedCount) {
                setOrders((prev) => prev.map(o => o._id === cancelOrder._id ? { ...o, orderStatus: 'Cancelled' } : o));
            }
        } catch (err) {
            console.error('Cancel failed', err);
            Swal.fire('Error', 'Failed to cancel order', 'error');
        } finally {
            setCancelOrder(null);
        }
    };

    const formatDate = (d) => {
        if (!d) return '-';
        return new Date(d).toLocaleString();
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">My Orders</h2>

            {loading && <div>Loading...</div>}

            {!loading && (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Tracking ID</th>
                                <th>Delivery Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="text-center py-8">No orders found.</td>
                                </tr>
                            )}
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{String(order._id).slice(-8)}</td>
                                    <td>{order.productTitle || order.productName || order.product}</td>
                                    <td>{order.orderQuantity}</td>
                                    <td>{order.orderStatus}</td>
                                    <td>{order.paymentStatus || order.paymentOption || 'N/A'}</td>
                                    <td>
                                        <Link
                                            to={`/dashboard/track-order/${order._id}`}
                                            className="text-blue-600 hover:text-blue-800 underline"
                                        >
                                            {order.trackingId || 'N/A'}
                                        </Link>
                                    </td>
                                    <td>
                                        {order.deliveryStatus || 'order_placed'}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-ghost mr-2"
                                            onClick={() => setViewOrder(order)}
                                        >
                                            View
                                        </button>

                                        <Link
                                            to={`/dashboard/track-order/${order._id}`}
                                            className="btn btn-sm btn-info mr-2"
                                        >
                                            Track Order
                                        </Link>

                                        {order.orderStatus === 'Pending' && (
                                            <button
                                                className="btn btn-sm btn-error"
                                                onClick={() => setCancelOrder(order)}
                                            >
                                                Cancel
                                            </button>
                                        )}

                                        {/* Show Pay button when manager approved and not paid yet */}
                                        {order.orderStatus === 'Approved' && !((order.paymentStatus || '').toString().toLowerCase().includes('paid')) && (
                                            <button
                                                className="btn btn-sm btn-primary ml-2"
                                                onClick={() => handlePay(order)}
                                            >
                                                Pay
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* View Modal */}
            <div className={viewOrder ? 'modal modal-open' : 'modal'}>
                <div className="modal-box w-11/12 max-w-3xl">
                    <h3 className="font-bold text-lg">Order Details</h3>
                    {viewOrder ? (
                        <div className="mt-4">
                            <p><strong>Order ID:</strong> {String(viewOrder._id)}</p>
                            <p><strong>Product:</strong> {viewOrder.productTitle || viewOrder.productName}</p>
                            <p><strong>Quantity:</strong> {viewOrder.orderQuantity}</p>
                            <p><strong>Ordered At:</strong> {formatDate(viewOrder.orderDate)}</p>
                            <p><strong>Status:</strong> {viewOrder.orderStatus}</p>
                            <p><strong>Payment:</strong> {viewOrder.paymentStatus || viewOrder.paymentOption}</p>

                            <div className="mt-6">
                                <h4 className="font-semibold">Tracking Timeline</h4>
                                <ul className="steps steps-vertical mt-2">
                                    <li className={`step ${viewOrder.orderStatus === 'Pending' ? 'step-primary' : ''}`}>Placed ({formatDate(viewOrder.orderDate)})</li>
                                    <li className={`step ${viewOrder.orderStatus === 'Approved' ? 'step-primary' : ''}`}>Approved</li>
                                    <li className={`step ${viewOrder.orderStatus === 'In Production' ? 'step-primary' : ''}`}>In Production</li>
                                    <li className={`step ${viewOrder.orderStatus === 'Shipped' ? 'step-primary' : ''}`}>Shipped</li>
                                    <li className={`step ${viewOrder.orderStatus === 'Delivered' ? 'step-primary' : ''}`}>Delivered</li>
                                    <li className={`step ${viewOrder.orderStatus === 'Cancelled' ? 'step-error' : ''}`}>Cancelled</li>
                                </ul>
                            </div>
                        </div>
                    ) : null}

                    <div className="modal-action">
                        <button className="btn" onClick={() => setViewOrder(null)}>Close</button>
                    </div>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            <div className={cancelOrder ? 'modal modal-open' : 'modal'}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Cancel Order</h3>
                    <p className="py-4">Are you sure you want to cancel the order <strong>{cancelOrder?._id && String(cancelOrder._id).slice(-8)}</strong> ?</p>
                    <div className="modal-action">
                        <button className="btn" onClick={() => setCancelOrder(null)}>No</button>
                        <button className="btn btn-error" onClick={handleConfirmCancel}>Yes, Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyOrders;