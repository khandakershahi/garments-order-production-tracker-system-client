import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaClock, FaHeadset } from 'react-icons/fa';

const TrustBadges = () => {
    const badges = [
        {
            icon: <FaShieldAlt className="text-4xl text-primary" />,
            title: 'Secure Payments',
            description: 'SSL encrypted transactions'
        },
        {
            icon: <FaClock className="text-4xl text-secondary" />,
            title: '24/7 Processing',
            description: 'Round-the-clock order management'
        },
        {
            icon: <FaHeadset className="text-4xl text-accent" />,
            title: 'Expert Support',
            description: 'Dedicated customer service team'
        }
    ];

    return (
        <section className="py-16 bg-base-200">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {badges.map((badge, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex items-center gap-4 p-6 bg-base-100 rounded-lg shadow-md"
                        >
                            <div>{badge.icon}</div>
                            <div>
                                <h3 className="font-bold text-lg text-base-content">{badge.title}</h3>
                                <p className="text-base-content/70">{badge.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustBadges;
