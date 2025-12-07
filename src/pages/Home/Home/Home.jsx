import React from 'react';
import Hero from '../Hero/Hero';
import HowItWorks from '../HowItWorks/HowItWorks';
import Feedback from '../Feedback/Feedback';
import Features from '../Features/Features';
import CTABanner from '../CTABanner/CTABanner';
import ProductsSection from '../ProductsSection/ProductsSection';

const Home = () => {
    return (
        <div>
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