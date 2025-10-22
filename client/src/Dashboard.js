import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const userId = localStorage.getItem('userId');
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!userId) {
      window.location.href = '/login';
      return;
    }
    axios.get(`http://localhost:5000/api/auth/customer-dashboard/${userId}`)
      .then(res => setAccounts(res.data.accounts || []))
      .catch(err => setMessage(err.response?.data?.error || 'Error fetching accounts'));

    axios.get(`http://localhost:5000/api/auth/customer-transactions/${userId}`)
      .then(res => setTransactions(res.data.transactions || []))
      .catch(err => setMessage(err.response?.data?.error || 'Error fetching transactions'));
  }, [userId]);

  return (
    <div>
      <h2>Customer Dashboard</h2>
      {message && <p>{message}</p>}
      <h3>Accounts</h3>
      {accounts.length === 0 ? (
        <p>No accounts found.</p>
      ) : (
        <ul>
          {accounts.map(account => (
            <li key={account._id}>
              {account.accountHolderName} - {account.bankId.name} - Balance: ₹{account.balance || 0} - Status: {account.status}
            </li>
          ))}
        </ul>
      )}
      <h3>Transaction History</h3>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <ul>
          {transactions.map(transaction => (
            <li key={transaction._id}>
              {transaction.type} of ₹{transaction.amount} on {new Date(transaction.createdAt).toLocaleDateString()} - Bank: {transaction.accountId.bankId.name}
            </li>
          ))}
        </ul>
      )}
      <p>Welcome, Customer! <Link to="/logout">Logout</Link></p>
    </div>
  );
};

export default CustomerDashboard;