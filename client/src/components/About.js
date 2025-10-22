import React from 'react';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const About = () => {
  return (
    <div className="container">
      <h2 className="section-title">About Us</h2>
      <p className="section-text">Learn more about our banking services.</p>
    </div>
  );
};

export default About;