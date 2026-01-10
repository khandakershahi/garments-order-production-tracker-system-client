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
          setPaymentInfo({
            transactionId: res.data.transactionId,
            orderId: res.data.orderId,
          });
        });
    }
  }, [sessionId, axiosSecure]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="bg-base-200 p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-success">Payment Successful</h2>
        <p className="text-base-content mb-2">Your transactionId: {paymentInfo?.transactionId}</p>
        <p className="text-base-content mb-4">Your Order ID: {paymentInfo?.orderId}</p>
        <button
          onClick={() => window.location.href = '/dashboard/my-orders'}
          className="btn btn-primary mt-4"
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;