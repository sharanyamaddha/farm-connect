import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaWallet,
  FaCreditCard,
  FaUniversity,
  FaMoneyBillWave,
} from 'react-icons/fa';

function PaymentOptions() {
  const navigate = useNavigate();

  const handlePaymentSelect = (type) => {
    navigate('/pay', { state: { paymentType: type } });
  };

  const paymentMethods = [
    {
      type: 'upi',
      title: 'UPI (Google Pay, PhonePe, etc.)',
      description: 'Pay directly using your UPI app in seconds.',
      icon: <FaWallet size={30} className="text-indigo-600" />,
      bg: 'bg-indigo-50',
    },
    {
      type: 'card',
      title: 'Credit / Debit Card',
      description: 'Secure payments with Visa, MasterCard, and more.',
      icon: <FaCreditCard size={30} className="text-blue-600" />,
      bg: 'bg-blue-50',
    },
    {
      type: 'netbanking',
      title: 'Net Banking',
      description: 'Pay using your bank’s online portal.',
      icon: <FaUniversity size={30} className="text-yellow-600" />,
      bg: 'bg-yellow-50',
    },
    {
      type: 'cod',
      title: 'Cash on Delivery',
      description: 'Pay by cash when the item is delivered to your doorstep.',
      icon: <FaMoneyBillWave size={30} className="text-green-600" />,
      bg: 'bg-green-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-black-400 mb-8 text-center">
          Choose Payment Method
        </h1>

        <div className="space-y-6">
          {paymentMethods.map((method) => (
            <div
              key={method.type}
              onClick={() => handlePaymentSelect(method.type)}
              className={`
                ${method.bg} cursor-pointer rounded-xl p-5 flex items-center gap-4
                transition-transform transform hover:scale-[1.02] hover:shadow-2xl
              `}
            >
              <div className="p-2 bg-white rounded-full shadow-sm">{method.icon}</div>
              <div>
                <h3 className="text-lg font-semibold">{method.title}</h3>
                <p className="text-gray-600 text-sm">{method.description}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-gray-400">
          Payments processed securely via Razorpay | PCI DSS Compliant
        </p>
      </div>
    </div>
  );
}

export default PaymentOptions;