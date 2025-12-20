import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const BuyerDashboardHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: myOrders = [] } = useQuery({
    queryKey: ["my-orders-stats", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders?email=${encodeURIComponent(user.email)}`);
      return res.data || [];
    },
  });

  const { data: orderStats = {} } = useQuery({
    queryKey: ["buyer-order-stats", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/stats?email=${encodeURIComponent(user.email)}`);
      return res.data || {};
    },
  });

  // Prepare data for chart
  const statusData = [
    { name: 'Pending', count: orderStats.pending || 0 },
    { name: 'Approved', count: orderStats.approved || 0 },
    { name: 'In Production', count: orderStats.inProduction || 0 },
    { name: 'Shipped', count: orderStats.shipped || 0 },
    { name: 'Delivered', count: orderStats.delivered || 0 },
    { name: 'Cancelled', count: orderStats.cancelled || 0 },
  ];

  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold mb-6">My Dashboard</h2>

      {/* Quick Stats */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
        <div className="stats shadow w-full">
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
            <div className="stat-value">{myOrders.length}</div>
            <div className="stat-desc">All time</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
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
            <div className="stat-title">Completed</div>
            <div className="stat-value">{orderStats.delivered || 0}</div>
            <div className="stat-desc">Successfully delivered</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-accent">
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
            <div className="stat-value">{(orderStats.approved || 0) + (orderStats.inProduction || 0)}</div>
            <div className="stat-desc">Being processed</div>
          </div>
        </div>
      </div>

      {/* Order Status Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Order Status Overview</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Product</th>
                <th>Status</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {myOrders.slice(0, 5).map((order) => (
                <tr key={order._id}>
                  <td>{order.productTitle || order.productName}</td>
                  <td>
                    <span className={`badge ${
                      order.orderStatus === 'Delivered' ? 'badge-success' :
                      order.orderStatus === 'Pending' ? 'badge-warning' :
                      order.orderStatus === 'Approved' ? 'badge-info' :
                      'badge-neutral'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboardHome;