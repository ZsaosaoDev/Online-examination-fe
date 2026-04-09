import React, { useState, useEffect } from 'react';
import examApi from '../../api/examApi';
import classroomApi from '../../api/classroomApi';
import './Exam.css';

// SVG Icons for Friendly UI
const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"></path>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ExamManager = () => {
    const [exams, setExams] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);
    
    // Assignment Form State
    const [selectedClassrooms, setSelectedClassrooms] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [duration, setDuration] = useState(60);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [examRes, classRes] = await Promise.all([
                examApi.getTeacherExams(),
                classroomApi.getTeacherClassrooms()
            ]);
            setExams(examRes.data.data);
            setClassrooms(classRes.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch data", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this exam? This action cannot be undone.")) {
            try {
                await examApi.deleteExam(id);
                setExams(exams.filter(e => e.id !== id));
            } catch (error) {
                console.error("Failed to delete exam", error);
            }
        }
    };

    const handleToggleVisibility = async (exam) => {
        try {
            const newValue = !exam.showResultToStudent;
            await examApi.toggleVisibility(exam.id, newValue);
            setExams(exams.map(e => e.id === exam.id ? { ...e, showResultToStudent: newValue } : e));
        } catch (error) {
            console.error("Failed to update visibility", error);
        }
    };

    const openAssignModal = (exam) => {
        setSelectedExam(exam);
        setShowAssignModal(true);
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                classroomIds: selectedClassrooms,
                startTime: new Date(startTime).toISOString(),
                endTime: new Date(endTime).toISOString(),
                durationInMinutes: parseInt(duration)
            };
            await examApi.assignToClassrooms(selectedExam.id, payload);
            alert("Exam assigned successfully!");
            setShowAssignModal(false);
            setSelectedClassrooms([]);
            setStartTime('');
            setEndTime('');
        } catch (error) {
            console.error("Failed to assign exam", error);
            alert("Failed to assign exam. Please check your inputs.");
        }
    };

    const toggleClassroomSelection = (id) => {
        setSelectedClassrooms(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="exam-manager-container">
            <header className="manager-header animated-header">
                <div className="header-text">
                    <h2>Exam Inventory</h2>
                    <p>Total {exams.length} exams available in your collection.</p>
                </div>
            </header>

            <div className="exam-grid">
                {loading ? (
                    <div className="loading-spinner">Loading repository...</div>
                ) : (
                    exams.map(exam => (
                        <div key={exam.id} className="modern-exam-card">
                            <div className="card-top">
                                <span className={`premium-badge ${exam.showResultToStudent ? 'visible' : 'hidden'}`}>
                                    {exam.showResultToStudent ? 'Results Public' : 'Results Hidden'}
                                </span>
                                <div className="card-actions">
                                    <button 
                                        className={`icon-btn ${exam.showResultToStudent ? 'btn-view' : 'btn-hide'}`} 
                                        onClick={() => handleToggleVisibility(exam)} 
                                        title="Toggle Visibility">
                                        {exam.showResultToStudent ? <EyeIcon /> : <EyeOffIcon />}
                                    </button>
                                    <button 
                                        className="icon-btn btn-delete" 
                                        onClick={() => handleDelete(exam.id)} 
                                        title="Delete Exam">
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                            <div className="card-info">
                                <h3>{exam.title}</h3>
                                <p>{exam.description || "No description provided."}</p>
                                <div className="card-stats premium-stats">
                                    <div className="stat-pill">
                                        <span className="stat-label">Questions</span>
                                        <span className="stat-value">{exam.questions?.length || 0}</span>
                                    </div>
                                    <div className="stat-pill">
                                        <span className="stat-label">Created</span>
                                        <span className="stat-value">{new Date(exam.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="btn-premium-assign" onClick={() => openAssignModal(exam)}>
                                Assign to Classes
                            </button>
                        </div>
                    ))
                )}
            </div>

            {showAssignModal && selectedExam && (
                <div className="premium-modal-overlay">
                    <div className="premium-assignment-modal">
                        <div className="modal-header">
                            <h3>Assign: <span>{selectedExam.title}</span></h3>
                            <button className="icon-btn btn-close-modal" onClick={() => setShowAssignModal(false)}>
                                <CloseIcon />
                            </button>
                        </div>
                        <form onSubmit={handleAssign} className="assignment-form">
                            <div className="form-section">
                                <label>Target Classrooms</label>
                                <div className="classroom-checklist glass-checklist">
                                    {classrooms.map(cls => (
                                        <div key={cls.id} 
                                             className={`glass-check-item ${selectedClassrooms.includes(cls.id) ? 'checked' : ''}`}
                                             onClick={() => toggleClassroomSelection(cls.id)}>
                                            <div className="checkbox-custom"></div>
                                            <span>{cls.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="glass-form-group">
                                    <label>Start Window</label>
                                    <input 
                                        type="datetime-local" 
                                        value={startTime} 
                                        className="premium-input"
                                        onChange={(e) => setStartTime(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="glass-form-group">
                                    <label>End Window</label>
                                    <input 
                                        type="datetime-local" 
                                        value={endTime} 
                                        className="premium-input"
                                        onChange={(e) => setEndTime(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="glass-form-group duration-group">
                                <label>Duration <span>(Minutes)</span></label>
                                <input 
                                    type="number" 
                                    value={duration} 
                                    className="premium-input"
                                    onChange={(e) => setDuration(e.target.value)} 
                                    required 
                                    min="1"
                                />
                                <small>Once started, students have exactly this much time to finish the exam.</small>
                            </div>

                            <button type="submit" className="btn-premium-confirm">
                                Initialize Assignment
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: "8px"}}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamManager;
