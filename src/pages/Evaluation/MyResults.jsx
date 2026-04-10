import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { evaluationApi } from '../../api';
import './MyResults.css';

const MyResults = () => {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAttempts();
    }, []);

    const fetchAttempts = async () => {
        try {
            const response = await evaluationApi.getMyAttempts();
            // Sort by submit time (newest first)
            const sortedAttempts = response.data.data.sort(
                (a, b) => new Date(b.submitTime) - new Date(a.submitTime)
            );
            setAttempts(sortedAttempts);
        } catch (error) {
            console.error('Failed to fetch attempts', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getScoreClass = (score) => {
        if (score >= 8) return 'score-excellent';
        if (score >= 5) return 'score-good';
        return 'score-poor';
    };

    if (loading)
        return (
            <div className="loading-results">
                Loading your academic history...
            </div>
        );

    return (
        <div className="my-results-container">
            <div className="results-list-header">
                <h2>Your Exam History</h2>
                <p>Track your progress and review past performances</p>
            </div>

            {attempts.length === 0 ? (
                <div className="no-results-card">
                    <div className="no-results-icon">📝</div>
                    <h3>No attempts yet</h3>
                    <p>
                        You haven't completed any exams. Check "Available Exams"
                        to start.
                    </p>
                </div>
            ) : (
                <div className="results-grid">
                    {attempts.map((attempt) => (
                        <div key={attempt.id} className="result-card">
                            <div className="result-card-header">
                                <span className="exam-date">
                                    {formatDate(attempt.submitTime)}
                                </span>
                                <div
                                    className={`score-circle ${getScoreClass(attempt.score)}`}
                                >
                                    {attempt.score.toFixed(1)}
                                </div>
                            </div>
                            <div className="result-card-body">
                                <h3>
                                    {attempt.examTitle ||
                                        `Exam #${attempt.examId}`}
                                </h3>
                                <div className="result-meta">
                                    <span>
                                        {attempt.answers.length} Questions
                                        answered
                                    </span>
                                </div>
                            </div>
                            <div className="result-card-footer">
                                <button
                                    className="btn-review"
                                    onClick={() =>
                                        navigate(
                                            `/dashboard/exam/${attempt.examId}`
                                        )
                                    }
                                >
                                    Review Detailed Results
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyResults;
