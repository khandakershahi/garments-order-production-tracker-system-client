import React from 'react';
import { FaTwitter, FaYoutube, FaFacebook } from 'react-icons/fa'; // Requires react-icons package


const Footer = () => {
    return (
        <footer className="bg-base-200 text-base-content p-10">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* LOGO + DESCRIPTION */}
                    <div>
                        <h2 className="text-2xl font-bold">GarmentTrack</h2>
                        <p className="mt-2">
                            A smart tracking solution for garment production, orders,
                            inventory, and real-time progress monitoring.
                        </p>
                    </div>

                    {/* USEFUL LINKS */}
                    <div>
                        <span className="footer-title">Useful Links</span>
                        <ul className="space-y-2">
                            <li><a className="link link-hover">Home</a></li>
                            <li><a className="link link-hover">All Products</a></li>
                            <li><a className="link link-hover">About Us</a></li>
                            <li><a className="link link-hover">Contact</a></li>
                        </ul>
                    </div>

                    {/* SUPPORT */}
                    <div>
                        <span className="footer-title">Support</span>
                        <ul className="space-y-2">
                            <li><a className="link link-hover">FAQ</a></li>
                            <li><a className="link link-hover">Help Center</a></li>
                            <li><a className="link link-hover">Privacy Policy</a></li>
                            <li><a className="link link-hover">Terms & Conditions</a></li>
                        </ul>
                    </div>

                    {/* CONTACT */}
                    <div>
                        <span className="footer-title">Contact</span>
                        <p>Email: support@garmenttrack.com</p>
                        <p>Phone: +880 1234 567 890</p>
                        <p>Location: Dhaka, Bangladesh</p>
                    </div>
                </div>

                {/* COPYRIGHT */}
                <div className="text-center mt-10 border-t pt-5">
                    <p>© {new Date().getFullYear()} GarmentTrack — All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;