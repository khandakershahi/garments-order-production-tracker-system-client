import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router';
import { useLocation } from 'react-router';

const PrivateRoute = ({ children }) => {

    const { user, loading } = useAuth();

    const location = useLocation();
    // console.log('location',location);


    if (loading) {
        return <div className='max-w-7xl mx-auto'>
            <span className="loading loading-infinity loading-xl"></span>
        </div>
    }

    if (!user) {
        return <Navigate state={location.pathname} to='/login'></Navigate>
    }



    return children;
};

export default PrivateRoute;