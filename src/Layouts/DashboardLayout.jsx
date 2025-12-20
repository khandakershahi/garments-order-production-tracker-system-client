import React from 'react';
import { Link, NavLink, Outlet } from 'react-router'; // <<< Corrected import: Use 'react-router-dom'
import logo from '../assets/favicon.png'
import { FaUser, FaUsers, FaListAlt, FaCheckSquare, FaSignOutAlt } from 'react-icons/fa'; // Added necessary icons
import useRole from '../hooks/useRole';
import { PiPackageFill } from 'react-icons/pi';
import { GoPackageDependents } from 'react-icons/go';
import { IoTimer } from 'react-icons/io5'; // Added Timer icon for Pending
import useAuth from '../hooks/useAuth';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';

const DashboardLayout = () => {
    const { role } = useRole();
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out of your account',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Logout'
        }).then((result) => {
            if (result.isConfirmed) {
                logOut()
                    .then(() => {
                        navigate('/');
                    })
                    .catch(error => {
                        console.error('Logout error:', error);
                        Swal.fire('Error', 'Failed to logout', 'error');
                    });
            }
        });
    };

    // Check if the role is ready before rendering role-specific menus
    if (!role) {
        // You can return a loading state from useRole, but checking the string value is faster
        // If your useRole hook returns roleLoading, you can check that here too.
        return null;
    }

    return (
        <div className="drawer lg:drawer-open mx-auto">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Navbar */}
                <nav className="navbar w-full bg-base-300">
                    <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                        {/* Sidebar toggle icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
                    </label>
                    <div className="px-4">Garment Order Production Tracker</div>
                    
                    {/* User Info, Profile, and Theme Toggle */}
                    {user && (
                        <div className="navbar-end ml-auto flex items-center gap-3">
                            {/* User Name and Role */}
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-sm font-semibold text-base-content">
                                    {user?.displayName || "User"}
                                </span>
                                <span className="text-xs text-base-content/70 capitalize">
                                    {role || "Loading..."}
                                </span>
                            </div>

                            {/* Profile Image */}
                            <NavLink to='/dashboard/profile' className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        className="w-10 rounded-full"
                                        alt={user?.displayName || "User"}
                                        src={
                                            user?.photoURL ||
                                            user?.providerData?.[0]?.photoURL ||
                                            "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                        }
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                            </NavLink>

                            {/* Theme Toggle */}
                            <label className="swap swap-rotate btn btn-ghost btn-circle">
                                <input
                                    type="checkbox"
                                    className="theme-controller"
                                    value="dark"
                                    onChange={(e) => {
                                        const theme = e.target.checked ? 'dark' : 'light';
                                        document.documentElement.setAttribute('data-theme', theme);
                                        localStorage.setItem('theme', theme);
                                    }}
                                    defaultChecked={
                                        localStorage.getItem('theme') === 'dark' ||
                                        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
                                    }
                                />
                                {/* Sun icon (light mode) */}
                                <svg
                                    className="swap-off fill-current w-6 h-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                                </svg>
                                {/* Moon icon (dark mode) */}
                                <svg
                                    className="swap-on fill-current w-6 h-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                                </svg>
                            </label>
                        </div>
                    )}
                </nav>
                {/* Page content here */}
                <Outlet></Outlet>
            </div>

            <div className="drawer-side is-drawer-close:overflow-visible">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                    {/* Sidebar content here */}
                    <ul className="menu w-full grow">
                        {/* -------------------- BRAND/HOME LINK -------------------- */}
                        <li>
                            <NavLink to='/' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Home">
                                <img src={logo} alt="" />
                                <span className="is-drawer-close:hidden">
                                    <div className=' justify-center items-center text-center'>
                                        <p className='tracking-[.25em] text-xl text-primary font-bold'>THIRTEEN</p>
                                        <p className="tracking-[.35em]">CLOTHING</p>
                                    </div>
                                </span>
                            </NavLink>
                        </li>

                        {/* -------------------- CORE DASHBOARD LINK -------------------- */}
                        <li>
                            <NavLink to='/dashboard' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Dashboard">
                                {/* Dashboard icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                                <span className="is-drawer-close:hidden">Dashboard Home</span>
                            </NavLink>
                        </li>

                        {/* -------------------- ADMIN MENU -------------------- */}
                        {role === 'admin' && (
                            <>
                                <li>
                                    <NavLink to='/dashboard/manage-users' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Manage Users">
                                        <FaUsers />
                                        <span className="is-drawer-close:hidden">Manage Users</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to='/dashboard/all-products-admin' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="All Products">
                                        <FaListAlt />
                                        <span className="is-drawer-close:hidden">All Products (Admin)</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to='/dashboard/all-orders-admin' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="All Orders">
                                        <FaCheckSquare />
                                        <span className="is-drawer-close:hidden">All Orders (Admin)</span>
                                    </NavLink>
                                </li>
                            </>
                        )}


                        {/* -------------------- MANAGER MENU (FIXED) -------------------- */}
                        {role === 'manager' && (
                            <> {/* <<< FIXED: WRAP SIBLINGS IN A FRAGMENT */}
                                <li>
                                    <NavLink to='/dashboard/add-product' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Add Product">
                                        <PiPackageFill />
                                        <span className="is-drawer-close:hidden">Add Product</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to='/dashboard/manage-products' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Manage Products">
                                        <GoPackageDependents />
                                        <span className="is-drawer-close:hidden">Manage Products</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to='/dashboard/pending-orders' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Pending Orders">
                                        <IoTimer />
                                        <span className="is-drawer-close:hidden">Pending Orders</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to='/dashboard/approved-orders' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Approved Orders">
                                        <FaCheckSquare />
                                        <span className="is-drawer-close:hidden">Approved Orders</span>
                                    </NavLink>
                                </li>
                            </>
                        )}

                        {/* -------------------- BUYER / USER MENU -------------------- */}
                        {role === 'buyer' && (
                            <>
                                <li>
                                    <NavLink to='/dashboard/my-orders' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="My Orders">
                                        <FaListAlt />
                                        <span className="is-drawer-close:hidden">My Orders</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to='/dashboard/track-order' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Track Order">
                                        <GoPackageDependents />
                                        <span className="is-drawer-close:hidden">Track Order</span>
                                    </NavLink>
                                </li>
                            </>
                        )}

                        {/* -------------------- GLOBAL PROFILE LINK -------------------- */}
                        <li>
                            <NavLink to='/dashboard/profile' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="My Profile">
                                <FaUser />
                                <span className="is-drawer-close:hidden">My Profile</span>
                            </NavLink>
                        </li>


                        {/* -------------------- LOGOUT BUTTON -------------------- */}
                        <li>
                            <button 
                                onClick={handleLogout}
                                className="is-drawer-close:tooltip is-drawer-close:tooltip-right text-red-500 hover:bg-red-50" 
                                data-tip="Logout"
                            >
                                {/* Logout icon */}
                                <FaSignOutAlt />
                                <span className="is-drawer-close:hidden">Logout</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div >
        </div >
    );
};

export default DashboardLayout;