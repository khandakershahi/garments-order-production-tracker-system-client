import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaAward, FaUsers, FaShippingFast, FaCheckCircle } from 'react-icons/fa';

const AboutUs = () => {
    const stats = [
        { icon: <FaUsers className="text-5xl" />, value: '500+', label: 'Happy Clients' },
        { icon: <FaAward className="text-5xl" />, value: '15+', label: 'Years Experience' },
        { icon: <FaShippingFast className="text-5xl" />, value: '10K+', label: 'Orders Delivered' },
        { icon: <FaCheckCircle className="text-5xl" />, value: '100%', label: 'Quality Assured' },
    ];

    const values = [
        {
            title: 'Quality First',
            description: 'We ensure every garment meets the highest standards of quality and craftsmanship.',
            icon: <FaCheckCircle className="text-4xl text-primary" />
        },
        {
            title: 'Customer Focused',
            description: 'Your satisfaction is our priority. We work closely with clients to meet their exact requirements.',
            icon: <FaUsers className="text-4xl text-secondary" />
        },
        {
            title: 'Timely Delivery',
            description: 'We understand deadlines matter. Our efficient production ensures on-time delivery.',
            icon: <FaShippingFast className="text-4xl text-accent" />
        },
        {
            title: 'Innovation',
            description: 'We embrace modern technology and techniques to provide cutting-edge garment solutions.',
            icon: <FaAward className="text-4xl text-info" />
        },
    ];

    return (
        <div className="min-h-screen bg-base-100">
            <Helmet>
                <title>About Us - Garments Order Tracker</title>
                <meta name="description" content="Learn about our company, values, and commitment to quality garments production" />
            </Helmet>
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="hero min-h-[60vh] bg-gradient-to-r from-primary/10 to-secondary/10"
            >
                <div className="hero-content text-center">
                    <div className="max-w-4xl">
                        <motion.h1
                            initial={{ y: -50 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-5xl md:text-7xl font-bold text-base-content mb-6"
                        >
                            About Our Company
                        </motion.h1>
                        <motion.p
                            initial={{ y: 50 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl md:text-2xl text-base-content/80 leading-relaxed"
                        >
                            Leading garment manufacturer delivering excellence since 2009.
                            We combine traditional craftsmanship with modern technology to create
                            high-quality garments for businesses worldwide.
                        </motion.p>
                    </div>
                </div>
            </motion.section>

            {/* Stats Section */}
            <section className="py-20 bg-base-200">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
                            >
                                <div className="card-body items-center text-center">
                                    <div className="text-primary mb-4">{stat.icon}</div>
                                    <h3 className="text-4xl font-bold text-base-content">{stat.value}</h3>
                                    <p className="text-base-content/70 text-lg">{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-20 bg-base-100">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-center text-base-content mb-8">
                            Our Story
                        </h2>
                        <div className="prose lg:prose-xl mx-auto text-base-content/80">
                            <p className="text-lg leading-relaxed mb-4">
                                Founded in 2009, our garment manufacturing company has grown from a small
                                workshop to a leading provider of quality garments for businesses across
                                the globe. Our journey has been driven by a commitment to excellence,
                                innovation, and customer satisfaction.
                            </p>
                            <p className="text-lg leading-relaxed mb-4">
                                We specialize in producing high-quality custom garments, from corporate
                                uniforms to fashion apparel. Our state-of-the-art facility is equipped
                                with modern machinery and staffed by skilled artisans who take pride in
                                their craft.
                            </p>
                            <p className="text-lg leading-relaxed">
                                Today, we serve over 500 clients worldwide, delivering more than 10,000
                                orders annually. Our success is built on strong relationships, consistent
                                quality, and a deep understanding of the garment industry.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="py-20 bg-base-200">
                <div className="container mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: -30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-bold text-center text-base-content mb-16"
                    >
                        Our Core Values
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all"
                            >
                                <div className="card-body">
                                    <div className="mb-4">{value.icon}</div>
                                    <h3 className="card-title text-2xl text-base-content">{value.title}</h3>
                                    <p className="text-base-content/70 text-lg">{value.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary to-secondary">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Work With Us?
                        </h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Join hundreds of satisfied clients who trust us for their garment needs.
                        </p>
                        <a href="/contact" className="btn btn-lg bg-white text-primary hover:bg-base-200">
                            Get in Touch
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;