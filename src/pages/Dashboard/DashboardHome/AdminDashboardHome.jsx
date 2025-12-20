import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Legend, Pie, PieChart, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

const AdminDashboardHome = () => {
  const axiosSecure = useAxiosSecure();

  const { data: orderStats = [], isLoading: orderStatsLoading, isError: orderStatsError } = useQuery({
    queryKey: ["order-status-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/orders/status/stats");
      return res.data || [];
    },
    retry: 1,
  });

  const { data: paymentStats = [], isLoading: paymentStatsLoading, isError: paymentStatsError } = useQuery({
    queryKey: ["payment-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments/stats");
      return res.data || [];
    },
    retry: 1,
  });

  const totalOrders = orderStats.reduce((sum, stat) => sum + (stat.count || 0), 0);
  const totalRevenue = paymentStats.reduce((sum, stat) => sum + (stat.amount || 0), 0);

  const getPieChartData = (data) => {
    return data.map((item) => ({
      name: item._id || item.status,
      value: item.count || item.amount
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (orderStatsLoading || paymentStatsLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (orderStatsError || paymentStatsError) {
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
      <h2 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h2>

      {/* Overview Stats */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Overview</h3>
        <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div className="stat-title">Total Orders</div>
            <div className="stat-value text-primary">{totalOrders}</div>
            <div className="stat-desc">All time orders</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-success">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div className="stat-title">Total Revenue</div>
            <div className="stat-value text-success">${totalRevenue.toFixed(2)}</div>
            <div className="stat-desc">From all payments</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
            <div className="stat-title">Payment Methods</div>
            <div className="stat-value text-info">{paymentStats.length}</div>
            <div className="stat-desc">Different methods</div>
          </div>
        </div>
      </div>

      {/* Order Status Stats */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Order Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {orderStats.map((stat, index) => (
            <div key={stat._id || index} className="stat bg-base-100 shadow-lg rounded-lg p-4">
              <div className="stat-title text-sm">{stat._id}</div>
              <div className="stat-value text-2xl">{stat.count}</div>
              <div className="stat-desc">orders</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Pie Chart */}
        <div className="bg-base-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Order Status Distribution</h3>
          {orderStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie dataKey="value" data={getPieChartData(orderStats)} cx="50%" cy="50%" outerRadius={100} label>
                  {getPieChartData(orderStats).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">No data available</div>
          )}
        </div>

        {/* Payment Bar Chart */}
        <div className="bg-base-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Payment Overview</h3>
          {paymentStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Bar dataKey="amount" fill="#82ca9d" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">No data available</div>
          )}
        </div>
      </div>

      {/* Payment Details Table */}
      {paymentStats.length > 0 && (
        <div className="mt-8 bg-base-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Payment Methods Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Payment Method</th>
                  <th>Total Amount</th>
                  <th>Transactions</th>
                  <th>Average</th>
                </tr>
              </thead>
              <tbody>
                {paymentStats.map((stat) => (
                  <tr key={stat._id}>
                    <td className="font-semibold">{stat._id || 'Unknown'}</td>
                    <td className="text-success">${(stat.amount || 0).toFixed(2)}</td>
                    <td>{stat.count || 0}</td>
                    <td>${((stat.amount || 0) / (stat.count || 1)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardHome;