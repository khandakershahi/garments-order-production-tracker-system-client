import React from 'react';
import { Helmet } from 'react-helmet-async';
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

    return (
        <>
            <Helmet>
                <title>Dashboard - Garments Order Tracker</title>
            </Helmet>
            {role === 'admin' && <AdminDashboardHome />}
            {role === 'manager' && <ManagerDashboardHome />}
            {role === 'buyer' && <BuyerDashboardHome />}
        </>
    );
};

export default DashboardHome;