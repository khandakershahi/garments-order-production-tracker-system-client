import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// =======================================================
// 1. IMAGE IMPORTS & SLIDE DATA (Unchanged)
// =======================================================
import BannerImg1 from '../../../assets/men-green-panjabi.png';
import BannerImg2 from '../../../assets/Women-Sharee.png';
import BannerImg3 from '../../../assets/Womens-Three-Piece-Set.png';

// Note: I'm keeping the slide data exactly as you provided, with the corrected 'orange' typo
const heroSlides = [
    {
        id: 1,
        title: "Seamless Order Tracking",
        subtitle: "Monitor every step from cutting to delivery.",
        image: BannerImg1,
        ctaText: "View All Products",
        ctaLink: "/products",
        bgColor: "bg-green-100",
    },
    {
        id: 2,
        title: "Quality Production Management",
        subtitle: "Manager tools for swift approval and tracking.",
        image: BannerImg2,
        ctaText: "Book a Product",
        ctaLink: "/register",
        // FIX: Corrected typo 'bg-ornage-100' to 'bg-orange-100'
        bgColor: "bg-orange-100",
    },
    {
        id: 3,
        title: "Unique Garment Solutions",
        subtitle: "Designed for small to medium-sized factories.",
        image: BannerImg3,
        ctaText: "Learn More",
        ctaLink: "/about-us",
        bgColor: "bg-yellow-100",
    },
];

// =======================================================
// 2. FRAMER MOTION VARIANTS (Unchanged)
// =======================================================
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

// =======================================================
// 3. HERO SLIDER COMPONENT
// =======================================================
const Hero = () => {
    const [page, setPage] = useState(0);
    const [direction, setDirection] = useState(0);

    // Removed getDarkBgClass function

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
                    // FIX: Removed dynamic darkBgClass. The light mode class is the ONLY background class.
                    className={`absolute inset-0 flex items-center justify-center p-8 transition-colors duration-500 ${currentSlide.bgColor}`}
                >
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between h-full">
                        {/* Descriptive Text Section */}
                        <div className="flex-1 space-y-6 lg:mr-12 text-center lg:text-left">
                            {/* FIX: Set text explicitly to dark gray/black to ensure visibility */}
                            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
                                {currentSlide.title}
                            </h1>
                            <p className="text-xl text-gray-700 max-w-lg">
                                {currentSlide.subtitle}
                            </p>

                            {/* CTA Button */}
                            <a href={currentSlide.ctaLink}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300"
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
                                className="object-fill w-auto h-[500px] rounded-lg aspect-auto"
                            />
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons (Prev) */}
            <button
                onClick={handlePrev}
                // FIX: Removed dark mode class from button background
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/70 rounded-full shadow-lg z-10 hover:bg-white transition"
            >
                {/* FIX: Removed dark mode class from icon color */}
                <FaChevronLeft className="text-gray-700" />
            </button>
            {/* Navigation Buttons (Next) */}
            <button
                onClick={handleNext}
                // FIX: Removed dark mode class from button background
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/70 rounded-full shadow-lg z-10 hover:bg-white transition"
            >
                {/* FIX: Removed dark mode class from icon color */}
                <FaChevronRight className="text-gray-700" />
            </button>
        </div>
    );
};

export default Hero;