import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', { email, phone, password });
      setUserId(res.data.userId);
      setMessage(res.data.msg);
    } catch (err) {
      console.error('Signup Error:', err);
      const errorMsg = err.response?.data?.msg || err.response?.data?.error || err.message || 'Unknown error';
      setMessage(errorMsg); // Remove "Error: " prefix for cleaner display
    }
  };
  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { userId, otp });
      setMessage(res.data.msg);
    } catch (err) {
      setMessage(err.response.data.msg || 'Error occurred');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {message && <p>{message}</p>}
      {!userId ? (
        <form onSubmit={handleSignup}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          <button type="submit">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={handleVerify}>
          <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" required />
          <button type="submit">Verify OTP</button>
        </form>
      )}
    </div>
  );
}

export default Signup;