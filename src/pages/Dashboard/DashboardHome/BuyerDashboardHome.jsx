import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const BuyerDashboardHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch user's orders
  const { data: myOrders = [], isLoading: ordersLoading, isError: ordersError } = useQuery({
    queryKey: ["my-orders", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosSecure.get(`/orders?email=${encodeURIComponent(user.email)}`);
      return res.data || [];
    },
    enabled: !!user?.email,
    retry: 1,
  });

  // Fetch order statistics
  const { data: orderStats = {}, isLoading: statsLoading, isError: statsError } = useQuery({
    queryKey: ["buyer-order-stats", user?.email],
    queryFn: async () => {
      if (!user?.email) return {};
      const res = await axiosSecure.get(`/orders/stats?email=${encodeURIComponent(user.email)}`);
      return res.data || {};
    },
    enabled: !!user?.email,
    retry: 1,
  });

  // Calculate totals
  const totalOrders = myOrders.length;
  const pendingCount = orderStats.pending || 0;
  const approvedCount = orderStats.approved || 0;
  const inProductionCount = orderStats.inProduction || 0;
  const shippedCount = orderStats.shipped || 0;
  const deliveredCount = orderStats.delivered || 0;
  const cancelledCount = orderStats.cancelled || 0;

  // Prepare chart data with colors
  const statusData = [
    { name: 'Pending', count: pendingCount, color: '#fbbf24' },
    { name: 'Approved', count: approvedCount, color: '#10b981' },
    { name: 'In Production', count: inProductionCount, color: '#3b82f6' },
    { name: 'Shipped', count: shippedCount, color: '#8b5cf6' },
    { name: 'Delivered', count: deliveredCount, color: '#059669' },
    { name: 'Cancelled', count: cancelledCount, color: '#ef4444' },
  ].filter(item => item.count > 0);

  // Recent orders (last 5)
  const recentOrders = myOrders.slice(0, 5);

  if (ordersLoading || statsLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (ordersError || statsError) {
    return (
      <div className="p-6">
        <div className="alert alert-error">
          <span>Error loading dashboard data. Please try refreshing the page.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">My Dashboard</h2>

      {/* Quick Stats */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
        <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-8 w-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Total Orders</div>
            <div className="stat-value text-primary">{totalOrders}</div>
            <div className="stat-desc">All time orders</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-8 w-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Delivered</div>
            <div className="stat-value text-success">{deliveredCount}</div>
            <div className="stat-desc">Successfully completed</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-8 w-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">In Progress</div>
            <div className="stat-value text-info">{approvedCount + inProductionCount + shippedCount}</div>
            <div className="stat-desc">Being processed</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-8 w-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Pending</div>
            <div className="stat-value text-warning">{pendingCount}</div>
            <div className="stat-desc">Awaiting approval</div>
          </div>
        </div>
      </div>

      {/* Order Status Chart */}
      {statusData.length > 0 && (
        <div className="bg-base-100 p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-semibold mb-4">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-base-100 p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No orders yet. Start shopping to see your orders here!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.productTitle || order.productName || 'N/A'}</td>
                    <td>{order.orderQuantity || order.quantity || 0}</td>
                    <td>
                      <span className={`badge ${
                        order.orderStatus === 'Delivered' ? 'badge-success' :
                        order.orderStatus === 'Shipped' ? 'badge-info' :
                        order.orderStatus === 'In Production' ? 'badge-primary' :
                        order.orderStatus === 'Approved' ? 'badge-accent' :
                        order.orderStatus === 'Pending' ? 'badge-warning' :
                        order.orderStatus === 'Cancelled' ? 'badge-error' :
                        'badge-ghost'
                      }`}>
                        {order.orderStatus || 'Unknown'}
                      </span>
                    </td>
                    <td>{new Date(order.orderDate || order.createdAt).toLocaleDateString()}</td>
                    <td>${order.totalPrice || order.price || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboardHome;