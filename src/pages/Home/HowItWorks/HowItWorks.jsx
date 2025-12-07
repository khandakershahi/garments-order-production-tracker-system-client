import React from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaUserCheck, FaTruck, FaMapMarkedAlt } from 'react-icons/fa';
import { IoIosCut } from 'react-icons/io';

// =======================================================
// 1. STEP DATA (Unchanged)
// =======================================================
const steps = [
    {
        id: 1,
        title: 'Place & Confirm Order',
        description: 'The Buyer submits a custom booking request or places an order via the product page. The order is marked as **Pending** in the system.',
        icon: FaShoppingCart,
    },
    {
        id: 2,
        title: 'Manager Approval',
        description: 'The Manager reviews the order details and either **Approves** it, sending it to production, or Rejects it.',
        icon: FaUserCheck,
    },
    {
        id: 3,
        title: 'Production Stages',
        description: 'The garment goes through tracked internal stages: **Cutting Completed**, **Sewing Started**, **Finishing**, and **QC Checked**.',
        icon: IoIosCut,
    },
    {
        id: 4,
        title: 'Packed & Shipped',
        description: 'Once QC is complete, the Manager marks the item as **Packed** and updates the status to **Shipped** with tracking details.',
        icon: FaTruck,
    },
    {
        id: 5,
        title: 'Track Delivery',
        description: 'The Buyer can track the order’s progress on a visual timeline and **interactive map** until it is delivered.',
        icon: FaMapMarkedAlt,
    },
];

// =======================================================
// 2. FRAMER MOTION VARIANTS (Unchanged)
// =======================================================
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15, // Delay between each step card
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// =======================================================
// 3. COMPONENT (Refactored with DaisyUI)
// =======================================================
const HowItWorks = () => {
    return (
        // bg-base-100 is typically the main background color
        <section className="py-16 bg-base-100 transition-colors duration-500">
            <div className="container mx-auto px-4">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    {/* text-base-content is the primary text color */}
                    <h2 className="text-4xl font-extrabold text-base-content mb-3">
                        How It Works
                    </h2>
                    {/* text-base-content/70 for subtext */}
                    <p className="text-xl text-base-content/70">
                        Follow your garment from booking to final delivery.
                    </p>
                </motion.div>

                {/* Steps Grid/Timeline */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {steps.map((step) => (
                        <motion.div
                            key={step.id}
                            variants={itemVariants}
                            // bg-base-200 provides a slight lift/contrast for the card surface
                            className="relative flex flex-col items-center p-6 bg-base-200 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border-t-4 border-primary"
                        >
                            {/* Icon Circle: bg-primary and text-primary-content */}
                            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 shadow-xl">
                                <step.icon className="text-primary-content text-2xl" />
                            </div>

                            {/* Step Number Badge: bg-primary and text-primary-content */}
                            <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-primary text-primary-content w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                                {step.id}
                            </div>

                            {/* Title: text-base-content */}
                            <h3 className="text-xl font-semibold text-base-content mb-3 text-center">
                                {step.title}
                            </h3>
                            {/* Description: text-base-content/70 for lighter text */}
                            <p className="text-sm text-base-content/70 text-center">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;