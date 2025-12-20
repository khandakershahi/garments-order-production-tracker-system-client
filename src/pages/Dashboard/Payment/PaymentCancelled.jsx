import React from 'react';
import { Link } from 'react-router';

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Payment is cancelled..</h2>
        <Link to='/dashboard/my-orders'>
          <button className='mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>Please try again</button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancelled;