import React from 'react';
import logo from '../../assets/favicon.png'
import { Link } from 'react-router';
const Logo = () => {
    return (
        <Link to='/'>
            <div className='flex'>
                <img src={logo} alt="" />
                <div className=' justify-center items-center text-center'>
                    <p className='tracking-[.25em] text-xl text-primary font-bold'>THIRTEEN</p>
                    <p className="**text-black dark:text-white** tracking-[.35em]">CLOTHING</p>

                </div>
            </div>
        </Link>
    );
};

export default Logo;