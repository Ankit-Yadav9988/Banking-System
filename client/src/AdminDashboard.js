import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from './apiConfig';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const managerId = localStorage.getItem('userId');
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [message, setMessage] = useState('');

  // Filter and sort states
  const [accountStatusFilter, setAccountStatusFilter] = useState('all');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all');
  const [transactionStatusFilter, setTransactionStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [accountSortOrder, setAccountSortOrder] = useState('asc');
  const [transactionSortOrder, setTransactionSortOrder] = useState('asc');

  // Selected account for transactions
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    if (!managerId) {
      navigate('/login');
      return;
    }
    axios
      .get(`${API_URL}/api/auth/admin-dashboard/${managerId}`)
      .then(res => {
        console.log('Fetched Data:', res.data);
        setPendingAccounts(res.data.pendingAccounts || []);
        setPendingTransactions(res.data.pendingTransactions || []);
        setAllAccounts(res.data.allAccounts || []);
        setAllTransactions(res.data.allTransactions || []);
      })
      .catch(err => {
        console.error('Fetch Error:', err);
        setMessage(err.response?.data?.msg || 'Error fetching data');
      });
  }, [managerId, navigate]);

  const handleAccountAction = async (accountId, status) => {
    console.log('handleAccountAction called with:', { accountId, status, managerId });
    try {
      const res = await axios.post(`${API_URL}/api/auth/admin/approve-account`, {
        accountId,
        status,
        managerId,
      });
      console.log('Account Action Response:', res.data);
      setMessage(res.data.msg);
      setPendingAccounts(prevAccounts => {
        const updatedAccounts = prevAccounts.filter(a => a._id !== accountId);
        console.log('Updated Pending Accounts:', updatedAccounts);
        return updatedAccounts;
      });
      const updatedAllAccounts = await axios.get(`${API_URL}/api/auth/admin-dashboard/${managerId}`);
      setAllAccounts(updatedAllAccounts.data.allAccounts || []);
    } catch (err) {
      console.error('Account Action Error:', err);
      setMessage(err.response?.data?.msg || 'Error approving/rejecting account');
    }
  };

  const handleTransactionAction = async (transactionId, status) => {
    console.log('handleTransactionAction called with:', { transactionId, status, managerId });
    try {
      const res = await axios.post(`${API_URL}/api/auth/admin/approve-transaction`, {
        transactionId,
        status,
        managerId,
      });
      console.log('Transaction Action Response:', res.data);
      setMessage(res.data.msg);
      setPendingTransactions(prevTransactions => {
        const updatedTransactions = prevTransactions.filter(t => t._id !== transactionId);
        console.log('Updated Pending Transactions:', updatedTransactions);
        return updatedTransactions;
      });
      const updatedAllTransactions = await axios.get(`${API_URL}/api/auth/admin-dashboard/${managerId}`);
      setAllTransactions(updatedAllTransactions.data.allTransactions || []);
    } catch (err) {
      console.error('Transaction Action Error:', err);
      setMessage(err.response?.data?.msg || 'Error approving/rejecting transaction');
    }
  };

  // Filter and sort accounts
  const filteredAccounts = allAccounts
    .filter(account => accountStatusFilter === 'all' || account.status === accountStatusFilter)
    .sort((a, b) => {
      if (accountSortOrder === 'asc') {
        return a.status.localeCompare(b.status);
      }
      return b.status.localeCompare(a.status);
    });

  // Filter and sort transactions
  const filteredTransactions = allTransactions
    .filter(tx => {
      if (!selectedAccountId) return false;
      return (
        tx.accountId._id === selectedAccountId &&
        (transactionTypeFilter === 'all' || tx.type === transactionTypeFilter) &&
        (transactionStatusFilter === 'all' || tx.status === transactionStatusFilter) &&
        (!startDate || new Date(tx.createdAt) >= new Date(startDate)) &&
        (!endDate || new Date(tx.createdAt) <= new Date(endDate))
      );
    })
    .sort((a, b) => {
      if (transactionSortOrder === 'asc') {
        return a.amount - b.amount;
      }
      return b.amount - a.amount;
    });

  const openModal = (type, data) => {
    setModalContent({ type, data });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>
      {message && <p className="dashboard-message">{message}</p>}

      {/* Pending Accounts Section */}
      <section className="dashboard-section">
        <h3 className="dashboard-section-title">Pending Account Requests</h3>
        {pendingAccounts.length === 0 ? (
          <p className="dashboard-empty">No pending account requests.</p>
        ) : (
          <ul className="dashboard-list">
            {pendingAccounts.map(account => (
              <li key={account._id} className="dashboard-card">
                <span className="dashboard-card-icon">📋</span>
                <div className="dashboard-card-content">
                  <h4 className="dashboard-card-title">{account.accountHolderName}</h4>
                  <p className="dashboard-card-text">
                    User: {account.userId.name} ({account.userId.email})
                  </p>
                  <div className="dashboard-card-actions">
                    <button
                      onClick={() => handleAccountAction(account._id, 'approved')}
                      className="action-button action-button--approve"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAccountAction(account._id, 'rejected')}
                      className="action-button action-button--decline"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Pending Transactions Section */}
      <section className="dashboard-section">
        <h3 className="dashboard-section-title">Pending Transactions</h3>
        {pendingTransactions.length === 0 ? (
          <p className="dashboard-empty">No pending transactions.</p>
        ) : (
          <ul className="dashboard-list">
            {pendingTransactions.map(tx => (
              <li key={tx._id} className="dashboard-card">
                <span className="dashboard-card-icon">
                  {tx.transferId ? '🔄' : tx.type === 'deposit' ? '💵' : '💸'}
                </span>
                <div className="dashboard-card-content">
                  <h4 className="dashboard-card-title">
                    {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} {tx.transferId ? '(Transfer)' : ''}
                  </h4>
                  <p className="dashboard-card-text">
                    Amount: ${tx.amount}<br />
                    User: {tx.accountId.userId.name}<br />
                    Account: {tx.accountId.accountHolderName}
                  </p>
                  <div className="dashboard-card-actions">
                    <button
                      onClick={() => handleTransactionAction(tx._id, 'approved')}
                      className="action-button action-button--approve"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleTransactionAction(tx._id, 'rejected')}
                      className="action-button action-button--decline"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* All Accounts Section */}
      <section className="dashboard-section">
        <h3 className="dashboard-section-title">All Accounts</h3>
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label>
            Filter by Status:
            <select
              value={accountStatusFilter}
              onChange={e => setAccountStatusFilter(e.target.value)}
              style={{ marginLeft: '0.5rem' }}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <label>
            Sort by Status:
            <select
              value={accountSortOrder}
              onChange={e => setAccountSortOrder(e.target.value)}
              style={{ marginLeft: '0.5rem' }}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>
        {filteredAccounts.length === 0 ? (
          <p className="dashboard-empty">No accounts found.</p>
        ) : (
          <ul className="dashboard-list">
            {filteredAccounts.map(account => (
              <li key={account._id} className="dashboard-card">
                <span className="dashboard-card-icon">🏦</span>
                <div className="dashboard-card-content">
                  <h4 className="dashboard-card-title">{account.accountHolderName}</h4>
                  <p className="dashboard-card-text">
                    User: {account.userId.name} ({account.userId.email})<br />
                    Status: {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                  </p>
                  <div className="dashboard-card-actions">
                    <button
                      onClick={() => openModal('account', account)}
                      className="action-button"
                      style={{ backgroundColor: '#4B5EAA', color: 'white' }}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setSelectedAccountId(account._id)}
                      className="action-button"
                      style={{ backgroundColor: '#2C7A7B', color: 'white' }}
                    >
                      View Transactions
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* All Transactions Section */}
      <section className="dashboard-section">
        <h3 className="dashboard-section-title">Transactions for Selected Account</h3>
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
            </select>
          </label>
          <label>
            Filter by Status:
            <select
              value={transactionStatusFilter}
              onChange={e => setTransactionStatusFilter(e.target.value)}
              style={{ marginLeft: '0.5rem' }}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
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
        {!selectedAccountId ? (
          <p className="dashboard-empty">Select an account to view its transactions.</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="dashboard-empty">No transactions found for this account.</p>
        ) : (
          <ul className="dashboard-list">
            {filteredTransactions.map(tx => (
              <li key={tx._id} className="dashboard-card">
                <span className="dashboard-card-icon">
                  {tx.transferId ? '🔄' : tx.type === 'deposit' ? '💵' : '💸'}
                </span>
                <div className="dashboard-card-content">
                  <h4 className="dashboard-card-title">
                    {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} {tx.transferId ? '(Transfer)' : ''}
                  </h4>
                  <p className="dashboard-card-text">
                    Amount: ₹{tx.amount}<br />
                    User: {tx.accountId.userId.name}<br />
                    Account: {tx.accountId.accountHolderName}<br />
                    Status: {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </p>
                  <div className="dashboard-card-actions">
                    <button
                      onClick={() => openModal('transaction', tx)}
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

      {/* Modal for Viewing Details */}
      {modalOpen && modalContent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {modalContent.type === 'account' ? 'Account Details' : 'Transaction Details'}
              </h3>
              <button onClick={closeModal} className="modal-close-button">
                ×
              </button>
            </div>
            <div className="modal-body">
              {modalContent.type === 'account' ? (
                <div>
                  <p><strong>Account Holder:</strong> {modalContent.data.accountHolderName}</p>
                  <p><strong>User:</strong> {modalContent.data.userId.name} ({modalContent.data.userId.email})</p>
                  <p><strong>Status:</strong> {modalContent.data.status.charAt(0).toUpperCase() + modalContent.data.status.slice(1)}</p>
                  <p><strong>Account Number:</strong> {modalContent.data.accountNumber || 'N/A'}</p>
                  <p><strong>Balance:</strong> ₹{modalContent.data.balance || 0}</p>
                </div>
              ) : (
                <div>
                  <p><strong>Type:</strong> {modalContent.data.type.charAt(0).toUpperCase() + modalContent.data.type.slice(1)} {modalContent.data.transferId ? '(Transfer)' : ''}</p>
                  <p><strong>Amount:</strong> ₹{modalContent.data.amount}</p>
                  <p><strong>Account:</strong> {modalContent.data.accountId.accountHolderName}</p>
                  <p><strong>User:</strong> {modalContent.data.accountId.userId.name}</p>
                  <p><strong>Status:</strong> {modalContent.data.status.charAt(0).toUpperCase() + modalContent.data.status.slice(1)}</p>
                  <p><strong>Date:</strong> {modalContent.data.createdAt ? new Date(modalContent.data.createdAt).toLocaleString() : 'Date not available'}</p>
                  {modalContent.data.transferId && <p><strong>Transfer ID:</strong> {modalContent.data.transferId}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logout Link */}
      <div className="dashboard-footer">
        <p className="dashboard-footer-text">
          Welcome, Manager! <Link to="/logout" className="dashboard-logout-link">Logout</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;