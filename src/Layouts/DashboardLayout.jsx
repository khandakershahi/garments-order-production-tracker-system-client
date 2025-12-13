import React from 'react';
import { Link, NavLink, Outlet } from 'react-router'; // <<< Corrected import: Use 'react-router-dom'
import logo from '../assets/favicon.png'
import { FaUser, FaUsers, FaListAlt, FaCheckSquare } from 'react-icons/fa'; // Added necessary icons
import useRole from '../hooks/useRole';
import { PiPackageFill } from 'react-icons/pi';
import { GoPackageDependents } from 'react-icons/go';
import { IoTimer } from 'react-icons/io5'; // Added Timer icon for Pending

const DashboardLayout = () => {
    const { role } = useRole();

    // Check if the role is ready before rendering role-specific menus
    if (!role) {
        // You can return a loading state from useRole, but checking the string value is faster
        // If your useRole hook returns roleLoading, you can check that here too.
        return null;
    }

    return (
        <div className="drawer lg:drawer-open container mx-auto">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Navbar */}
                <nav className="navbar w-full bg-base-300">
                    <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                        {/* Sidebar toggle icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
                    </label>
                    <div className="px-4">Garment Order Production Tracker</div>
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

                        {/* -------------------- GLOBAL PROFILE LINK -------------------- */}
                        <li>
                            <NavLink to='/dashboard/profile' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="My Profile">
                                <FaUser />
                                <span className="is-drawer-close:hidden">My Profile</span>
                            </NavLink>
                        </li>


                        {/* -------------------- OTHER LINKS -------------------- */}
                        <li>
                            <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Settings">
                                {/* Settings icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle></svg>
                                <span className="is-drawer-close:hidden">Settings</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div >
        </div >
    );
};

export default DashboardLayout;