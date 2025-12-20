import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

// =======================================================
// 1. IMAGE IMPORTS & SLIDE DATA (Refactored to use DaisyUI backgrounds)
// =======================================================
import BannerImg1 from '../../../assets/men-green-panjabi.png';
import BannerImg2 from '../../../assets/Women-Sharee.png';
import BannerImg3 from '../../../assets/Womens-Three-Piece-Set.png';

// =======================================================
// 2. HERO COMPONENT
// =======================================================
const Hero = () => {
    const [page, setPage] = useState(0);
    const [direction, setDirection] = useState(0);

    // Static hero slides - using fallback data
    const heroSlides = [
        {
            id: 1,
            title: "Seamless Order Tracking",
            subtitle: "Monitor every step from cutting to delivery.",
            image: BannerImg1,
            ctaText: "View All Products",
            ctaLink: "/all-products",
            bgColor: "bg-info",
            textColor: "text-info-content"
        },
        {
            id: 2,
            title: "Quality Production Management",
            subtitle: "Manager tools for swift approval and tracking.",
            image: BannerImg2,
            ctaText: "Book a Product",
            ctaLink: "/register",
            bgColor: "bg-accent",
            textColor: "text-accent-content"
        },
        {
            id: 3,
            title: "Unique Garment Solutions",
            subtitle: "Designed for small to medium-sized factories.",
            image: BannerImg3,
            ctaText: "Learn More",
            ctaLink: "/about",
            bgColor: "bg-secondary",
            textColor: "text-secondary-content"
        },
    ];

    const slideVariants = {
        initial: (direction) => {
            return {
                x: direction > 0 ? 1000 : -1000,
                opacity: 0,
            };
        },
        animate: {
            x: 0,
            opacity: 1,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
            },
        },
        exit: (direction) => {
            return {
                x: direction > 0 ? -1000 : 1000,
                opacity: 0,
                transition: {
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                },
            };
        },
    };

    const handleNext = () => {
        setDirection(1);
        setPage((prevPage) =>
            prevPage === heroSlides.length - 1 ? 0 : prevPage + 1
        );
    };

    const handlePrev = () => {
        setDirection(-1);
        setPage((prevPage) =>
            prevPage === 0 ? heroSlides.length - 1 : prevPage - 1
        );
    };

    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 5000);

        return () => clearInterval(timer);
    }, [page]);

    const currentSlide = heroSlides[page];

    return (
        <div className="relative w-full h-[600px] overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={page}
                    custom={direction}
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    // DaisyUI Background Color
                    className={`absolute inset-0 flex items-center justify-center p-8 transition-colors duration-500 ${currentSlide.bgColor}`}
                >
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between h-full">
                        {/* Descriptive Text Section */}
                        <div className="flex-1 space-y-6 lg:mr-12 text-center lg:text-left">
                            {/* DaisyUI Text Color (defined in slide data to match the background) */}
                            <h1 className={`text-5xl font-extrabold leading-tight ${currentSlide.textColor}`}>
                                {currentSlide.title}
                            </h1>
                            <p className={`text-xl max-w-lg opacity-90 ${currentSlide.textColor}`}>
                                {currentSlide.subtitle}
                            </p>

                            {/* CTA Button: btn-primary is the DaisyUI equivalent of bg-indigo-600 */}
                            <a href={currentSlide.ctaLink}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    // btn is the base class for DaisyUI buttons
                                    className="px-8 py-3 btn btn-primary text-white font-semibold rounded-full shadow-lg transition duration-300"
                                >
                                    {currentSlide.ctaText}
                                </motion.button>
                            </a>
                        </div>

                        {/* Visually Appealing Image Section */}
                        <div className="flex-1 hidden lg:block">
                            <img
                                src={currentSlide.image}
                                alt={currentSlide.title}
                                className="object-fill w-auto h-[500px] rounded-lg aspect-auto "
                            />
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons (Prev) */}
            <button
                onClick={handlePrev}
                // DaisyUI btn-circle and appropriate styling for light/dark contrast
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 btn btn-circle btn-sm bg-base-100/70 shadow-xl z-10 hover:bg-base-100 transition"
            >
                <FaChevronLeft className="text-base-content" />
            </button>
            {/* Navigation Buttons (Next) */}
            <button
                onClick={handleNext}
                // DaisyUI btn-circle and appropriate styling for light/dark contrast
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 btn btn-circle btn-sm bg-base-100/70 shadow-xl z-10 hover:bg-base-100 transition"
            >
                <FaChevronRight className="text-base-content" />
            </button>
        </div>
    );
};

export default Hero;