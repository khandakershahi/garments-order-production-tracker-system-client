import React from 'react';
import { motion } from 'framer-motion';
import { FaTshirt, FaIndustry, FaBox, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router';

const Categories = () => {
    const categories = [
        {
            icon: <FaTshirt className="text-5xl" />,
            name: 'T-Shirts & Tops',
            description: 'Custom printed and embroidered t-shirts',
            count: '150+ Products',
            color: 'from-blue-500 to-blue-600'
        },
        {
            icon: <FaIndustry className="text-5xl" />,
            name: 'Industrial Uniforms',
            description: 'Professional workwear and safety gear',
            count: '80+ Products',
            color: 'from-green-500 to-green-600'
        },
        {
            icon: <FaBox className="text-5xl" />,
            name: 'Bulk Orders',
            description: 'Large quantity orders with custom specs',
            count: '200+ Orders',
            color: 'from-purple-500 to-purple-600'
        },
        {
            icon: <FaUsers className="text-5xl" />,
            name: 'Corporate Wear',
            description: 'Professional attire for businesses',
            count: '120+ Products',
            color: 'from-orange-500 to-orange-600'
        }
    ];

    return (
        <section className="py-20 bg-base-100">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
                        Product Categories
                    </h2>
                    <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                        Browse our wide range of garment categories for all your production needs
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link to="/all-products">
                                <div className={`card bg-gradient-to-br ${category.color} text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 cursor-pointer h-full`}>
                                    <div className="card-body items-center text-center">
                                        <div className="mb-4">{category.icon}</div>
                                        <h3 className="card-title text-2xl mb-2">{category.name}</h3>
                                        <p className="text-white/90 mb-4">{category.description}</p>
                                        <div className="badge badge-outline border-white text-white">
                                            {category.count}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
