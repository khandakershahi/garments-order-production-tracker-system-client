import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../Hero/Hero';
import Categories from '../Categories/Categories';
import ProductsSection from '../ProductsSection/ProductsSection';
import Features from '../Features/Features';
import HowItWorks from '../HowItWorks/HowItWorks';
import Highlights from '../Highlights/Highlights';
import Statistics from '../Statistics/Statistics';
import Feedback from '../Feedback/Feedback';
import TrustBadges from '../TrustBadges/TrustBadges';
import Newsletter from '../Newsletter/Newsletter';
import CTABanner from '../CTABanner/CTABanner';

const Home = () => {
    return (
        <div>
            <Helmet>
                <title>Home - Garments Order Production Tracker</title>
                <meta name="description" content="Track and manage your garments production orders efficiently" />
            </Helmet>
            <Hero></Hero>
            <Categories></Categories>
            <ProductsSection></ProductsSection>
            <Features></Features>
            <HowItWorks></HowItWorks>
            <Highlights></Highlights>
            <Statistics></Statistics>
            <Feedback></Feedback>
            <TrustBadges></TrustBadges>
            <Newsletter></Newsletter>
            <CTABanner></CTABanner>
        </div>
    );
};

export default Home;