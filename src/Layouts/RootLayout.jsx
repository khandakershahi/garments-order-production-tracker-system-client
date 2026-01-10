import React from 'react';
import Navbar from '../components/Shared/Navbar/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/Shared/Footer/Footer';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';

const RootLayout = () => {
  return (
    <div className=''>
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
      <ScrollToTop />
    </div>
  );
};

export default RootLayout;