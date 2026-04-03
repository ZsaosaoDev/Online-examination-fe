import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Lấy thông tin user từ localStorage
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login'); // Nếu chưa đăng nhập thì đá về trang login
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const exams = [
    { id: 1, title: 'Kiểm tra Toán cuối kỳ', time: '60 phút', questions: 40, icon: '📐' },
    { id: 2, title: 'Trắc nghiệm Tiếng Anh Unit 10', time: '45 phút', questions: 30, icon: '🔤' },
    { id: 3, title: 'Lập trình Java cơ bản', time: '90 phút', questions: 50, icon: '☕' },
  ];

  if (!user) return null;

  return (
    <div className="home-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <span>🚀</span> <span>Clyvasync</span>
        </div>
        <nav className="nav-menu">
          <Link to="/" className="nav-item active">🏠 <span>Bảng điều khiển</span></Link>
          <Link to="/exams" className="nav-item">📝 <span>Bài thi của tôi</span></Link>
          <Link to="/results" className="nav-item">📊 <span>Kết quả</span></Link>
          <Link to="/profile" className="nav-item">👤 <span>Cá nhân</span></Link>
        </nav>
        <button onClick={handleLogout} className="nav-item" style={{ marginTop: 'auto', border: 'none', background: 'none', width: '100%', cursor: 'pointer' }}>
          🚪 <span>Đăng xuất</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="header-home">
          <div>
            <h1>Chào buổi sáng, {user.fullName || 'Bạn'}! 👋</h1>
            <p style={{ color: '#64748b' }}>Hôm nay bạn muốn học gì nào?</p>
          </div>
          <div className="user-info">
            <div className="avatar">{user.fullName?.charAt(0) || 'U'}</div>
          </div>
        </header>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Bài thi đã xong</h3>
            <p>12</p>
          </div>
          <div className="stat-card">
            <h3>Điểm trung bình</h3>
            <p>8.5</p>
          </div>
          <div className="stat-card">
            <h3>Xếp hạng</h3>
            <p>#4</p>
          </div>
        </div>

        {/* EXAM LIST */}
        <h3 className="section-title">Bài thi sắp tới</h3>
        <div className="exam-grid">
          {exams.map((exam) => (
            <div key={exam.id} className="exam-card">
              <div className="exam-banner">{exam.icon}</div>
              <div className="exam-details">
                <h4>{exam.title}</h4>
                <div className="exam-info">
                  <span>⏱ Thời gian: {exam.time}</span>
                  <span>❓ Số câu hỏi: {exam.questions}</span>
                </div>
                <button className="btn-start">Bắt đầu thi ngay</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}