import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('accessToken');
      navigate('/login');
    }
  };

  const exams = [
    { id: 1, title: 'Final Math Exam', time: '60 mins', questions: 40, icon: '📐' },
    { id: 2, title: 'English Grammar Test', time: '45 mins', questions: 30, icon: '🔤' },
    { id: 3, title: 'Java Fundamentals', time: '90 mins', questions: 50, icon: '☕' },
  ];

  if (loading) return null;

  return (
    <div className="home-container">
      <aside className="sidebar">
        <div className="logo">
          <span></span> <span>Clyvasync</span>
        </div>
        <nav className="nav-menu">
          <Link to="/" className="nav-item"> <span>Public Home</span></Link>
          <Link to="/dashboard" className="nav-item active"> <span>Dashboard</span></Link>
          <Link to="/exams" className="nav-item"> <span>My Exams</span></Link>
          <Link to="/results" className="nav-item"> <span>Results</span></Link>
          {localStorage.getItem('accessToken') && (
            <button onClick={handleLogout} className="nav-item logout-btn" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
              <span>Logout</span>
            </button>
          )}
        </nav>
      </aside>

      <main className="main-content">
        <header className="header-home">
          <div>
            <h1>Good morning!</h1>
            <p className="subtitle">What would you like to learn today?</p>
          </div>
          <div className="user-info">
            <div className="avatar">U</div>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Exams Finished</h3>
            <p>12</p>
          </div>
          <div className="stat-card">
            <h3>Average Score</h3>
            <p>8.5</p>
          </div>
          <div className="stat-card">
            <h3>Ranking</h3>
            <p>#4</p>
          </div>
        </div>

        <h3 className="section-title">Upcoming Exams</h3>
        <div className="exam-grid">
          {exams.map((exam) => (
            <div key={exam.id} className="exam-card">
              <div className="exam-banner">{exam.icon}</div>
              <div className="exam-details">
                <h4>{exam.title}</h4>
                <div className="exam-info">
                  <span> Duration: {exam.time}</span>
                  <span> Questions: {exam.questions}</span>
                </div>
                <button className="btn-start">Start Now</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
