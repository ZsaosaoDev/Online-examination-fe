import { authService } from '../../services/authService';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css';

export default function RegisterPage() {
  const navigate = useNavigate(); // Dùng để chuyển trang sau khi đăng ký thành công

  // 1. Quản lý State cho các lựa chọn và ô nhập liệu
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    fullName: '',
    emailOrPhone: '',
    password: '',
    confirmPassword: '',
  });

  // 2. Quản lý trạng thái Call API và Báo lỗi
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 3. Hàm tự động cập nhật State khi người dùng gõ phím
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 4. Hàm xử lý khi bấm nút "Tạo tài khoản"
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg(''); // Xóa thông báo lỗi cũ (nếu có)

    // Kiểm tra mật khẩu nhập lại có khớp không
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không khớp!');
      return;
    }

    // Gói dữ liệu lại theo chuẩn Backend cần
    const payload = {
      role: role,
      fullName: formData.fullName,
      email: formData.emailOrPhone, // Tùy BE của bạn đặt tên biến là gì nhé (email, username, phone...)
      password: formData.password,
    };

    try {
      setIsLoading(true); // Bật hiệu ứng loading
      
      // Gọi Service gửi API xuống Backend
      const response = await authService.register(payload);
      
      // Nếu thành công
      alert('Đăng ký thành công! Đang chuyển hướng...');
      navigate('/login'); // Đá người dùng về trang Đăng nhập

    } catch (error) {
      // Bắt lỗi từ BE trả về (ví dụ: Email đã tồn tại)
      console.error(error);
      setErrorMsg(error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!');
    } finally {
      setIsLoading(false); // Tắt hiệu ứng loading
    }
  };

  return (
    <div className="register-container">
      {/* CỘT TRÁI - BANNER */}
      <div className="register-banner">
        <div className="reg-banner-content">
          <h1>Tham Gia Cùng Chúng Tôi</h1>
          <p>Tạo tài khoản ngay hôm nay để trải nghiệm nền tảng học và thi trực tuyến hoàn toàn mới.</p>
          <img 
            src="https://illustrations.popsy.co/green/surreal-hourglass.svg" 
            alt="Register Illustration" 
            className="reg-banner-image"
          />
        </div>
      </div>

      {/* CỘT PHẢI - FORM */}
      <div className="register-form-section">
        <div className="register-wrapper">
          <div className="reg-header">
            <h2>Tạo tài khoản </h2>
            <p>Điền thông tin bên dưới để bắt đầu</p>
          </div>

          {/* Chọn vai trò */}
          <div className="reg-role-toggle">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={role === 'student' ? 'active' : ''}
            >
              🎓 Học sinh
            </button>
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={role === 'teacher' ? 'active' : ''}
            >
              👨‍🏫 Giáo viên
            </button>
          </div>

          {/* HIỂN THỊ LỖI MÀU ĐỎ TRÊN FORM */}
          {errorMsg && (
            <div style={{ color: '#dc2626', backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center', fontWeight: '500' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="register-form">
            <div className="reg-input-group">
              <label>Họ và tên</label>
              {/* Thêm name, value và onChange */}
              <input 
                type="text" 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleChange} 
                placeholder="VD: Nguyễn Văn A" 
                required 
              />
            </div>

            <div className="reg-input-group">
              <label>Số điện thoại hoặc Email</label>
              <input 
                type="text" 
                name="emailOrPhone" 
                value={formData.emailOrPhone} 
                onChange={handleChange} 
                placeholder="Nhập số điện thoại / email" 
                required 
              />
            </div>

            <div className="reg-row">
              <div className="reg-input-group">
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
              <div className="reg-input-group">
                <label>Nhập lại mật khẩu</label>
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

            {/* Đổi chữ Nút thành Đang xử lý khi gọi API */}
            <button type="submit" className="reg-btn-submit" disabled={isLoading}>
              {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </form>

          <p className="login-link">
            Đã có tài khoản? <Link to="/login">Đăng nhập tại đây</Link>
          </p>
        </div>
      </div>
    </div>
  );
}