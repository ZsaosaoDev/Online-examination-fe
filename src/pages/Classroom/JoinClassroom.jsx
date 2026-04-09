import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import classroomApi from '../../api/classroomApi';
import './Classroom.css';

const JoinClassroom = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (!token) {
            setStatus('error');
            setErrorMsg('Invalid or missing invitation token.');
            return;
        }

        const joinClass = async () => {
            try {
                await classroomApi.joinClassroom(token);
                setStatus('success');
            } catch (error) {
                console.error("Failed to join classroom", error);
                setStatus('error');
                setErrorMsg(error.response?.data?.message || 'Failed to join classroom. The invitation may be expired or already used.');
            }
        };

        joinClass();
    }, [location.search, navigate]);

    return (
        <div className="join-classroom-container">
            <div className="join-card">
                {status === 'processing' && (
                    <div className="join-content processing">
                        <div className="spinner"></div>
                        <h2>Đang xử lý lời mời...</h2>
                        <p>Vui lòng chờ trong giây lát.</p>
                    </div>
                )}
                
                {status === 'success' && (
                    <div className="join-content success">
                        <div className="icon-success">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <h2>Tham gia thành công!</h2>
                        <p>Bạn đã được đưa vào danh sách lớp học. Bạn có thể xem các thông báo và tài liệu của lớp.</p>
                        <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                            Đến Dashboard
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="join-content error">
                        <div className="icon-error">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                        </div>
                        <h2>Không thể tham gia</h2>
                        <p>{errorMsg}</p>
                        <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                            Về trang chủ
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JoinClassroom;
