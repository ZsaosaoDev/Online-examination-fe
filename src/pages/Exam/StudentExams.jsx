import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import examApi from '../../api/examApi';
import evaluationApi from '../../api/evaluationApi';
import '../Exam/Exam.css';

export default function StudentExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'ONGOING', 'EXPIRED'
  const [attempts, setAttempts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [examsRes, attemptsRes] = await Promise.all([
        examApi.getStudentExams(),
        evaluationApi.getMyAttempts()
      ]);
      setExams(examsRes.data.data || []);
      setAttempts(attemptsRes.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch data", err);
      setExams([]);
      setLoading(false);
    }
  };

  const getFilteredExams = () => {
    // 1. Filter out already taken exams
    const takenExamIds = new Set(attempts.map(a => a.examId));
    let available = exams.filter(e => !takenExamIds.has(e.id));

    if (filter === 'ALL') return available;
    // For now, simulate time filtering or just return available
    return available;
  };

  const filteredExams = getFilteredExams();

  if (loading) {
    return <div className="loading-spinner" style={{marginTop: '2rem'}}>Loading available exams...</div>;
  }

  return (
    <div className="student-exams-container">
      <div className="exams-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>My Assigned Exams</h2>
        <div className="filter-controls" style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
                className={`btn-filter ${filter === 'ALL' ? 'active' : ''}`} 
                onClick={() => setFilter('ALL')}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: filter === 'ALL' ? '#e0e7ff' : 'white', color: filter === 'ALL' ? '#4f46e5' : '#64748b', cursor: 'pointer', fontWeight: 600 }}
            >All</button>
            <button 
                className={`btn-filter ${filter === 'ONGOING' ? 'active' : ''}`} 
                onClick={() => setFilter('ONGOING')}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: filter === 'ONGOING' ? '#dcfce7' : 'white', color: filter === 'ONGOING' ? '#166534' : '#64748b', cursor: 'pointer', fontWeight: 600 }}
            >Ongoing</button>
            <button 
                className={`btn-filter ${filter === 'EXPIRED' ? 'active' : ''}`} 
                onClick={() => setFilter('EXPIRED')}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: filter === 'EXPIRED' ? '#fee2e2' : 'white', color: filter === 'EXPIRED' ? '#991b1b' : '#64748b', cursor: 'pointer', fontWeight: 600 }}
            >Expired</button>
        </div>
      </div>

      {exams.length === 0 ? (
        <div className="empty-state">
            <h3>No exams assigned yet</h3>
            <p>Join a classroom using an invite link to view your assessments.</p>
        </div>
      ) : (
        <div className="exam-grid">
            {filteredExams.map(exam => (
                <div key={exam.id} className="modern-exam-card">
                    <div className="card-accent" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)'}}></div>
                    <div className="card-content">
                        <h3>{exam.title}</h3>
                        <p>{exam.description || "No description provided for this exam."}</p>
                        <div className="card-metadata" style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                            <span className="metadata-item" style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <span className="icon">📝</span> 
                                {exam.questions?.length || 0} Questions
                            </span>
                        </div>
                    </div>
                    <button className="btn-assign-exam" onClick={() => navigate(`/dashboard/exam/${exam.id}`)} style={{ background: '#4f46e5', color: 'white', marginTop: '1rem', width: '100%', padding: '0.75rem', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                        Start Attempt
                    </button>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}
