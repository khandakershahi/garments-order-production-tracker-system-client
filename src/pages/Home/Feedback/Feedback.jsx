import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// =======================================================
// 1. Theme Logic Simplification (REMOVED: useIsDarkMode hook)
// DaisyUI handles theme switching automatically via CSS/Tailwind utility classes.
// =======================================================

// =======================================================
// 2. FEEDBACK DATA (Mock Data - Unchanged)
// =======================================================
const reviews = [
    { id: 1, name: "Aisha Rahman (Buyer)", product: "Women's Sharee", feedback: "The tracking system is incredibly detailed! I knew exactly when my order went from sewing to QC. Fantastic visibility—never had to call customer service.", rating: 5, },
    { id: 2, name: "Omar Khan (Buyer)", product: "Men's Panjabi Set", feedback: "Being able to see the production status was a game-changer. The final quality was perfect, and the delivery map was a great touch.", rating: 5, },
    { id: 3, name: "Tanjila Akter (Manager)", product: "System Admin", feedback: "Approving and adding tracking milestones is intuitive. This centralized dashboard cut down our communication time with production by 40%. Highly effective tool.", rating: 4, },
];

// =======================================================
// 3. FRAMER MOTION VARIANTS (Unchanged)
// =======================================================
const carouselVariants = {
    enter: (direction) => {
        return { x: direction > 0 ? 1000 : -1000, opacity: 0, };
    },
    center: {
        zIndex: 1, x: 0, opacity: 1,
        transition: { x: { type: "spring", stiffness: 500, damping: 50 }, opacity: { duration: 0.2 }, },
    },
    exit: (direction) => {
        return {
            zIndex: 0, x: direction < 0 ? 1000 : -1000, opacity: 0,
            transition: { x: { type: "spring", stiffness: 500, damping: 50 }, opacity: { duration: 0.2 }, },
        };
    },
};

// =======================================================
// 4. COMPONENT (Using DaisyUI Classes)
// =======================================================
const Feedback = () => {
    // Theme logic is now unnecessary; colors are handled by DaisyUI classes.

    const [[page, direction], setPage] = useState([0, 0]);
    const reviewIndex = page % reviews.length;

    const paginate = (newDirection) => {
        setPage([page + newDirection, newDirection]);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1);
        }, 6000);

        return () => clearInterval(timer);
    }, [page]);

    return (
        // bg-base-200 provides a slight contrast to the main background
        <section className="py-16 bg-base-200 transition-colors duration-500">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    {/* text-base-content is the main text color */}
                    <h2 className="text-4xl font-extrabold mb-3 text-base-content">
                        What Our Users Say
                    </h2>
                    {/* text-base-content/70 for subtext */}
                    <p className="text-xl text-base-content/70">
                        Trusted feedback from Buyers and Managers.
                    </p>
                </div>

                <div className="relative h-[300px] flex items-center justify-center">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={page}
                            custom={direction}
                            variants={carouselVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            // Card Styling: bg-base-100 is the main surface color
                            className="absolute w-full max-w-4xl p-8 rounded-2xl shadow-xl transition-colors duration-500 border-t-8 border-primary flex flex-col justify-between bg-base-100"
                        >
                            {/* Accent Icon: text-primary */}
                            <FaQuoteLeft className="text-3xl mb-4 self-start text-primary" />

                            {/* Feedback Text: text-base-content/70 for light, text-base-content for contrast */}
                            <p className="text-lg italic mb-4 text-base-content/80">
                                "{reviews[reviewIndex].feedback}"
                            </p>

                            {/* Author Info */}
                            <div className="mt-4 pt-4 border-t border-base-300">
                                {/* Name: text-base-content */}
                                <p className="font-bold text-base-content">
                                    {reviews[reviewIndex].name}
                                </p>
                                {/* Product: text-primary */}
                                <p className="text-sm text-primary">
                                    {reviews[reviewIndex].product}
                                </p>
                                {/* Star Rating (Static yellow is fine for stars) */}
                                <div className="flex text-yellow-500 text-sm mt-1">
                                    {[...Array(reviews[reviewIndex].rating)].map((_, i) => (
                                        <span key={i}>★</span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <button
                        onClick={() => paginate(-1)}
                        // btn-circle is a DaisyUI class
                        className="absolute btn btn-circle btn-sm left-0 lg:-left-16 shadow-lg z-20"
                    >
                        <FaChevronLeft className="text-lg" />
                    </button>
                    <button
                        onClick={() => paginate(1)}
                        className="absolute btn btn-circle btn-sm right-0 lg:-right-16 shadow-lg z-20"
                    >
                        <FaChevronRight className="text-lg" />
                    </button>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center mt-12 space-x-2">
                    {reviews.map((_, idx) => (
                        <div
                            key={idx}
                            onClick={() => setPage([idx, idx > reviewIndex ? 1 : -1])}
                            // Using DaisyUI's neutral and primary colors for dots
                            className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${reviewIndex === idx
                                ? 'bg-primary' // Active dot uses primary color
                                : 'bg-neutral/50 hover:bg-neutral' // Inactive dot uses neutral color
                                }`}
                        ></div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Feedback;