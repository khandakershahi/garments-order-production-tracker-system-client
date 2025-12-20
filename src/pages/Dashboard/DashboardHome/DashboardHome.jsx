import React from 'react';
import useRole from '../../../hooks/useRole';
import AdminDashboardHome from './AdminDashboardHome';
import ManagerDashboardHome from './ManagerDashboardHome';
import BuyerDashboardHome from './BuyerDashboardHome';

const DashboardHome = () => {
    const { role } = useRole();

    // Check if the role is ready before rendering role-specific menus
    if (!role) {
        return <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
        </div>;
    }

    if (role === 'admin') {
        return <AdminDashboardHome />;
    } else if (role === 'manager') {
        return <ManagerDashboardHome />;
    } else {
        return <BuyerDashboardHome />;
    }
};

export default DashboardHome;