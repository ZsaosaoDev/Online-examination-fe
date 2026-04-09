import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    authApi,
    userApi,
    classroomApi,
    examApi,
    dashboardApi,
} from '../../api';
import ClassroomManager from '../Classroom/ClassroomManager';
import ExamBuilder from '../Exam/ExamBuilder';
import ExamManager from '../Exam/ExamManager';
import StudentExams from '../Exam/StudentExams';
import MyResults from '../Evaluation/MyResults';
import './Dashboard.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchProfile();
        fetchStats();
    }, [navigate]);

    const fetchProfile = async () => {
        try {
            const response = await userApi.getUserProfile();
            setUser(response.data.data);
        } catch (err) {
            console.error('Failed to fetch profile:', err);
            localStorage.removeItem('accessToken');
            navigate('/login');
        }
    };

    const fetchStats = async () => {
        try {
            const response = await dashboardApi.getStats();
            setStats(response.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
            setLoading(false);
        }
    };

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

    if (loading)
        return <div className="loading-screen">Loading your workspace...</div>;

    const isTeacher = user?.roles?.includes('ROLE_TEACHER');

    return (
        <div className="home-container">
            <aside className="sidebar">
                <div className="logo">
                    <div className="logo-icon">C</div>
                    <span>Clyvasync</span>
                </div>
                <nav className="nav-menu">
                    <button
                        className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <span>Overview</span>
                    </button>

                    {isTeacher ? (
                        <>
                            <button
                                className={`nav-item ${activeTab === 'classrooms' ? 'active' : ''}`}
                                onClick={() => setActiveTab('classrooms')}
                            >
                                <span>Manage Classes</span>
                            </button>
                            <button
                                className={`nav-item ${activeTab === 'exams' ? 'active' : ''}`}
                                onClick={() => setActiveTab('exams')}
                            >
                                <span>Exam Builder</span>
                            </button>
                            <button
                                className={`nav-item ${activeTab === 'exam-manager' ? 'active' : ''}`}
                                onClick={() => setActiveTab('exam-manager')}
                            >
                                <span>Manage Exams</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className={`nav-item ${activeTab === 'my-exams' ? 'active' : ''}`}
                                onClick={() => setActiveTab('my-exams')}
                            >
                                <span>Available Exams</span>
                            </button>
                            <button
                                className={`nav-item ${activeTab === 'results' ? 'active' : ''}`}
                                onClick={() => setActiveTab('results')}
                            >
                                <span>My Results</span>
                            </button>
                        </>
                    )}

                    <div className="sidebar-footer">
                        <button
                            onClick={handleLogout}
                            className="nav-item logout-btn"
                        >
                            <span>Logout</span>
                        </button>
                    </div>
                </nav>
            </aside>

            <main className="main-content">
                <header className="header-home">
                    <div>
                        <h1>Hi, {user.email.split('@')[0]}</h1>
                        <p className="subtitle">
                            Role: {isTeacher ? 'Teacher' : 'Student'}
                        </p>
                    </div>
                    <div className="user-info">
                        <div className="avatar">
                            {user.email.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <section className="dashboard-view">
                    {activeTab === 'overview' && (
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>
                                    {isTeacher
                                        ? 'Total Classes'
                                        : 'Exams Taken'}
                                </h3>
                                <p>
                                    {isTeacher
                                        ? stats?.totalClassrooms || 0
                                        : stats?.examsTaken || 0}
                                </p>
                            </div>
                            <div className="stat-card">
                                <h3>
                                    {isTeacher
                                        ? 'Exams Built'
                                        : 'Average Score'}
                                </h3>
                                <p>
                                    {isTeacher
                                        ? stats?.totalExamsBuilt || 0
                                        : stats?.averageScore?.toFixed(2) ||
                                          '0.00'}
                                </p>
                            </div>
                            {isTeacher && (
                                <div className="stat-card">
                                    <h3>Total Students</h3>
                                    <p>{stats?.totalStudentsInClasses || 0}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'classrooms' && isTeacher && (
                        <ClassroomManager />
                    )}
                    {activeTab === 'exams' && isTeacher && <ExamBuilder />}
                    {activeTab === 'exam-manager' && isTeacher && (
                        <ExamManager />
                    )}

                    {activeTab === 'my-exams' && !isTeacher && <StudentExams />}
                    {activeTab === 'results' && !isTeacher && <MyResults />}
                </section>
            </main>
        </div>
    );
}
