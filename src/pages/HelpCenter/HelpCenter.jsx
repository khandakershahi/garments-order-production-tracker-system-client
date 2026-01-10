import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaBook, FaHeadset, FaEnvelope, FaQuestionCircle } from 'react-icons/fa';
import { Link } from 'react-router';

const HelpCenter = () => {
    const helpTopics = [
        {
            icon: <FaBook className="text-4xl" />,
            title: 'Getting Started',
            description: 'Learn the basics of using our platform',
            topics: [
                'Creating an account',
                'Navigating the dashboard',
                'Understanding user roles',
                'First order walkthrough'
            ]
        },
        {
            icon: <FaQuestionCircle className="text-4xl" />,
            title: 'Orders & Payments',
            description: 'Everything about placing and managing orders',
            topics: [
                'How to place an order',
                'Payment methods',
                'Order approval process',
                'Canceling orders'
            ]
        },
        {
            icon: <FaHeadset className="text-4xl" />,
            title: 'Account Management',
            description: 'Manage your account settings',
            topics: [
                'Updating profile information',
                'Changing password',
                'Managing notifications',
                'Account security'
            ]
        },
        {
            icon: <FaEnvelope className="text-4xl" />,
            title: 'Contact & Support',
            description: 'Get help when you need it',
            topics: [
                'Contact methods',
                'Support hours',
                'Response time',
                'Emergency support'
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-base-100">
            <Helmet>
                <title>Help Center - Garments Order Tracker</title>
                <meta name="description" content="Get help and support for using our garments order tracking system" />
            </Helmet>

            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="hero min-h-[40vh] bg-gradient-to-r from-primary/10 to-secondary/10"
            >
                <div className="hero-content text-center">
                    <div className="max-w-3xl">
                        <motion.h1
                            initial={{ y: -50 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-bold text-base-content mb-6"
                        >
                            Help Center
                        </motion.h1>
                        <motion.p
                            initial={{ y: 50 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-base-content/80"
                        >
                            Find guides, tutorials, and support resources
                        </motion.p>
                    </div>
                </div>
            </motion.section>

            {/* Search Section */}
            <section className="py-12 bg-base-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        <div className="form-control">
                            <div className="join w-full">
                                <input
                                    type="text"
                                    placeholder="Search for help..."
                                    className="input input-bordered join-item w-full"
                                />
                                <button className="btn btn-primary join-item">Search</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Help Topics */}
            <section className="py-20 bg-base-200">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {helpTopics.map((topic, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all"
                            >
                                <div className="card-body">
                                    <div className="text-primary mb-4">{topic.icon}</div>
                                    <h2 className="card-title text-2xl mb-2">{topic.title}</h2>
                                    <p className="text-base-content/70 mb-4">{topic.description}</p>
                                    <ul className="space-y-2">
                                        {topic.topics.map((item, idx) => (
                                            <li key={idx} className="flex items-center">
                                                <span className="mr-2">•</span>
                                                <span className="text-base-content/80">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="py-16 bg-base-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-base-content mb-12">
                        Quick Links
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <Link to="/faq" className="card bg-base-200 hover:bg-primary/10 transition-all">
                            <div className="card-body items-center text-center">
                                <FaQuestionCircle className="text-4xl text-primary mb-2" />
                                <h3 className="card-title">FAQ</h3>
                                <p className="text-sm text-base-content/70">Common questions answered</p>
                            </div>
                        </Link>
                        <Link to="/contact" className="card bg-base-200 hover:bg-primary/10 transition-all">
                            <div className="card-body items-center text-center">
                                <FaEnvelope className="text-4xl text-primary mb-2" />
                                <h3 className="card-title">Contact Us</h3>
                                <p className="text-sm text-base-content/70">Get in touch with support</p>
                            </div>
                        </Link>
                        <a href="mailto:support@garments.com" className="card bg-base-200 hover:bg-primary/10 transition-all">
                            <div className="card-body items-center text-center">
                                <FaHeadset className="text-4xl text-primary mb-2" />
                                <h3 className="card-title">Email Support</h3>
                                <p className="text-sm text-base-content/70">support@garments.com</p>
                            </div>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HelpCenter;
