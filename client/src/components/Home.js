import React from 'react';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const Home = () => {
  return (
    <div className="container">
      <h2 className="section-title">Welcome to Banking App</h2>
      <p className="section-text">Welcome to our Banking System! This platform is designed to provide users with a secure and user-friendly way to manage their financial activities. From creating accounts to performing secure transactions, our system ensures efficiency and reliability. Whether you're checking balances or transferring funds, we make banking easy and accessible. Start your journey toward smarter banking today.

</p>
    </div>
  );
};

export default Home;