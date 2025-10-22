import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './styles.css';

const Login = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [bankName, setBankName] = useState('');
  const [isManager, setIsManager] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const payload = isManager
        ? { name, password, bankName }
        : { email, password };

      // ✅ Hardcoded backend URL
      const res = await axios.post(
        'https://banking-system-jajy.onrender.com/api/auth/login',
        payload
      );

      setMessage(res.data.msg);
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('role', res.data.role);

      // ✅ Redirect after login
      setTimeout(() => {
        if (res.data.role === 'customer')
          window.location.href = '/customer-dashboard';
        else if (res.data.role === 'manager')
          window.location.href = '/admin-dashboard';
        if (onClose) onClose();
      }, 1000);
    } catch (err) {
      console.error('Login Error:', err);
      setMessage(
        err.response?.data?.msg ||
          err.response?.data?.error ||
          'Login failed'
      );
    }
  };

  // ✅ Show logout link if logged in
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>

      {userId && (
        <div className="login-footer">
          <p className="login-footer-text">
            Welcome, {role === 'customer' ? 'Customer' : 'Manager'}!{' '}
            <Link to="/logout" className="login-logout-link">
              Logout
            </Link>
          </p>
        </div>
      )}

      {!userId && (
        <div className="login-form">
          <div className="login-form-group">
            <label className="login-form-label">
              {!isManager ? 'Email (Customer)' : 'Name (Manager)'}
            </label>
            {!isManager ? (
              <input
                type="email"
                className="login-form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={!isManager}
              />
            ) : (
              <input
                type="text"
                className="login-form-input"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isManager}
              />
            )}
          </div>

          <div className="login-form-group">
            <label className="login-form-label">Password</label>
            <input
              type="password"
              className="login-form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-form-group">
            <label className="login-form-label login-flex items-center">
              <input
                type="checkbox"
                className="login-form-checkbox"
                checked={isManager}
                onChange={(e) => setIsManager(e.target.checked)}
              />
              Login as Manager
            </label>
          </div>

          {isManager && (
            <div className="login-form-group">
              <label className="login-form-label">Bank Name</label>
              <input
                type="text"
                className="login-form-input"
                placeholder="e.g., SBI"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required={isManager}
              />
            </div>
          )}

          <button onClick={handleLogin} className="login-form-button">
            Login
          </button>

          {message && <p className="login-form-message">{message}</p>}
        </div>
      )}
    </div>
  );
};

export default Login;
