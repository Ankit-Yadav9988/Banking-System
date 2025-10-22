import React, { useState, useEffect } from 'react';
import axios from 'axios';
const OpenAccount = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [bankId, setBankId] = useState('');
  const [banks, setBanks] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch available banks
    axios.get('http://localhost:5000/api/auth/banks')
      .then(res => setBanks(res.data))
      .catch(err => console.error('Fetch Banks Error:', err));
  }, []);

  const handleSignupAndOpenAccount = async (e) => {
    e.preventDefault();
    try {
      // Signup
      const signupRes = await axios.post('http://localhost:5000/api/auth/signup', { name, email, phone, password });
      const userId = signupRes.data.userId;

      // Open account
      const accountRes = await axios.post('http://localhost:5000/api/auth/open-account', {
        userId,
        bankId,
        accountHolderName: name,
      });
      setMessage(accountRes.data.msg);
    } catch (err) {
      console.error('Error:', err);
      setMessage(err.response?.data?.msg || 'Error occurred');
    }
  };

  return (
    <div>
      <h2>Open Bank Account</h2>
      <form onSubmit={handleSignupAndOpenAccount}>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <select value={bankId} onChange={(e) => setBankId(e.target.value)} required>
          <option value="">Select Bank</option>
          {banks.map(bank => (
            <option key={bank._id} value={bank._id}>{bank.name}</option>
          ))}
        </select>
        <button type="submit">Submit</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default OpenAccount;