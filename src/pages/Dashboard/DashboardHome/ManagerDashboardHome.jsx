import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Legend, Pie, PieChart, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const ManagerDashboardHome = () => {
  const axiosSecure = useAxiosSecure();

  const { data: deliveryStats = [] } = useQuery({
    queryKey: ["delivery-status-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/orders/delivery-status/stats");
      return res.data;
    },
  });

  const { data: approvedOrders = [] } = useQuery({
    queryKey: ["manager-approved-orders-count"],
    queryFn: async () => {
      const res = await axiosSecure.get("/manager/orders/count");
      return res.data;
    },
  });

  const getPieChartData = (data) => {
    return data.map((item) => ({
      name: item._id || item.status,
      value: item.count
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold mb-6">Manager Dashboard</h2>

      {/* Quick Stats */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Production Overview</h3>
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Approved Orders</div>
            <div className="stat-value">{approvedOrders.approved || 0}</div>
            <div className="stat-desc">Ready for production</div>
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                ></path>
              </svg>
            </div>
            <div className="stat-title">In Production</div>
            <div className="stat-value">{approvedOrders.inProduction || 0}</div>
            <div className="stat-desc">Currently processing</div>
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
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Completed</div>
            <div className="stat-value">{approvedOrders.completed || 0}</div>
            <div className="stat-desc">Ready for delivery</div>
          </div>
        </div>
      </div>

      {/* Delivery Status Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Delivery Status Distribution</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              dataKey="value"
              data={getPieChartData(deliveryStats)}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label
            />
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ManagerDashboardHome;