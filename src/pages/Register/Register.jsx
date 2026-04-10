import { authApi } from '../../api';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'STUDENT',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      setIsLoading(true);

      await authApi.register({
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      setSuccessMsg('Registration successful! Please check your email to verify your account.');

      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'An error occurred during registration. Please try again!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Banner */}
      <div className="register-banner">
        <div className="register-banner-grid" />
        <div className="reg-banner-content">
          <h1>Join Our<br /><span>Community</span></h1>
          <p>Create an account today to experience a brand‑new online learning and testing platform.</p>
          <img
            src="https://illustrations.popsy.co/green/surreal-hourglass.svg"
            alt="Register Illustration"
            className="reg-banner-image"
          />
          <div className="reg-banner-stats">
            <div className="reg-stat">
              <span className="reg-stat-number">10K+</span>
              <span className="reg-stat-label">Students</span>
            </div>
            <div className="reg-stat">
              <span className="reg-stat-number">500+</span>
              <span className="reg-stat-label">Exams</span>
            </div>
            <div className="reg-stat">
              <span className="reg-stat-number">98%</span>
              <span className="reg-stat-label">Satisfied</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="register-form-section">
        <div className="register-wrapper">
          <div className="register-card">
            {/* Header */}
            <div className="reg-header">
              <h2>Create Account</h2>
              <p>Fill in the details below to get started</p>
            </div>

            {errorMsg && <div className="error-alert">{errorMsg}</div>}
            {successMsg && <div className="success-alert">{successMsg}</div>}

            <form onSubmit={handleRegister} className="register-form">
              {/* Email */}
              <div className="reg-input-group">
                <label>Email Address</label>
                <div className="reg-input-wrapper">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="reg-input-group">
                <label>Password</label>
                <div className="reg-input-wrapper">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="reg-input-group">
                <span className="role-selection-label">I am a</span>
                <div className="role-selection">
                  <label className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value="STUDENT"
                      checked={formData.role === 'STUDENT'}
                      onChange={handleChange}
                    />
                    <div className="role-card">
                      <span className="role-card-icon">🎓</span>
                      <span className="role-card-text">Student</span>
                    </div>
                  </label>
                  <label className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value="TEACHER"
                      checked={formData.role === 'TEACHER'}
                      onChange={handleChange}
                    />
                    <div className="role-card">
                      <span className="role-card-icon">🏫</span>
                      <span className="role-card-text">Teacher</span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className={`reg-btn-submit${isLoading ? ' loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? '\u00A0' : 'Create Account →'}
              </button>
            </form>

            <p className="login-link">
              Already have an account? <Link to="/login">Log in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}