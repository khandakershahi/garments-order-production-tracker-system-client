import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../Hero/Hero';
import HowItWorks from '../HowItWorks/HowItWorks';
import Feedback from '../Feedback/Feedback';
import Features from '../Features/Features';
import CTABanner from '../CTABanner/CTABanner';
import ProductsSection from '../ProductsSection/ProductsSection';

const Home = () => {
    return (
        <div>
            <Helmet>
                <title>Home - Garments Order Production Tracker</title>
                <meta name="description" content="Track and manage your garments production orders efficiently" />
            </Helmet>
            <Hero></Hero>
            <ProductsSection></ProductsSection>
            <HowItWorks></HowItWorks>
            <Feedback></Feedback>
            <Features></Features>
            <CTABanner></CTABanner>
        </div>
    );
};

export default Home;