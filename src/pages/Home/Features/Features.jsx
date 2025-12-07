import React from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaChartLine, FaCheckCircle, FaUsers, FaGlobe, FaMapPin } from 'react-icons/fa';

const features = [
    {
        icon: FaChartLine,
        title: "Real-Time Tracking",
        description: "Monitor every production stage—from cutting to shipping—with instant updates.",
        color: "text-primary",
    },
    {
        icon: FaCheckCircle,
        title: "Manager Approval Flow",
        description: "Swift digital approval mechanisms to keep the production line moving without delays.",
        color: "text-secondary",
    },
    {
        icon: FaLock,
        title: "Secure Buyer/Manager Login",
        description: "Dedicated and secure portals for factories and clients, ensuring data privacy.",
        color: "text-accent",
    },
    {
        icon: FaUsers,
        title: "Multi-User Access",
        description: "Assign roles and permissions to different team members across production and management.",
        color: "text-info",
    },
    {
        icon: FaMapPin,
        title: "Interactive Delivery Map",
        description: "Visual tracking on a map once the order is shipped for predictable delivery times.",
        color: "text-warning",
    },
    {
        icon: FaGlobe,
        title: "Global Ready Design",
        description: "Optimized for speed and responsiveness across all devices and regions.",
        color: "text-success",
    },
];

const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
};

const Features = () => {
    return (
        // Use bg-base-100 or bg-base-200 to contrast with surrounding sections
        <section className="py-20 bg-base-100">
            <div className="container mx-auto px-4 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-extrabold text-base-content mb-3"
                >
                    System Highlights
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-base-content/70 mb-12"
                >
                    Efficiency, Transparency, and Control at Your Fingertips.
                </motion.p>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            className="card bg-base-200 shadow-xl p-6 h-full flex flex-col items-center text-center transition-colors duration-300 hover:shadow-2xl hover:border-b-4 hover:border-primary"
                        >
                            <div className={`text-5xl mb-4 ${feature.color}`}>
                                <feature.icon />
                            </div>
                            <h3 className="text-2xl font-semibold text-base-content mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-base-content/70">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Features;