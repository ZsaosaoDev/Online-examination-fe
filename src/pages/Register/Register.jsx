import { authApi } from '../../api';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
 
  useEffect(() => {
    // AUTH GUARD: If already logged in, redirect to home
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/');
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

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match!');
      return;
    }

    try {
      setIsLoading(true);
      
      await authApi.register({
        email: formData.email,
        password: formData.password,
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
      <div className="register-banner">
        <div className="reg-banner-content">
          <h1>Join Our Community</h1>
          <p>Create an account today to experience a brand new online learning and testing platform.</p>
          <img 
            src="https://illustrations.popsy.co/green/surreal-hourglass.svg" 
            alt="Register Illustration" 
            className="reg-banner-image"
          />
        </div>
      </div>

      <div className="register-form-section">
        <div className="register-wrapper">
          <div className="reg-header">
            <h2>Create Account</h2>
            <p>Fill in the details below to get started</p>
          </div>

          {errorMsg && (
            <div className="error-alert">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="success-alert">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="register-form">
            <div className="reg-input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Enter your email" 
                required 
              />
            </div>

            <div className="reg-row">
              <div className="reg-input-group">
                <label>Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="••••••••" 
                  required 
                />
              </div>
              <div className="reg-input-group">
                <label>Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  placeholder="••••••••" 
                  required 
                />
              </div>
            </div>

            <button type="submit" className="reg-btn-submit" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="login-link">
            Already have an account? <Link to="/login">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}