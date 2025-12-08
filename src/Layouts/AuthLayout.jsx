import React from 'react';
import Logo from '../components/Logo/Logo';
import { Outlet } from 'react-router';
import authImage from '../assets/authImage.png';



const AuthLayout = () => {
    return (
        <div className='container mx-auto  '>
            <div className=' py-4'>  <Logo /></div>
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