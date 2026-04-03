import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../../api';
import './Verify.css';

export default function Verify() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying your account...');

  const token = searchParams.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Missing verification token. Please check your email link.');
        return;
      }

      try {
        await authApi.verifyEmail(token);
        
        setStatus('success');
        setMessage('Congratulations! Your account has been verified successfully. You can now log in.');
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'The link is invalid or has expired.');
      }
    };

    verifyToken();
  }, [token]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <div className="spinner"></div>
            <h2 className="verify-heading">Processing...</h2>
          </>
        );
      case 'success':
        return (
          <>
            <div className="status-icon success">✓</div>
            <h2 className="verify-heading" style={{ color: '#10b981' }}>Verification Successful</h2>
          </>
        );
      case 'error':
        return (
          <>
            <div className="status-icon error">✕</div>
            <h2 className="verify-heading" style={{ color: '#ef4444' }}>Verification Failed</h2>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <div className="verify-icon-box">
          {renderContent()}
        </div>
        
        <p className="verify-text">{message}</p>

        {status !== 'loading' && (
          <Link to="/login" className="verify-button">
            Back to Login
          </Link>
        )}
      </div>
    </div>
  );
}