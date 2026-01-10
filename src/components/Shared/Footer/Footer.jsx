import React from 'react';
import { FaTwitter, FaYoutube, FaFacebook, FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';
import { Link } from 'react-router';
import Logo from '../../Logo/Logo';


const Footer = () => {
    return (
        <footer className="bg-base-300 text-base-content p-10">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* LOGO + DESCRIPTION */}
                    <div>
                        <Logo></Logo>
                        <p className="mt-2">
                            A smart tracking solution for garment production, orders,
                            inventory, and real-time progress monitoring.
                        </p>
                    </div>

                    {/* USEFUL LINKS */}
                    <div>
                        <span className="footer-title">Useful Links</span>
                        <ul className="space-y-2">
                            <li><Link to="/" className="link link-hover">Home</Link></li>
                            <li><Link to="/all-products" className="link link-hover">All Products</Link></li>
                            <li><Link to="/about" className="link link-hover">About Us</Link></li>
                            <li><Link to="/contact" className="link link-hover">Contact</Link></li>
                        </ul>
                    </div>

                    {/* SUPPORT */}
                    <div>
                        <span className="footer-title">Support</span>
                        <ul className="space-y-2">
                            <li><Link to="/faq" className="link link-hover">FAQ</Link></li>
                            <li><Link to="/help-center" className="link link-hover">Help Center</Link></li>
                            <li><Link to="/privacy-policy" className="link link-hover">Privacy Policy</Link></li>
                            <li><Link to="/terms-conditions" className="link link-hover">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    {/* CONTACT */}
                    <div>
                        <span className="footer-title">Contact</span>
                        <p>Email: support@garmenttrack.com</p>
                        <p>Phone: +880 1234 567 890</p>
                        <p>Location: Dhaka, Bangladesh</p>
                        
                        {/* SOCIAL MEDIA LINKS */}
                        <div className="mt-4">
                            <span className="footer-title">Connect With Us</span>
                            <div className="flex gap-4 mt-2">
                                <a 
                                    href="https://khandakershahi.com/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn btn-ghost btn-circle hover:bg-primary hover:text-white transition-all"
                                    aria-label="Website"
                                >
                                    <FaGlobe className="text-xl" />
                                </a>
                                <a 
                                    href="https://github.com/khandakershahi" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn btn-ghost btn-circle hover:bg-primary hover:text-white transition-all"
                                    aria-label="GitHub"
                                >
                                    <FaGithub className="text-xl" />
                                </a>
                                <a 
                                    href="https://www.linkedin.com/in/khandaker-shahi/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn btn-ghost btn-circle hover:bg-primary hover:text-white transition-all"
                                    aria-label="LinkedIn"
                                >
                                    <FaLinkedin className="text-xl" />
                                </a>
                            </div>
                        </div>
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