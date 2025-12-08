import React from 'react';
import Logo from '../components/Logo/Logo';
import { Outlet } from 'react-router';
import authImage from '../assets/authImage.jpg';



const AuthLayout = () => {
    return (
        <div className='max-w-7xl mx-auto '>
            <Logo />
            <div className='flex py-20 justify-center items-center'>
                <div className='flex-1 justify-center items-center'>
                    <Outlet />
                </div>
                <div className='flex-1 justify-center items-center'>
                    <img src={authImage} alt="" />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;