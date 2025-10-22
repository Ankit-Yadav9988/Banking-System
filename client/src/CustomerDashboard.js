import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from './apiConfig';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');
  const [deposit, setDeposit] = useState({ accountId: '', amount: '' });
  const [withdrawal, setWithdrawal] = useState({ accountId: '', amount: '' });
  const [transfer, setTransfer] = useState({ fromAccountId: '', toAccountNumber: '', amount: '' });

  // Filter and sort states
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactionSortOrder, setTransactionSortOrder] = useState('asc');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    axios.get(`${API_URL}/api/auth/customer-dashboard/${userId}`)
      .then(res => setAccounts(res.data.accounts || []))
      .catch(err => setMessage(err.response?.data?.error || 'Error fetching accounts'));

    axios.get(`${API_URL}/api/auth/customer-transactions/${userId}`)
      .then(res => setTransactions(res.data.transactions || []))
      .catch(err => setMessage(err.response?.data?.error || 'Error fetching transactions'));
  }, [userId, navigate]);

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/transaction`, {
        accountId: deposit.accountId,
        type: 'deposit',
        amount: parseFloat(deposit.amount),
      });
      setMessage(res.data.msg);
      setDeposit({ accountId: '', amount: '' });
      axios.get(`${API_URL}/api/auth/customer-transactions/${userId}`)
        .then(res => setTransactions(res.data.transactions || []));
      axios.get(`${API_URL}/api/auth/customer-dashboard/${userId}`)
        .then(res => setAccounts(res.data.accounts || []));
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error submitting deposit');
    }
  };

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/transaction`, {
        accountId: withdrawal.accountId,
        type: 'withdrawal',
        amount: parseFloat(withdrawal.amount),
      });
      setMessage(res.data.msg);
      setWithdrawal({ accountId: '', amount: '' });
      axios.get(`${API_URL}/api/auth/customer-transactions/${userId}`)
        .then(res => setTransactions(res.data.transactions || []));
      axios.get(`${API_URL}/api/auth/customer-dashboard/${userId}`)
        .then(res => setAccounts(res.data.accounts || []));
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error submitting withdrawal');
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/transfer`, {
        fromAccountId: transfer.fromAccountId,
        toAccountNumber: transfer.toAccountNumber,
        amount: parseFloat(transfer.amount),
      });
      setMessage(res.data.msg);
      setTransfer({ fromAccountId: '', toAccountNumber: '', amount: '' });
      axios.get(`${API_URL}/api/auth/customer-transactions/${userId}`)
        .then(res => setTransactions(res.data.transactions || []));
      axios.get(`${API_URL}/api/auth/customer-dashboard/${userId}`)
        .then(res => setAccounts(res.data.accounts || []));
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error submitting transfer');
    }
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(tx => {
      const typeMatch = transactionTypeFilter === 'all' ||
        (transactionTypeFilter === 'deposit' && tx.type === 'deposit' && !tx.transferId) ||
        (transactionTypeFilter === 'withdrawal' && tx.type === 'withdrawal' && !tx.transferId) ||
        (transactionTypeFilter === 'transfer-received' && tx.type === 'deposit' && tx.transferId) ||
        (transactionTypeFilter === 'transfer-sent' && tx.type === 'withdrawal' && tx.transferId);
      const dateMatch = 
        (!startDate || new Date(tx.createdAt) >= new Date(startDate)) &&
        (!endDate || new Date(tx.createdAt) <= new Date(endDate));
      return typeMatch && dateMatch;
    })
    .sort((a, b) => {
      if (transactionSortOrder === 'asc') {
        return a.amount - b.amount;
      }
      return b.amount - a.amount;
    });

  const openModal = (transaction) => {
    setModalContent({ type: 'transaction', data: transaction });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Customer Dashboard</h2>
      {message && <p className="dashboard-message">{message}</p>}

      {/* Accounts Section */}
      <section className="dashboard-section">
        <h3 className="dashboard-section-title">Your Accounts</h3>
        {accounts.length === 0 ? (
          <p className="dashboard-empty">No accounts found.</p>
        ) : (
          <ul className="dashboard-list">
            {accounts.map(account => (
              <li key={account._id} className="dashboard-card">
                <span className="dashboard-card-icon">🏦</span>
                <div className="dashboard-card-content">
                  <h4 className="dashboard-card-title">{account.accountHolderName}</h4>
                  <p className="dashboard-card-text">
                    Bank: {account.bankId.name}<br />
                    Account No: {account.accountNumber || 'Not assigned'}<br />
                    Balance: ₹{account.balance || 0}<br />
                    Status: {account.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Transactions Section */}
      <section className="dashboard-section">
        <h3 className="dashboard-section-title">Transaction History</h3>
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <label>
            Filter by Type:
            <select
              value={transactionTypeFilter}
              onChange={e => setTransactionTypeFilter(e.target.value)}
              style={{ marginLeft: '0.5rem' }}
            >
              <option value="all">All</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="transfer-received">Transfer (Received)</option>
              <option value="transfer-sent">Transfer (Sent)</option>
            </select>
          </label>
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              style={{ marginLeft: '0.5rem' }}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              style={{ marginLeft: '0.5rem' }}
            />
          </label>
          <label>
            Sort by Amount:
            <select
              value={transactionSortOrder}
              onChange={e => setTransactionSortOrder(e.target.value)}
              style={{ marginLeft: '0.5rem' }}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>
        {filteredTransactions.length === 0 ? (
          <p className="dashboard-empty">No transactions found.</p>
        ) : (
          <ul className="dashboard-list">
            {filteredTransactions.map(transaction => (
              <li key={transaction._id} className="dashboard-card">
                <span className="dashboard-card-icon">
                  {transaction.transferId ? (transaction.type === 'deposit' ? '📥' : '📤') : transaction.type === 'deposit' ? '💵' : '💸'}
                </span>
                <div className="dashboard-card-content">
                  <h4 className="dashboard-card-title">
                    {transaction.transferId ? 
                      (transaction.type === 'deposit' ? 'Transfer (Received)' : 'Transfer (Sent)') 
                      : transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </h4>
                  <p className="dashboard-card-text">
                    Amount: ₹{transaction.amount}<br />
                    Date: {transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : 'Date not available'}<br />
                    Bank: {transaction.accountId.bankId.name}
                  </p>
                  <div className="dashboard-card-actions">
                    <button
                      onClick={() => openModal(transaction)}
                      className="action-button"
                      style={{ backgroundColor: '#4B5EAA', color: 'white' }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Modal for Viewing Transaction Details */}
      {modalOpen && modalContent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Transaction Details</h3>
              <button onClick={closeModal} className="modal-close-button">
                ×
              </button>
            </div>
            <div className="modal-body">
              <p><strong>Type:</strong> {modalContent.data.transferId ? 
                (modalContent.data.type === 'deposit' ? 'Transfer (Received)' : 'Transfer (Sent)') 
                : modalContent.data.type.charAt(0).toUpperCase() + modalContent.data.type.slice(1)}</p>
              <p><strong>Amount:</strong> ₹{modalContent.data.amount}</p>
              <p><strong>Account:</strong> {modalContent.data.accountId.accountHolderName}</p>
              <p><strong>Bank:</strong> {modalContent.data.accountId.bankId.name}</p>
              <p><strong>Status:</strong> Approved</p>
              <p><strong>Date:</strong> {modalContent.data.createdAt ? new Date(modalContent.data.createdAt).toLocaleString() : 'Date not available'}</p>
              {modalContent.data.transferId && <p><strong>Transfer ID:</strong> {modalContent.data.transferId}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Deposit Form */}
      <section className="dashboard-section">
        <h3 className="dashboard-section-title">Deposit Money</h3>
        <div className="dashboard-form">
          <div className="form-group">
            <label className="form-label">Select Account</label>
            <select
              className="form-input"
              value={deposit.accountId}
              onChange={(e) => setDeposit({ ...deposit, accountId: e.target.value })}
              required
            >
              <option value="">Select Account</option>
              {accounts.map(account => (
                <option key={account._id} value={account._id}>
                  {account.bankId.name} - {account.accountHolderName} (Acc No: {account.accountNumber})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Amount</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter amount"
              value={deposit.amount}
              onChange={(e) => setDeposit({ ...deposit, amount: e.target.value })}
              min="0"
              step="0.01"
              required
            />
          </div>
          <button onClick={handleDeposit} className="form-button">Submit Deposit Request</button>
        </div>
      </section>

      {/* Withdrawal Form */}
      <section className="dashboard-section">
        <h3 className="dashboard-section-title">Withdraw Money</h3>
        <div className="dashboard-form">
          <div className="form-group">
            <label className="form-label">Select Account</label>
            <select
              className="form-input"
              value={withdrawal.accountId}
              onChange={(e) => setWithdrawal({ ...withdrawal, accountId: e.target.value })}
              required
            >
              <option value="">Select Account</option>
              {accounts.map(account => (
                <option key={account._id} value={account._id}>
                  {account.bankId.name} - {account.accountHolderName} (Acc No: {account.accountNumber})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Amount</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter amount"
              value={withdrawal.amount}
              onChange={(e) => setWithdrawal({ ...withdrawal, amount: e.target.value })}
              min="0"
              step="0.01"
              required
            />
          </div>
          <button onClick={handleWithdrawal} className="form-button">Submit Withdrawal Request</button>
        </div>
      </section>

      {/* Transfer Form */}
      <section className="dashboard-section">
        <h3 className="dashboard-section-title">Transfer Money</h3>
        <div className="dashboard-form">
          <div className="form-group">
            <label className="form-label">Source Account</label>
            <select
              className="form-input"
              value={transfer.fromAccountId}
              onChange={(e) => setTransfer({ ...transfer, fromAccountId: e.target.value })}
              required
            >
              <option value="">Select Source Account</option>
              {accounts.map(account => (
                <option key={account._id} value={account._id}>
                  {account.bankId.name} - {account.accountHolderName} (Acc No: {account.accountNumber})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Destination Account Number</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter 12-digit account number"
              value={transfer.toAccountNumber}
              onChange={(e) => setTransfer({ ...transfer, toAccountNumber: e.target.value })}
              pattern="\d{12}"
              title="Please enter a 12-digit account number"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Amount</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter amount"
              value={transfer.amount}
              onChange={(e) => setTransfer({ ...transfer, amount: e.target.value })}
              min="0"
              step="0.01"
              required
            />
          </div>
          <button onClick={handleTransfer} className="form-button">Submit Transfer Request</button>
        </div>
      </section>

      {/* Logout Link */}
      <div className="dashboard-footer">
        <p className="dashboard-footer-text">
          Welcome, Customer! <Link to="/logout" className="dashboard-logout-link">Logout</Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerDashboard;