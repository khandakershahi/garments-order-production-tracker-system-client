import React from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaDollarSign } from 'react-icons/fa';
import { useNavigate } from 'react-router';

// =======================================================
// 1. STATIC DATA (To be replaced by TanStack Query later)
// =======================================================
// NOTE: Use placeholder image URLs until you integrate your actual assets.
const staticProducts = [
    {
        _id: '66a1a8e6f1a8b4c5d6e7f8a1',
        name: "Men's Classic Panjabi",
        shortDesc: "Traditional wear in fine cotton with embroidered collar.",
        price: 2800,
        imageUrl: "https://i.ibb.co/L5gqX1J/mens-classic-panjabi.jpg", // Placeholder Image URL
    },
    {
        _id: '66a1a8e6f1a8b4c5d6e7f8a2',
        name: "Women's Royal Sharee",
        shortDesc: "Elegant silk sharee with intricate work, perfect for occasions.",
        price: 7500,
        imageUrl: "https://i.ibb.co/30Z1H2b/womens-royal-sharee.jpg",
    },
    {
        _id: '66a1a8e6f1a8b4c5d6e7f8a3',
        name: "Three-Piece Cotton Set",
        shortDesc: "Comfortable and stylish three-piece set for daily wear.",
        price: 1850,
        imageUrl: "https://i.ibb.co/3sD12f1/three-piece-cotton-set.jpg",
    },
    {
        _id: '66a1a8e6f1a8b4c5d6e7f8a4',
        name: "Premium Denim Jacket",
        shortDesc: "Heavy-duty denim with contrast stitching and inner lining.",
        price: 4200,
        imageUrl: "https://i.ibb.co/Rz0wQGg/premium-denim-jacket.jpg",
    },
    {
        _id: '66a1a8e6f1a8b4c5d6e7f8a5',
        name: "Kids' Festive Outfit",
        shortDesc: "Brightly colored two-piece set for children's festivals.",
        price: 1500,
        imageUrl: "https://i.ibb.co/g4X0yD9/kids-festive-outfit.jpg",
    },
    {
        _id: '66a1a8e6f1a8b4c5d6e7f8a6',
        name: "Leather Shoulder Bag",
        shortDesc: "Handcrafted leather bag with durable hardware and classic finish.",
        price: 3500,
        imageUrl: "https://i.ibb.co/g4X0yD9/leather-shoulder-bag.jpg",
    },
];

// =======================================================
// 2. FRAMER MOTION VARIANTS (For smooth loading)
// =======================================================
const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

// =======================================================
// 3. COMPONENT
// =======================================================
const ProductsSection = () => {
    // useNavigate hook is used for programmatic navigation
    const navigate = useNavigate();

    // The handler function for navigation
    const handleViewDetails = (productId) => {
        // Redirects to the product details page (e.g., /products/66a1...)
        // This route should be protected by your application's private route logic.
        navigate(`/product/${productId}`);
    };

    // Replace this static data with a TanStack Query fetch later:
    // const { data: products, isLoading } = useQuery({ ... });
    const products = staticProducts;

    // In a real scenario, you'd limit the MongoDB result, but here we slice the static data
    const limitedProducts = products.slice(0, 6);

    return (
        <section className="py-20 bg-base-100">
            <div className="container mx-auto px-4">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-extrabold text-base-content mb-3">
                        Featured Products
                    </h2>
                    <p className="text-xl text-base-content/70">
                        Explore our top-selling garments, built with quality and tradition.
                    </p>
                </motion.div>

                {/* Product Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                >
                    {limitedProducts.map((product) => (
                        <motion.div
                            key={product._id}
                            variants={cardVariants}
                            // DaisyUI Card styling: bg-base-200 provides a slight lift
                            className="card w-full bg-base-200 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                        >
                            <figure className="h-64 overflow-hidden">
                                {/* Image */}
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="object-cover w-full h-full"
                                />
                            </figure>

                            <div className="card-body p-6">
                                {/* Product Name */}
                                <h3 className="card-title text-2xl font-bold text-base-content mb-2">
                                    {product.name}
                                </h3>

                                {/* Short Description */}
                                <p className="text-base text-base-content/80 mb-3 line-clamp-2">
                                    {product.shortDesc}
                                </p>

                                {/* Price */}
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="flex items-center text-3xl font-extrabold text-primary">
                                        <FaDollarSign className="w-5 h-5 mr-1" />
                                        {product.price.toLocaleString()}
                                    </span>

                                    {/* View Details Button */}
                                    <button
                                        onClick={() => handleViewDetails(product._id)}
                                        className="btn btn-primary btn-md shadow-lg"
                                    >
                                        <FaEye /> View Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="text-center mt-12">
                    <button className="btn btn-neutral btn-wide shadow-md">
                        Browse All Garments
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ProductsSection;