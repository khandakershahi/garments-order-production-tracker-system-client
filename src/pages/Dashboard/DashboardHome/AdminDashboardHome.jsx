import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Legend, Pie, PieChart, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const AdminDashboardHome = () => {
  const axiosSecure = useAxiosSecure();

  const { data: orderStats = [] } = useQuery({
    queryKey: ["order-status-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/orders/status/stats");
      return res.data;
    },
  });

  const { data: paymentStats = [] } = useQuery({
    queryKey: ["payment-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments/stats");
      return res.data;
    },
  });

  const getPieChartData = (data) => {
    return data.map((item) => ({
      name: item._id || item.status,
      value: item.count || item.amount
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold mb-6">Admin Dashboard</h2>

      {/* Order Status Stats */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Order Status Overview</h3>
        <div className="stats shadow w-full">
          {orderStats.map((stat) => (
            <div key={stat._id} className="stat">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div className="stat-title text-lg">{stat._id}</div>
              <div className="stat-value text-2xl">{stat.count}</div>
              <div className="stat-desc">Total orders</div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Stats */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Payment Statistics</h3>
        <div className="stats shadow w-full">
          {paymentStats.map((stat) => (
            <div key={stat._id} className="stat">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  ></path>
                </svg>
              </div>
              <div className="stat-title text-lg">{stat._id}</div>
              <div className="stat-value text-2xl">${stat.amount || stat.total}</div>
              <div className="stat-desc">Revenue</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                data={getPieChartData(orderStats)}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Payment Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;