import React, { useState, useEffect } from 'react';
import classroomApi from '../../api/classroomApi';
import './Classroom.css';

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ClassroomManager = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [newClassName, setNewClassName] = useState('');
    const [newClassDesc, setNewClassDesc] = useState('');
    const [loading, setLoading] = useState(true);

    // Manage Modal State
    const [showManageModal, setShowManageModal] = useState(false);
    const [selectedClassroom, setSelectedClassroom] = useState(null);
    const [members, setMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');

    useEffect(() => {
        fetchClassrooms();
    }, []);

    const fetchClassrooms = async () => {
        try {
            const response = await classroomApi.getTeacherClassrooms();
            setClassrooms(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch classrooms", error);
            setLoading(false);
        }
    };

    const handleCreateClass = async (e) => {
        e.preventDefault();
        try {
            await classroomApi.createClassroom({
                name: newClassName,
                description: newClassDesc
            });
            setNewClassName('');
            setNewClassDesc('');
            fetchClassrooms();
        } catch (error) {
            console.error("Failed to create classroom", error);
        }
    };

    const openManageModal = async (classroom) => {
        setSelectedClassroom(classroom);
        setShowManageModal(true);
        setLoadingMembers(true);
        try {
            const res = await classroomApi.getMembers(classroom.id);
            setMembers(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch members", err);
            setMembers([]);
        } finally {
            setLoadingMembers(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        try {
            await classroomApi.inviteStudent(selectedClassroom.id, inviteEmail);
            alert(`Invitation sent to ${inviteEmail} successfully!`);
            setInviteEmail('');
        } catch (error) {
            console.error("Failed to invite student", error);
            alert("Failed to send invitation. Please ensure the email is valid and the user exists.");
        }
    };

    return (
        <div className="classroom-manager-container">
            <header className="manager-header">
                <div className="header-text">
                    <h2>Classroom Management</h2>
                    <p>Organize your students, share materials, and manage assessments.</p>
                </div>
            </header>
            
            <section className="create-classroom-section">
                <form onSubmit={handleCreateClass} className="create-class-form">
                    <div className="form-title">Create New Classroom</div>
                    <div className="form-grid">
                        <div className="input-field">
                            <label>Name</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Advanced Mathematics" 
                                value={newClassName} 
                                onChange={(e) => setNewClassName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="input-field max-width">
                            <label>Description</label>
                            <textarea 
                                placeholder="Focus on calculus and linear algebra foundations" 
                                value={newClassDesc} 
                                onChange={(e) => setNewClassDesc(e.target.value)} 
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-create-submit">Initialize Class</button>
                </form>
            </section>

            <section className="classroom-list-section">
                <div className="section-subtitle">Active Classrooms</div>
                <div className="classroom-grid">
                    {loading ? (
                        <div className="loading-spinner">Loading classrooms...</div>
                    ) : (
                        classrooms.map(c => (
                            <div key={c.id} className="modern-classroom-card">
                                <div className="card-accent"></div>
                                <div className="card-content">
                                    <h3>{c.name}</h3>
                                    <p>{c.description || "No description provided for this classroom."}</p>
                                    <div className="card-metadata">
                                        <span className="metadata-item">
                                            <span className="icon">📅</span> 
                                            {new Date(c.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                                <button className="btn-manage-classroom" onClick={() => openManageModal(c)}>
                                    <UsersIcon />
                                    <span>Manage Classroom</span>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {showManageModal && selectedClassroom && (
                <div className="manage-modal-overlay">
                    <div className="manage-modal">
                        <div className="manage-modal-header">
                            <h3>Manage <span>{selectedClassroom.name}</span></h3>
                            <button className="icon-btn btn-close-modal" onClick={() => setShowManageModal(false)}>
                                <CloseIcon />
                            </button>
                        </div>
                        
                        <div className="manage-modal-content">
                            <div className="members-section">
                                <h4>Enrolled Students</h4>
                                {loadingMembers ? (
                                    <div className="loading-spinner">Loading members...</div>
                                ) : members.length === 0 ? (
                                    <p className="no-members-text">No students have joined this classroom yet.</p>
                                ) : (
                                    <div className="members-list">
                                        {members.map(member => (
                                            <div key={member.id} className="member-item">
                                                <div className="member-avatar">
                                                    {member.userName ? member.userName.charAt(0).toUpperCase() : '?'}
                                                </div>
                                                <div className="member-info">
                                                    <div className="member-name">{member.userName || 'Unknown'}</div>
                                                    <div className="member-email">{member.userEmail}</div>
                                                </div>
                                                <div className={`member-status status-${member.status?.toLowerCase()}`}>
                                                    {member.status}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="invite-section">
                                <h4>Invite New Student</h4>
                                <form onSubmit={handleInvite} className="invite-form-inline">
                                    <input 
                                        type="email" 
                                        className="premium-input"
                                        placeholder="student@example.com"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="btn-premium-invite">
                                        <MailIcon />
                                        <span>Send</span>
                                    </button>
                                </form>
                                <small className="invite-hint">An email with a join link will be sent to the user.</small>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassroomManager;
