import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      localStorage.setItem('accessToken', token);
      // Redirect to dashboard after successful auth
      navigate('/dashboard');
    } else {
      // If no token, redirect to login with error
      navigate('/login?error=Google login failed');
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1rem',
      backgroundColor: '#f3f4f6'
    }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p style={{ color: '#4b5563', fontWeight: '500' }}>Completing login...</p>
    </div>
  );
};

export default AuthCallback;
