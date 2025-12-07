import React, { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import Logo from '../../Logo/Logo';
import { NavLink } from 'react-router';


const Navbar = () => {
    const [isdark, setIsdark] = useState(JSON.parse(localStorage.getItem('isdark') || 'false'));

    useEffect(() => {
        localStorage.setItem('isdark', JSON.stringify(isdark));
        document.documentElement.setAttribute('data-theme', isdark ? 'customNight' : 'customWinter');
    }, [isdark]);

    const links = <>
        <li><a>Home</a></li>
        <li><a>All Products</a></li>
        <li><a>About Us</a></li>
        <li><a>Contact</a></li>
        <li><NavLink to='/' className='btn btn-primary mr-3'>Login</NavLink></li>
        <li><NavLink to='/' className='btn btn-secondary'>Register</NavLink></li>

    </>;

    return (
        <div className="navbar bg-base-100 shadow-sm ">
            <div className='navbar container mx-auto'>

                {/* LEFT SIDE (Logo + Mobile Menu) */}
                <div className="navbar-start">
                    {/* Mobile Dropdown */}
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
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
                        >
                            {links}

                            {/* Add theme toggle OUTSIDE the <li> */}
                            <div className="mt-2">
                                {/* Dark Mode Toggle */}
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
                    <Logo></Logo>
                </div>

                {/* RIGHT SIDE (Desktop Menu) */}
                <div className="navbar-end hidden lg:flex items-center gap-4">
                    <ul className="menu menu-horizontal px-1">
                        {links}
                    </ul>

                    {/* Theme Toggle MUST BE OUTSIDE the <ul> */}
                    {/* Dark Mode Toggle */}
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

            </div>
        </div>
    );
};

export default Navbar;
