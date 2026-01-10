import React from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaUsers, FaBox, FaCheckCircle } from 'react-icons/fa';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const Statistics = () => {
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true
    });

    const stats = [
        {
            icon: <FaShoppingCart className="text-5xl" />,
            value: 15000,
            suffix: '+',
            label: 'Orders Completed',
            color: 'text-error'
        },
        {
            icon: <FaUsers className="text-5xl" />,
            value: 2500,
            suffix: '+',
            label: 'Happy Clients',
            color: 'text-secondary'
        },
        {
            icon: <FaBox className="text-5xl" />,
            value: 500,
            suffix: '+',
            label: 'Products Available',
            color: 'text-accent'
        },
        {
            icon: <FaCheckCircle className="text-5xl" />,
            value: 98,
            suffix: '%',
            label: 'Customer Satisfaction',
            color: 'text-success'
        }
    ];

    return (
        <section className="py-20 bg-primary text-primary-content">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Our Achievement in Numbers
                    </h2>
                    <p className="text-xl text-primary-content/80 max-w-2xl mx-auto">
                        Trusted by thousands of businesses worldwide
                    </p>
                </motion.div>

                <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="card bg-primary-content/10 backdrop-blur-sm shadow-xl"
                        >
                            <div className="card-body items-center text-center">
                                <div className={`mb-4 ${stat.color}`}>{stat.icon}</div>
                                <div className="text-5xl font-bold mb-2">
                                    {inView && (
                                        <CountUp
                                            end={stat.value}
                                            duration={2.5}
                                            suffix={stat.suffix}
                                        />
                                    )}
                                </div>
                                <p className="text-xl text-primary-content/90">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Statistics;
