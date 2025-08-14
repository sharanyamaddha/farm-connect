import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('farmerToken');
      const res = await axios.get('http://localhost:5000/api/farmers/transactions', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTransactions(res.data);
    };

    fetchTransactions();
  }, []);

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-green-700 flex items-center gap-2">
        💸 Recent Transactions
      </h2>

      {transactions.length === 0 ? (
        <p className="text-gray-600">No payments received yet.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="min-w-full border text-sm text-left">
            <thead className="bg-green-100 text-green-800 font-semibold">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Qty</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment ID</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, idx) => (
                <tr key={idx} className="border-b hover:bg-green-50">
                  <td className="py-2 px-4">{txn.customerId?.fullName || 'Unknown'}</td>
                  <td className="py-2 px-4">{txn.productName}</td>
                  <td className="py-2 px-4">{txn.quantity}</td>
                  <td className="py-2 px-4">₹{txn.amount}</td>
                  <td className="py-2 px-4 text-sm text-gray-600">{txn.paymentId}</td>
                  <td className="py-2 px-4">
                    {new Date(txn.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'short',
                      timeStyle: 'short'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
