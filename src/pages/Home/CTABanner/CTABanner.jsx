import React from 'react';
import { motion } from 'framer-motion';

const CTABanner = () => {
    return (
        // bg-primary and text-primary-content uses the main accent color for high visibility
        <section className="py-16 bg-primary">
            <div className="container mx-auto px-4 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-5xl font-extrabold text-primary-content mb-4"
                >
                    Ready to Streamline Your Production?
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-primary-content/80 mb-8 max-w-3xl mx-auto"
                >
                    Start tracking orders instantly, gain real-time visibility, and manage approvals effortlessly.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                    className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
                >
                    {/* Primary Button: btn-secondary stands out against bg-primary */}
                    <a href="/register">
                        <button className="btn btn-secondary btn-lg shadow-xl text-lg w-64">
                            Start Tracking Now
                        </button>
                    </a>
                    {/* Secondary Button: btn-outline maintains primary color but is less dominant */}
                    <a href="/pricing">
                        <button className="btn btn-outline btn-lg shadow-xl text-lg w-64 border-primary-content text-primary-content hover:bg-primary-content hover:text-primary">
                            View Pricing Plans
                        </button>
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default CTABanner;