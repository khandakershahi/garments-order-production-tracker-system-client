import React from 'react';
import logo from '../../assets/logo.png'
import { Link } from 'react-router';
const Logo = () => {
    return (
        <Link to='/'>
            <div className='flex items-end'>
                <img src={logo} alt="" />

            </div>
        </Link>
    );
};

export default Logo;