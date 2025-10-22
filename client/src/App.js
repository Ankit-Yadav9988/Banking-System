import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import OpenAccount from './components/OpenAccount';
import Login from './Login';
import CustomerDashboard from './CustomerDashboard';
import AdminDashboard from './AdminDashboard';
import Logout from './Logout';
import './styles.css';

// Modal Component
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button onClick={onClose} className="modal-close-button">✕</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const userId = localStorage.getItem('userId');
  const [isOpenAccountOpen, setIsOpenAccountOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const location = useLocation();

  // Handle smooth scrolling to sections
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const navbarHeight = document.querySelector('.navbar').offsetHeight;
      const sectionPosition = section.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: sectionPosition - navbarHeight - 20, // Added buffer of 20px
        behavior: 'smooth'
      });
    }
  };

  // Handle navigation and scrolling based on current route
  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      // If not on homepage, navigate to homepage with the section as state
      window.history.pushState({ sectionId }, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    // Scroll to the section (will work if already on homepage or after navigation)
    scrollToSection(sectionId);
  };

  // Listen for route changes and scroll if a sectionId is in state
  useEffect(() => {
    const handlePopState = () => {
      const state = window.history.state || {};
      if (state.sectionId) {
        scrollToSection(state.sectionId);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
          <h1 className="navbar-title">Banking System</h1>
          <ul className="navbar-links">
            <li>
              <Link to="/" className="navbar-link">
                Home
              </Link>
            </li>
            <li>
              <a
                href="#about"
                onClick={(e) => handleNavClick(e, 'about')}
                className="navbar-link"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="#gallery"
                onClick={(e) => handleNavClick(e, 'gallery')}
                className="navbar-link"
              >
                Gallery
              </a>
            </li>
            <li>
              <a
                href="#services"
                onClick={(e) => handleNavClick(e, 'services')}
                className="navbar-link"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                className="navbar-link"
              >
                Contact Us
              </a>
            </li>
            {!userId && (
              <>
                <li>
                  <Link
                    onClick={() => setIsOpenAccountOpen(true)}
                    className="navbar-link cursor-pointer"
                  >
                    Open Account
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => setIsLoginOpen(true)}
                    className="navbar-link cursor-pointer"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="navbar-link">
                    Signup
                  </Link>
                </li>
              </>
            )}
            {userId && (
              <li>
                <Link to="/logout" className="navbar-link">
                  Logout
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <Routes>
        <Route
          path="/"
          element={
            <div className="container">
              {/* Home Section */}
              <section id="home" className="section home-section">
              <h2 className="section-title">Welcome to Our Banking System</h2>
    <p className="section-text" style={{ textAlign: 'justify' }}>
      Welcome to our Banking System! This platform is designed to provide users with a secure and user-friendly way to manage their financial activities.<br />
      From creating accounts to performing transactions, our system ensures efficiency and reliability.
      Whether you're checking balances or transferring funds, <br />
      we make banking easy and accessible. Start your journey toward smarter banking today.
    </p>
              </section>

              {/* About Us Section */}
              <section id="about" className="section about-section">
                <h2 className="section-title">About Us</h2>
                <p className="section-text">
                  We are a trusted banking institution committed to providing top-notch financial services since 2000. Our mission is to empower our customers with seamless banking .<br></br>
                  Our Banking System project is built with the goal of simulating real-world banking operations in a secure digital environment. Developed using modern technologies, the system offers core features like account management, transaction processing, and balance tracking. We aim to deliver a reliable and educational tool for users and developers alike. Our focus is on simplicity, security, and scalability.
                </p>
              </section>

              {/* Image Slider */}
              <section id="gallery" className="image-slider">
                <h2 className="section-title">Our Gallery</h2>
                <div className="slider">
                  <div className="slider-content">
                    <img src="https://images.pexels.com/photos/6667892/pexels-photo-6667892.jpeg?auto=compress&cs=tinysrgb&h=226.525&fit=crop&w=253.17499999999998&dpr=2" alt="Bank branch exterior" />
                    <img src="https://images.pexels.com/photos/5699385/pexels-photo-5699385.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Customer service desk" />
                    <img src="https://images.pexels.com/photos/50987/money-card-business-credit-card-50987.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Online banking interface" />
                    <img src="https://media.istockphoto.com/id/1224196635/photo/businessman-holding-laptop-in-front-of-stock-market-data-background.jpg?b=1&s=612x612&w=0&k=20&c=l2D5kYU8NKnMpzF730s8vUNJZbQ0fMrpq1Er9sY2c9U=" alt="Bank vault" />
                  </div>
                </div>
              </section>

              {/* Services Section */}
              <section id="services" className="section">
                <h2 className="section-title">Our Services</h2>
                <div className="services-grid">
                  <div className="service-card">
                    <span className="service-icon">💳</span>
                    <h3 className="service-title">Account Opening</h3>
                    <p className="service-text">Easily open and manage your accounts with us.</p>
                  </div>
                  <div className="service-card">
                    <span className="service-icon">💰</span>
                    <h3 className="service-title">Deposits & Withdrawals</h3>
                    <p className="service-text">Securely deposit and withdraw money anytime.</p>
                  </div>
                  <div className="service-card">
                    <span className="service-icon">🔄</span>
                    <h3 className="service-title">Money Transfers</h3>
                    <p className="service-text">Transfer funds quickly and safely.</p>
                  </div>
                  <div className="service-card">
                    <span className="service-icon">📜</span>
                    <h3 className="service-title">Transaction History</h3>
                    <p className="service-text">Access your transaction history 24/7.</p>
                  </div>
                </div>
              </section>

              {/* Contact Us Section */}
              <section id="contact" className="contact-section section">
                <h2 className="section-title">Contact Us</h2>
                <p className="section-text">Email: 325ankityadav@gmail.com | Phone: +91 9956651188</p>
                <p className="section-text">Address:Noida Sector-62, IT-Hub UP, UP-223138</p>
              </section>

              {/* Footer */}
              <footer className="footer">
                <div className="footer-content">
                  <p>© 2025 Banking System. All rights reserved.</p>
                  <div className="social-links">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">Facebook</a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">Twitter</a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">Instagram</a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
                  </div>
                </div>
              </footer>
            </div>
          }
        />
        <Route path="/open-account" element={<OpenAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/signup" element={<OpenAccount />} />
      </Routes>

      {/* Modals */}
      <Modal isOpen={isOpenAccountOpen} onClose={() => setIsOpenAccountOpen(false)}>
        <OpenAccount onClose={() => setIsOpenAccountOpen(false)} />
      </Modal>
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <Login onClose={() => setIsLoginOpen(false)} />
      </Modal>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}