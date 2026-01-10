import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate subscription
        setTimeout(() => {
            Swal.fire({
                icon: 'success',
                title: 'Subscribed!',
                text: 'Thank you for subscribing to our newsletter.',
                confirmButtonColor: '#10b981'
            });
            setEmail('');
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <section className="py-20 bg-gradient-to-r from-secondary/10 to-primary/10">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="card bg-base-100 shadow-2xl">
                        <div className="card-body items-center text-center p-8 md:p-12">
                            <FaEnvelope className="text-6xl text-primary mb-6" />
                            <h2 className="card-title text-3xl md:text-4xl font-bold mb-4">
                                Subscribe to Our Newsletter
                            </h2>
                            <p className="text-base-content/70 text-lg mb-8 max-w-2xl">
                                Get the latest updates on new products, special offers, and industry insights delivered straight to your inbox.
                            </p>

                            <form onSubmit={handleSubmit} className="w-full max-w-md">
                                <div className="join w-full">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="input input-bordered join-item w-full"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary join-item"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="loading loading-spinner"></span>
                                        ) : (
                                            <>
                                                <FaPaperPlane />
                                                Subscribe
                                            </>
                                        )}
                                    </button>
                                </div>
                                <p className="text-sm text-base-content/60 mt-4">
                                    We respect your privacy. Unsubscribe at any time.
                                </p>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Newsletter;
