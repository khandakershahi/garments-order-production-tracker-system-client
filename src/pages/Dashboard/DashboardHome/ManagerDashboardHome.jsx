import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Legend, Pie, PieChart, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

const ManagerDashboardHome = () => {
  const axiosSecure = useAxiosSecure();

  const { 
    data: deliveryStats = [], 
    isLoading: deliveryStatsLoading,
    isError: deliveryStatsError 
  } = useQuery({
    queryKey: ["delivery-status-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/orders/delivery-status/stats");
      return res.data || [];
    },
    retry: 1
  });

  const { 
    data: approvedOrders = {}, 
    isLoading: ordersCountLoading,
    isError: ordersCountError 
  } = useQuery({
    queryKey: ["manager-approved-orders-count"],
    queryFn: async () => {
      const res = await axiosSecure.get("/manager/orders/count");
      return res.data || {};
    },
    retry: 1
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Calculate totals
  const totalApproved = approvedOrders.approved || 0;
  const totalInProduction = approvedOrders.inProduction || 0;
  const totalShipped = approvedOrders.shipped || 0;
  const totalDelivered = approvedOrders.delivered || 0;
  const totalOrders = totalApproved + totalInProduction + totalShipped + totalDelivered;

  const getPieChartData = (data) => {
    return data.map((item) => ({
      name: item._id || item.status,
      value: item.count
    }));
  };

  // Loading state
  if (deliveryStatsLoading || ordersCountLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Error state
  if (deliveryStatsError || ordersCountError) {
    return (
      <div className="p-6">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Error loading dashboard data. Please try again.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Manager Dashboard</h2>

      {/* Overview Stats */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Production Overview</h3>
        <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
          <div className="stat">
            <div className="stat-figure text-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div className="stat-title">Total Orders</div>
            <div className="stat-value text-info">{totalOrders}</div>
            <div className="stat-desc">Under management</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Approved Orders</div>
            <div className="stat-value text-primary">{totalApproved}</div>
            <div className="stat-desc">Ready for production</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <div className="stat-title">In Production</div>
            <div className="stat-value text-secondary">{totalInProduction}</div>
            <div className="stat-desc">Currently processing</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-success">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div className="stat-title">Shipped</div>
            <div className="stat-value text-success">{totalShipped}</div>
            <div className="stat-desc">Out for delivery</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-warning">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
              </svg>
            </div>
            <div className="stat-title">Delivered</div>
            <div className="stat-value text-warning">{totalDelivered}</div>
            <div className="stat-desc">Successfully completed</div>
          </div>
        </div>
      </div>

      {/* Delivery Status Distribution */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Delivery Status Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {deliveryStats.map((stat, index) => (
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
        {/* Delivery Status Pie Chart */}
        <div className="bg-base-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Delivery Status Distribution</h3>
          {deliveryStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie 
                  dataKey="value" 
                  data={getPieChartData(deliveryStats)} 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={120} 
                  label
                >
                  {getPieChartData(deliveryStats).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">No delivery data available</div>
          )}
        </div>

        {/* Production Status Bar Chart */}
        <div className="bg-base-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Production Status</h3>
          {totalOrders > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={[
                { name: 'Approved', value: totalApproved },
                { name: 'In Production', value: totalInProduction },
                { name: 'Shipped', value: totalShipped },
                { name: 'Delivered', value: totalDelivered }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {[0, 1, 2, 3].map((index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">No production data available</div>
          )}
        </div>
      </div>

      {/* Delivery Details Table */}
      {deliveryStats.length > 0 && (
        <div className="mt-8 bg-base-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Delivery Status Details</h3>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Delivery Status</th>
                  <th>Order Count</th>
                  <th>Percentage</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {deliveryStats.map((stat, index) => {
                  const totalDeliveryOrders = deliveryStats.reduce((sum, s) => sum + s.count, 0);
                  const percentage = ((stat.count / totalDeliveryOrders) * 100).toFixed(1);
                  return (
                    <tr key={stat._id || index}>
                      <td className="font-semibold">{stat._id}</td>
                      <td>{stat.count}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <progress className="progress progress-primary w-20" value={percentage} max="100"></progress>
                          <span>{percentage}%</span>
                        </div>
                      </td>
                      <td>
                        <div className={`badge ${
                          stat._id === 'Delivered' ? 'badge-success' :
                          stat._id === 'In Transit' ? 'badge-warning' :
                          stat._id === 'Pending' ? 'badge-info' :
                          'badge-neutral'
                        }`}>
                          {stat._id}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboardHome;