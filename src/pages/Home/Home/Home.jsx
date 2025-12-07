import React from 'react';
import Hero from '../Hero/Hero';
import HowItWorks from '../HowItWorks/HowItWorks';
import Feedback from '../Feedback/Feedback';

const Home = () => {
    return (
        <div>
            <Hero></Hero>
            <HowItWorks></HowItWorks>
            <Feedback></Feedback>
        </div>
    );
};

export default Home;