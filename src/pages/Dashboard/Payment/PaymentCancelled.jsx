import React from 'react';
import { Link } from 'react-router';

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="bg-base-200 p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-error">Payment Cancelled</h2>
        <Link to='/dashboard/my-orders'>
          <button className='btn btn-primary mt-4'>Please try again</button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancelled;