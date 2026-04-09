import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import logoHero from '../../assets/hero.png';
import logoAbout from '../../assets/about.png';
import './Home.css';

const Home = () => {
  return (
    <div className="landing-page">
      <Navbar />
      
      <main className="landing-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              The Next Generation of <span className="text-gradient">Online Examination</span>
            </h1>
            <p className="hero-subtitle">
              Clyvasync provides a seamless experience for automated testing, 
              real-time monitoring, and comprehensive analytical reports.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn-primary">Get Started Free</Link>
              <Link to="/login" className="btn-secondary">View Demo</Link>
            </div>
          </div>
          <div className="hero-image">
            <img 
              src={logoHero} 
              alt="Platform Demo Illustration" 
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-header">
             <h2 className="section-title">Why Choose Clyvasync?</h2>
             <p className="section-description">Experience the future of digital education with our cutting-edge features.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-indicator"></div>
              <h3>Secure Testing</h3>
              <p>Anti-cheat browser monitoring and verified identity checks for secure, reliable exams.</p>
            </div>
            <div className="feature-card">
              <div className="feature-indicator"></div>
              <h3>Real-time Grading</h3>
              <p>Instant feedback and automated grading for quick results and deep statistical analytics.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-alt feature-indicator"></div>
              <h3>Video Proctoring</h3>
              <p>Integrated high-quality video conferencing for live monitoring during critical assessments.</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="about-section">
          <div className="about-grid">
            <div className="about-image">
                <img src={logoAbout} alt="Education Integration Illustration" />
            </div>
            <div className="about-content">
                <h2>Streamline Your Learning Journey</h2>
                <p>
                Our platform adapts to your unique needs, providing a robust environment 
                for both education institutions and individual learners.
                </p>
                <ul className="about-list">
                    <li>Multi-role support (Student, Teacher, Admin)</li>
                    <li>Comprehensive Question Bank Management</li>
                    <li>Secure JWT-based Authentication</li>
                    <li>Mobile-first Responsive Design</li>
                </ul>
                <div className="about-cta">
                    <Link to="/register" className="btn-link">Learn more about our platform →</Link>
                </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
            <p>&copy; 2026 Clyvasync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;