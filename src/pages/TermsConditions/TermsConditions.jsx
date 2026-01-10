import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const TermsConditions = () => {
    return (
        <div className="min-h-screen bg-base-100">
            <Helmet>
                <title>Terms & Conditions - Garments Order Tracker</title>
                <meta name="description" content="Terms and conditions for using Garments Order Production Tracker System" />
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
                            Terms & Conditions
                        </motion.h1>
                        <motion.p
                            initial={{ y: 50 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-base-content/80"
                        >
                            Last updated: January 10, 2026
                        </motion.p>
                    </div>
                </div>
            </motion.section>

            {/* Content Section */}
            <section className="py-20 bg-base-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto prose prose-lg">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8"
                        >
                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title text-3xl mb-4">1. Acceptance of Terms</h2>
                                    <p className="text-base-content/80">
                                        By accessing and using the Garments Order Production Tracker System, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service.
                                    </p>
                                </div>
                            </div>

                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title text-3xl mb-4">2. User Accounts</h2>
                                    <p className="text-base-content/80">
                                        To use our services, you must:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-base-content/80">
                                        <li>Create an account with accurate information</li>
                                        <li>Maintain the security of your account credentials</li>
                                        <li>Notify us immediately of any unauthorized access</li>
                                        <li>Accept responsibility for all activities under your account</li>
                                        <li>Not share your account with others</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title text-3xl mb-4">3. Orders and Payments</h2>
                                    <ul className="list-disc list-inside space-y-2 text-base-content/80">
                                        <li>All orders are subject to manager approval</li>
                                        <li>Prices are listed in USD and may change without notice</li>
                                        <li>Payment must be completed before order processing</li>
                                        <li>We accept payment via Stripe and Cash on Delivery (COD)</li>
                                        <li>Orders can only be cancelled in "Pending" status</li>
                                        <li>Minimum order quantities apply per product</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title text-3xl mb-4">4. User Roles and Permissions</h2>
                                    <p className="text-base-content/80">
                                        Our platform has three user roles:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-base-content/80">
                                        <li><strong>Members:</strong> Can browse products and place orders</li>
                                        <li><strong>Managers:</strong> Can add/manage products and approve orders</li>
                                        <li><strong>Admins:</strong> Full system access including user management</li>
                                    </ul>
                                    <p className="text-base-content/80 mt-4">
                                        Role assignments are at the discretion of system administrators.
                                    </p>
                                </div>
                            </div>

                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title text-3xl mb-4">5. Prohibited Activities</h2>
                                    <p className="text-base-content/80">
                                        You agree not to:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-base-content/80">
                                        <li>Use the service for any illegal purpose</li>
                                        <li>Attempt to gain unauthorized access to the system</li>
                                        <li>Interfere with or disrupt the service</li>
                                        <li>Submit false or misleading information</li>
                                        <li>Engage in fraudulent activities</li>
                                        <li>Violate any applicable laws or regulations</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title text-3xl mb-4">6. Intellectual Property</h2>
                                    <p className="text-base-content/80">
                                        All content, features, and functionality of the service are owned by us and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute any part of the service without permission.
                                    </p>
                                </div>
                            </div>

                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title text-3xl mb-4">7. Limitation of Liability</h2>
                                    <p className="text-base-content/80">
                                        We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service. Our total liability shall not exceed the amount paid by you for the service.
                                    </p>
                                </div>
                            </div>

                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title text-3xl mb-4">8. Termination</h2>
                                    <p className="text-base-content/80">
                                        We reserve the right to suspend or terminate your account at any time for violation of these terms or for any other reason at our discretion. Upon termination, your right to use the service will immediately cease.
                                    </p>
                                </div>
                            </div>

                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title text-3xl mb-4">9. Changes to Terms</h2>
                                    <p className="text-base-content/80">
                                        We may update these Terms and Conditions from time to time. We will notify users of any material changes. Continued use of the service after changes constitutes acceptance of the new terms.
                                    </p>
                                </div>
                            </div>

                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title text-3xl mb-4">10. Contact Information</h2>
                                    <p className="text-base-content/80">
                                        For questions about these Terms and Conditions, contact us at:
                                    </p>
                                    <div className="mt-4 text-base-content/80">
                                        <p>Email: legal@garments.com</p>
                                        <p>Phone: +880 1234-567890</p>
                                        <p>Address: Dhaka, Bangladesh</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TermsConditions;
