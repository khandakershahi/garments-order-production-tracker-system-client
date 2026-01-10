import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const contactInfo = [
        {
            icon: <FaPhone className="text-3xl" />,
            title: 'Phone',
            details: '+880 1234-567890',
            link: 'tel:+8801234567890'
        },
        {
            icon: <FaEnvelope className="text-3xl" />,
            title: 'Email',
            details: 'info@garments.com',
            link: 'mailto:info@garments.com'
        },
        {
            icon: <FaMapMarkerAlt className="text-3xl" />,
            title: 'Address',
            details: 'Dhaka, Bangladesh',
            link: null
        },
        {
            icon: <FaClock className="text-3xl" />,
            title: 'Working Hours',
            details: 'Mon - Sat: 9AM - 6PM',
            link: null
        },
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            Swal.fire({
                icon: 'success',
                title: 'Message Sent!',
                text: 'Thank you for contacting us. We will get back to you soon.',
                confirmButtonColor: '#10b981'
            });
            
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-base-100">
            <Helmet>
                <title>Contact Us - Garments Order Tracker</title>
                <meta name="description" content="Get in touch with us for inquiries about garments orders and production" />
            </Helmet>
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="hero min-h-[50vh] bg-gradient-to-r from-primary/10 to-secondary/10"
            >
                <div className="hero-content text-center">
                    <div className="max-w-3xl">
                        <motion.h1
                            initial={{ y: -50 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-bold text-base-content mb-6"
                        >
                            Get In Touch
                        </motion.h1>
                        <motion.p
                            initial={{ y: 50 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl md:text-2xl text-base-content/80"
                        >
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </motion.p>
                    </div>
                </div>
            </motion.section>

            {/* Contact Info Cards */}
            <section className="py-20 bg-base-200">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all"
                            >
                                <div className="card-body items-center text-center">
                                    <div className="text-primary mb-4">{info.icon}</div>
                                    <h3 className="card-title text-base-content mb-2">{info.title}</h3>
                                    {info.link ? (
                                        <a
                                            href={info.link}
                                            className="text-base-content/70 hover:text-primary transition-colors"
                                        >
                                            {info.details}
                                        </a>
                                    ) : (
                                        <p className="text-base-content/70">{info.details}</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-20 bg-base-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-center text-base-content mb-4">
                                Send Us a Message
                            </h2>
                            <p className="text-center text-base-content/70 text-lg mb-12">
                                Fill out the form below and we'll get back to you within 24 hours.
                            </p>

                            <div className="card bg-base-200 shadow-2xl">
                                <div className="card-body">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Name */}
                                        <div className="form-control w-full">
                                            <label className="label">
                                                <span className="label-text text-base-content">Your Name *</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                className="input input-bordered bg-base-100 text-base-content w-full"
                                                required
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="form-control w-full">
                                            <label className="label">
                                                <span className="label-text text-base-content">Your Email *</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                                className="input input-bordered bg-base-100 text-base-content w-full"
                                                required
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div className="form-control w-full">
                                            <label className="label">
                                                <span className="label-text text-base-content">Phone Number</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+880 1234-567890"
                                                className="input input-bordered bg-base-100 text-base-content w-full"
                                            />
                                        </div>

                                        {/* Subject */}
                                        <div className="form-control w-full">
                                            <label className="label">
                                                <span className="label-text text-base-content">Subject *</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                placeholder="Inquiry about bulk orders"
                                                className="input input-bordered bg-base-100 text-base-content w-full"
                                                required
                                            />
                                        </div>

                                        {/* Message */}
                                        <div className="form-control w-full">
                                            <label className="label">
                                                <span className="label-text text-base-content">Message *</span>
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Tell us about your requirements..."
                                                className="textarea textarea-bordered h-32 bg-base-100 text-base-content w-full"
                                                required
                                            ></textarea>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="form-control w-full mt-6">
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-lg w-full text-white"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <span className="loading loading-spinner"></span>
                                                ) : (
                                                    <>
                                                        <FaPaperPlane />
                                                        Send Message
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-20 bg-base-200">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold text-center text-base-content mb-8">
                            Our Location
                        </h2>
                        <div className="card bg-base-100 shadow-xl overflow-hidden">
                            <MapContainer
                                center={[23.8103, 90.4125]}
                                zoom={13}
                                scrollWheelZoom={false}
                                style={{ height: '400px', width: '100%' }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[23.8103, 90.4125]}>
                                    <Popup>
                                        Garments Order Tracker <br /> Dhaka, Bangladesh
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Contact;