import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState({});

  const sessionId = searchParams.get("session_id");

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (sessionId) {
      axiosSecure
        .patch(`/payment-success?session_id=${sessionId}`)
        .then((res) => {
          console.log(res.data);
          setPaymentInfo({
            transactionId: res.data.transactionId,
            orderId: res.data.orderId,
          });
        });
    }
  }, [sessionId, axiosSecure]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-4xl text-green-600 mb-4">Payment Successful</h2>
        <p>Your transactionId: {paymentInfo?.transactionId}</p>
        <p>Your Order ID: {paymentInfo?.orderId}</p>
        <button
          onClick={() => window.location.href = '/dashboard/my-orders'}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;