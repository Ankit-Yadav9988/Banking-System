import React from 'react';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const Services = () => {
  return (
    <div className="container">
      <h2 className="section-title">Our Services</h2>
      <p className="section-text">Explore the services we offer.</p>
    </div>
  );
};

export default Services;