import React from 'react';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const Contact = () => {
  return (
    <div className="container">
      <h2 className="section-title">Contact Us</h2>
      <p className="section-text">Get in touch with us.</p>
    </div>
  );
};

export default Contact;