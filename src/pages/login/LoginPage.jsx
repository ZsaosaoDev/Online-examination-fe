import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ emailOrPhone: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    // FIX TẠI ĐÂY: Gửi đúng key 'email' và format 'ROLE'
    const payload = {
     
      email: formData.emailOrPhone, 
      password: formData.password,
    };

    try {
      const response = await authService.login(payload);
      
      // Với Cookie, trình duyệt tự lưu, ta chỉ cần lưu User Info vào localStorage
      if (response) {
        localStorage.setItem('user', JSON.stringify(response.user || response.data?.user));
        alert('Đăng nhập thành công!');
        navigate('/'); 
      }
    } catch (error) {
      // Hiện lỗi chi tiết từ BE trả về
      setErrorMsg(error.response?.data?.message || 'Tài khoản hoặc mật khẩu không chính xác');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-banner">
        <div className="banner-content">
          <h1>Hệ Thống Thi Trực Tuyến</h1>
          <p>Nền tảng quản lý học tập, giao bài và tổ chức thi tiện lợi, minh bạch.</p>
          <img src="https://illustrations.popsy.co/blue/student-going-to-school.svg" alt="Banner" className="banner-image" />
        </div>
      </div>

      <div className="login-form-section">
        <div className="form-wrapper">
          <div className="form-header">
            <h2>Xin chào! 👋</h2>
            <p>Vui lòng đăng nhập để tiếp tục</p>
          </div>

        

          {errorMsg && (
            <div style={{ color: '#dc2626', backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label>Email hoặc Số điện thoại</label>
              <input 
                type="text" 
                name="emailOrPhone" 
                value={formData.emailOrPhone} 
                onChange={handleChange} 
                placeholder="Nhập email của bạn" 
                required 
              />
            </div>

            <div className="input-group">
              <label>Mật khẩu</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••••" 
                required 
              />
            </div>

            <div className="form-options">
              <label className="remember-me"><input type="checkbox" /> Ghi nhớ</label>
              <Link to="/forgot-password" style={{color: '#2563eb', textDecoration: 'none', fontWeight: '500'}}>Quên mật khẩu?</Link>
            </div>

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="register-link">
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
}