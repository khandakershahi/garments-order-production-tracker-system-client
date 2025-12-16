import React, { useEffect, useState } from 'react';
import { FaMoon, FaSun, FaSpinner } from 'react-icons/fa';
import Logo from '../../Logo/Logo';
import { NavLink, useNavigate } from 'react-router'; // Using react-router-dom for NavLink
import useAuth from '../../../hooks/useAuth';

const Navbar = () => {
    const [isdark, setIsdark] = useState(JSON.parse(localStorage.getItem('isdark') || 'false'));
    const { user, logOut, loading } = useAuth();
    const navigate = useNavigate(); // Initialize useNavigate hook

    useEffect(() => {
        localStorage.setItem('isdark', JSON.stringify(isdark));
        document.documentElement.setAttribute('data-theme', isdark ? 'customNight' : 'customWinter');
    }, [isdark]);

    const handleLogout = () => {
        logOut()
            .then(() => {
                console.log('User logged out');
                navigate('/'); // <<< ADDED: Navigate to Home Page
            })
            .catch(error => console.error('Logout error:', error));
    };

    // -------------------------------------------------------------
    // 1. LOADING STATE CHECK
    // -------------------------------------------------------------
    if (loading) {
        return (
            <div className="navbar bg-base-100 shadow-sm container mx-auto">
                <div className="navbar-start">
                    <Logo />
                </div>
                <div className="navbar-end">
                    <span className="loading loading-spinner loading-md mr-4"></span>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }
    // -------------------------------------------------------------


    const navLinks = <>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/all-products">All Products</NavLink></li>
        <li><NavLink to="/about">About Us</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>
    </>;

    // -------------------------------------------------------------
    // REMOVED authenticatedLinks TO IMPLEMENT DROPDOWN IN THE RETURN
    // -------------------------------------------------------------

    const unauthenticatedButtons = (
        <>
            <li><NavLink to='/login' className='btn btn-primary mr-3 w-[100px]'>Login</NavLink></li>
            <li><NavLink to='/register' className='btn btn-secondary w-[100px]'>Register</NavLink></li>
        </>
    );

    const profileDropdown = (
        <div className="dropdown dropdown-end ml-4">
            {/* Profile Image/Avatar Button */}
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                    {/* Use user's photoURL or a fallback */}
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
            </div>

            {/* Dropdown Menu Items */}
            <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
                {/* 1. Profile Link */}
                <li>
                    <NavLink to="/dashboard/profile" className="justify-between">
                        Profile
                        <span className="badge">View</span>
                    </NavLink>
                </li>

                {/* 2. Dashboard Link */}
                <li><NavLink to="/dashboard">Dashboard</NavLink></li>

                {/* 3. Logout Button */}
                <li>
                    <a onClick={handleLogout} className='text-red-500 hover:bg-red-50'>
                        Logout
                    </a>
                </li>
            </ul>
        </div>
    );

    // -------------------------------------------------------------
    // RENDER SECTION
    // -------------------------------------------------------------

    return (
        <div className="navbar bg-base-100 shadow-sm ">
            <div className='navbar container mx-auto'>

                {/* LEFT SIDE (Logo + Mobile Menu) */}
                <div className="navbar-start">
                    {/* Mobile Dropdown (Hamburger Menu) */}
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </label>

                        {/* Mobile Menu Items */}
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                        >
                            {navLinks}
                            {/* Mobile menu logic remains the same for simplicity */}
                            {user ? (
                                <>
                                    <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                                    <li><NavLink to="/dashboard/profile">Profile</NavLink></li>
                                    <li><a onClick={handleLogout}>Logout</a></li>
                                </>
                            ) : (
                                unauthenticatedButtons
                            )}

                            <div className="mt-2">
                                {/* Mobile Theme Toggle */}
                                <label className="swap swap-rotate">
                                    <input
                                        type="checkbox"
                                        className="theme-controller"
                                        checked={isdark}
                                        onChange={() => setIsdark(!isdark)}
                                    />
                                    <FaSun className="swap-off fill-current w-6 h-6" />
                                    <FaMoon className="swap-on fill-current w-6 h-6" />
                                </label>
                            </div>
                        </ul>
                    </div>

                    {/* Logo */}
                    <Logo />
                </div>

                {/* RIGHT SIDE (Desktop Menu & Auth/Profile) */}
                <div className="navbar-end hidden lg:flex items-center gap-4">
                    <ul className="menu menu-horizontal px-1 items-center">
                        {navLinks}
                        {/* Only show login/register buttons if not authenticated */}
                        {!user && unauthenticatedButtons}
                    </ul>

                    {/* Authentication/Profile Section */}
                    {user ? (
                        <>
                            {profileDropdown}
                        </>
                    ) : null}

                    {/* Theme Toggle */}
                    <label className="swap swap-rotate ml-4">
                        <input
                            type="checkbox"
                            className="theme-controller"
                            checked={isdark}
                            onChange={() => setIsdark(!isdark)}
                        />
                        <FaSun className="swap-off fill-current w-6 h-6" />
                        <FaMoon className="swap-on fill-current w-6 h-6" />
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Navbar;