import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: 'How do I place an order?',
            answer: 'To place an order, browse our products, select the item you want, specify the quantity, and click "Book Now". You\'ll need to be logged in to complete your order.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept online payments through Stripe (credit/debit cards) and Cash on Delivery (COD) for approved orders.'
        },
        {
            question: 'How long does order approval take?',
            answer: 'Orders are typically reviewed and approved by our managers within 24-48 hours. You\'ll receive a notification once your order status changes.'
        },
        {
            question: 'Can I cancel my order?',
            answer: 'Yes, you can cancel your order as long as it\'s still in "Pending" status. Once approved, cancellation may not be possible. Contact support for assistance.'
        },
        {
            question: 'What is the minimum order quantity?',
            answer: 'The minimum order quantity varies by product. Each product page displays the minimum order quantity required.'
        },
        {
            question: 'How do I track my order?',
            answer: 'Once logged in, go to "My Orders" in your dashboard to view all your orders and their current status (Pending, Approved, Cancelled).'
        },
        {
            question: 'What happens after I pay?',
            answer: 'After successful payment, your order status will be updated to "Paid" and our production team will begin processing your order.'
        },
        {
            question: 'Do you offer bulk discounts?',
            answer: 'Yes, we offer special pricing for bulk orders. Please contact our sales team through the Contact page for custom quotes.'
        },
        {
            question: 'Can I modify my order after placing it?',
            answer: 'For order modifications, please contact support immediately. We can only modify orders that haven\'t been approved yet.'
        },
        {
            question: 'How do I become a manager or admin?',
            answer: 'Manager and admin roles are assigned by system administrators. If you\'re interested in a management position, please contact us through our official channels.'
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-base-100">
            <Helmet>
                <title>FAQ - Garments Order Tracker</title>
                <meta name="description" content="Frequently asked questions about our garments order tracking system" />
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
                            Frequently Asked Questions
                        </motion.h1>
                        <motion.p
                            initial={{ y: 50 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-base-content/80"
                        >
                            Find answers to common questions about our services
                        </motion.p>
                    </div>
                </div>
            </motion.section>

            {/* FAQ Section */}
            <section className="py-20 bg-base-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="mb-4"
                            >
                                <div className="collapse collapse-plus bg-base-200">
                                    <input
                                        type="checkbox"
                                        checked={openIndex === index}
                                        onChange={() => toggleFAQ(index)}
                                    />
                                    <div className="collapse-title text-xl font-medium flex items-center justify-between">
                                        {faq.question}
                                    </div>
                                    <div className="collapse-content">
                                        <p className="text-base-content/70">{faq.answer}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-16 bg-base-200">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-base-content mb-4">
                        Still have questions?
                    </h2>
                    <p className="text-base-content/70 mb-6">
                        Can't find the answer you're looking for? Please contact our support team.
                    </p>
                    <a href="/contact" className="btn btn-primary">
                        Contact Support
                    </a>
                </div>
            </section>
        </div>
    );
};

export default FAQ;
