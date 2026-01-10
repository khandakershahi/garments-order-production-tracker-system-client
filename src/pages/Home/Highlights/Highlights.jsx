import React from 'react';
import { motion } from 'framer-motion';
import { FaAward, FaShippingFast, FaHandshake, FaChartLine } from 'react-icons/fa';

const Highlights = () => {
    const highlights = [
        {
            icon: <FaAward className="text-6xl text-primary" />,
            title: 'Quality Assured',
            description: 'All products undergo rigorous quality checks before approval',
            stat: '99.8%',
            label: 'Quality Rate'
        },
        {
            icon: <FaShippingFast className="text-6xl text-secondary" />,
            title: 'Fast Processing',
            description: 'Orders are approved and processed within 24-48 hours',
            stat: '24hrs',
            label: 'Avg Response'
        },
        {
            icon: <FaHandshake className="text-6xl text-accent" />,
            title: 'Trusted Partners',
            description: 'Work with verified managers and reliable suppliers',
            stat: '500+',
            label: 'Active Partners'
        },
        {
            icon: <FaChartLine className="text-6xl text-success" />,
            title: 'Real-time Tracking',
            description: 'Monitor your orders from placement to delivery',
            stat: '100%',
            label: 'Transparency'
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-base-200 to-base-300">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
                        Why Choose Us
                    </h2>
                    <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                        We provide exceptional service and quality at every step
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {highlights.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all"
                        >
                            <div className="card-body items-center text-center">
                                <div className="mb-4">{item.icon}</div>
                                <h3 className="card-title text-2xl mb-2">{item.title}</h3>
                                <p className="text-base-content/70 mb-4">{item.description}</p>
                                <div className="stats shadow">
                                    <div className="stat place-items-center">
                                        <div className="stat-value text-primary">{item.stat}</div>
                                        <div className="stat-desc text-base-content/60">{item.label}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Highlights;
