import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { FaHome, FaSearch } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
            <Helmet>
                <title>404 - Page Not Found | Garments Order Tracker</title>
            </Helmet>
            <div className="max-w-2xl w-full text-center">
                {/* 404 Animation/Image */}
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-primary">404</h1>
                    <div className="mt-4">
                        <FaSearch className="text-6xl text-base-content/30 mx-auto animate-pulse" />
                    </div>
                </div>

                {/* Error Message */}
                <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-lg text-base-content/70 mb-2">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <p className="text-base-content/60">
                        Error Code: 404 - Page Not Found
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link to="/" className="btn btn-primary gap-2">
                        <FaHome />
                        Back to Home
                    </Link>
                    <Link to="/all-products" className="btn btn-outline gap-2">
                        Browse Products
                    </Link>
                </div>

                {/* Helpful Links */}
                <div className="mt-12 pt-8 border-t border-base-300">
                    <p className="text-sm text-base-content/60 mb-4">
                        You might be interested in:
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link to="/about" className="link link-hover text-sm">
                            About Us
                        </Link>
                        <span className="text-base-content/30">•</span>
                        <Link to="/contact" className="link link-hover text-sm">
                            Contact Support
                        </Link>
                        <span className="text-base-content/30">•</span>
                        <Link to="/dashboard" className="link link-hover text-sm">
                            Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
