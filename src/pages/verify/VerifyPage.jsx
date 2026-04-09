import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('Đang xác thực tài khoản của bạn...');

  // 1. Lấy token từ URL: ?token=3128b07c...
  const token = searchParams.get('token');

  useEffect(() => {
    const callApiVerify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Mã xác thực không tìm thấy. Vui lòng kiểm tra lại liên kết trong email.');
        return;
      }

      try {
        // 2. Gửi token qua Backend để kiểm tra
        await authService.verifyEmail(token);
        
        setStatus('success');
        setMessage('Chúc mừng! Tài khoản của bạn đã được xác thực thành công. Bây giờ bạn có thể đăng nhập.');
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Liên kết xác thực đã hết hạn hoặc không hợp lệ.');
      }
    };

    callApiVerify();
  }, [token]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconBox}>
          {status === 'loading' && <div className="spinner"></div>}
          {status === 'success' && <span style={{fontSize: '3rem'}}>✅</span>}
          {status === 'error' && <span style={{fontSize: '3rem'}}>❌</span>}
        </div>
        
        <h2 style={{ 
          color: status === 'error' ? '#dc2626' : status === 'success' ? '#059669' : '#1f2937',
          marginBottom: '1rem' 
        }}>
          {status === 'loading' ? 'Đang xử lý...' : status === 'success' ? 'Xác thực thành công' : 'Xác thực thất bại'}
        </h2>
        
        <p style={styles.text}>{message}</p>

        {status !== 'loading' && (
          <Link to="/login" style={styles.button}>
            Quay lại trang Đăng nhập
          </Link>
        )}
      </div>

      <style>{`
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', fontFamily: 'Inter, sans-serif' },
  card: { padding: '3rem', backgroundColor: '#fff', borderRadius: '1.5rem', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', maxWidth: '450px', width: '90%' },
  iconBox: { marginBottom: '1.5rem' },
  text: { marginBottom: '2rem', color: '#4b5563', lineHeight: '1.6', fontSize: '1rem' },
  button: { display: 'block', padding: '0.875rem', backgroundColor: '#2563eb', color: '#fff', textDecoration: 'none', borderRadius: '0.75rem', fontWeight: '600', transition: '0.2s' }
};