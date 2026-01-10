import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-base-100">
            <Helmet>
                <title>Privacy Policy - Garments Order Tracker</title>
                <meta name="description" content="Privacy policy for Garments Order Production Tracker System" />
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
                            Privacy Policy
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
                                    <h2 className="card-title text-3xl mb-4">1. Information We Collect</h2>
                                    <p className="text-base-content/80">
                                        We collect information that you provide directly to us, including:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-base-content/80">
                                        <li>Name, email address, and contact information</li>
                                        <li>Account credentials and profile information</li>
                                        <li>Order details and transaction history</li>
                                        <li>Communication preferences</li>
                                        <li>Payment information (processed securely through Stripe)</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title text-3xl mb-4">2. How We Use Your Information</h2>
                                    <p className="text-base-content/80">
                                        We use the information we collect to:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-base-content/80">
                                        <li>Process and fulfill your orders</li>
                                        <li>Communicate with you about your account and orders</li>
                                        <li>Improve our services and user experience</li>
                                        <li>Send important notifications and updates</li>
                                        <li>Prevent fraud and ensure security</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title text-3xl mb-4">3. Information Sharing</h2>
                                    <p className="text-base-content/80">
                                        We do not sell your personal information. We may share your information with:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-base-content/80">
                                        <li>Service providers who assist in our operations</li>
                                        <li>Payment processors for transaction handling</li>
                                        <li>Legal authorities when required by law</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title text-3xl mb-4">4. Data Security</h2>
                                    <p className="text-base-content/80">
                                        We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. We use Firebase Authentication and secure payment processing through Stripe.
                                    </p>
                                </div>
                            </div>

                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title text-3xl mb-4">5. Your Rights</h2>
                                    <p className="text-base-content/80">
                                        You have the right to:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-base-content/80">
                                        <li>Access your personal information</li>
                                        <li>Request correction of inaccurate data</li>
                                        <li>Request deletion of your account</li>
                                        <li>Opt-out of marketing communications</li>
                                        <li>Export your data</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title text-3xl mb-4">6. Cookies and Tracking</h2>
                                    <p className="text-base-content/80">
                                        We use cookies and similar tracking technologies to enhance your experience and analyze site usage. You can control cookie preferences through your browser settings.
                                    </p>
                                </div>
                            </div>

                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title text-3xl mb-4">7. Contact Us</h2>
                                    <p className="text-base-content/80">
                                        If you have questions about this Privacy Policy, please contact us at:
                                    </p>
                                    <div className="mt-4 text-base-content/80">
                                        <p>Email: privacy@garments.com</p>
                                        <p>Phone: +880 1234-567890</p>
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

export default PrivacyPolicy;
