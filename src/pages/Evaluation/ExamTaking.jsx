import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import examApi from '../../api/examApi';
import evaluationApi from '../../api/evaluationApi';
import Popup from '../../components/common/Popup';
import './ExamTaking.css';

const ExamTaking = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Data State
    const [exam, setExam] = useState(null);
    const [attempt, setAttempt] = useState(null); // Determines if taking vs viewing results
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Timer State
    const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
    const timerRef = useRef(null);

    // Popup State
    const [popupState, setPopupState] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        onAction: null,
    });

    const showPopup = (type, title, message, onAction = null) => {
        setPopupState({ isOpen: true, type, title, message, onAction });
    };

    // Fetch Initial State
    useEffect(() => {
        const fetchInitialState = async () => {
            try {
                // 1. Fetch Attempt History
                const attemptRes = await evaluationApi.getMyAttemptByExam(id);
                if (attemptRes.data.data) {
                    setAttempt(attemptRes.data.data);
                }

                // 2. Fetch Exam Definition
                const examRes = await examApi.getExamById(id);
                const examData = examRes.data.data;
                setExam(examData);

                // If no attempt, initialize examination arrays and timer
                if (!attemptRes.data.data) {
                    setAnswers(
                        examData.questions.map((q) => ({
                            questionId: q.id,
                            selectedOptionIds: new Set(),
                        }))
                    );

                    const durationSecs =
                        (examData.durationInMinutes || 60) * 60;
                    setTimeRemaining(durationSecs);
                }
            } catch (error) {
                console.error('Failed to fetch exam data', error);
                showPopup(
                    'error',
                    'Lỗi tải đề thi',
                    'Không thể tải đề thi. Vui lòng thử lại.',
                    () => navigate('/dashboard')
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInitialState();
    }, [id, navigate]);

    // Timer Hook
    useEffect(() => {
        if (!loading && !attempt && timeRemaining > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleSubmit(); // Auto submit when reaching 0
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [loading, attempt, timeRemaining]); // Depend on timeRemaining initialization

    // Functions
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
            .toString()
            .padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleOptionToggle = (qId, oId) => {
        const newAnswers = [...answers];
        const answer = newAnswers.find((a) => a.questionId === qId);
        // Single choice only: always clear and set the new selection
        answer.selectedOptionIds.clear();
        answer.selectedOptionIds.add(oId);
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        if (timerRef.current) clearInterval(timerRef.current);

        try {
            const payload = {
                examId: id,
                answers: answers.map((a) => ({
                    questionId: a.questionId,
                    selectedOptionIds: Array.from(a.selectedOptionIds),
                })),
            };
            const response = await evaluationApi.submitExam(payload);

            // Re-fetch exam so review mode gets isCorrect data
            // (isCorrect was stripped during exam-taking for security)
            const examRes = await examApi.getExamById(id);
            setExam(examRes.data.data);

            setAttempt(response.data.data); // Switch to Results View
            showPopup(
                'success',
                'Nộp bài thành công',
                'Bài thi của bạn đã được ghi nhận hệ thống.'
            );
        } catch (error) {
            console.error('Failed to submit exam', error);
            showPopup(
                'error',
                'Lỗi nộp bài',
                'Đã xảy ra lỗi hệ thống hoặc phiên đăng nhập hết hạn.'
            );
        }
    };

    const scrollToQuestion = (idx) => {
        const element = document.getElementById(`question-${idx}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    if (loading)
        return (
            <div className="loading-container">
                <h2>Loading secure exam environment...</h2>
            </div>
        );

    if (!exam)
        return (
            <div className="error-container">
                <h2>Failed to load exam data!</h2>
                <button
                    className="btn-primary"
                    onClick={() => navigate('/dashboard')}
                >
                    Go Back
                </button>
            </div>
        );

    return (
        <>
            <Popup
                isOpen={popupState.isOpen}
                type={popupState.type}
                title={popupState.title}
                message={popupState.message}
                actionLabel={popupState.onAction ? 'Đồng ý' : 'OK'}
                onAction={popupState.onAction}
                onClose={() =>
                    setPopupState((prev) => ({ ...prev, isOpen: false }))
                }
            />
            {(() => {
                // --- RESULTS VIEW ---
                if (attempt) {
                    return (
                        <div className="exam-results-view">
                            <div className="results-header">
                                <h2>{exam.title} - Results</h2>
                                <div className="score-badge">
                                    {attempt.score.toFixed(2)} / 10.00
                                </div>
                            </div>

                            {!exam.showResultToStudent && (
                                <div className="hidden-details-message">
                                    <p>
                                        Detailed verification has been disabled
                                        by the instructor. Your score has been
                                        recorded.
                                    </p>
                                    <button
                                        className="btn-primary"
                                        onClick={() => navigate('/dashboard')}
                                    >
                                        Return to Dashboard
                                    </button>
                                </div>
                            )}

                            {exam.showResultToStudent && (
                                <div className="detailed-review">
                                    <h3>Detailed Review</h3>
                                    <div className="review-questions-list">
                                        {exam.questions.map((q, index) => {
                                            const studentAns =
                                                attempt.answers &&
                                                attempt.answers.find(
                                                    (a) => a.questionId === q.id
                                                );
                                            const selectedSet = new Set(
                                                studentAns
                                                    ? studentAns.selectedOptionIds
                                                    : []
                                            );

                                            return (
                                                <div
                                                    key={q.id}
                                                    className="review-question-item"
                                                >
                                                    <h4>
                                                        Question {index + 1}:{' '}
                                                        {q.content}
                                                    </h4>
                                                    <div className="options-list">
                                                        {q.options.map((o) => {
                                                            const isSelected =
                                                                selectedSet.has(
                                                                    o.id
                                                                );
                                                            const isCorrect =
                                                                o.isCorrect;

                                                            let optionClass =
                                                                'review-option';
                                                            let icon = null;
                                                            let iconClass =
                                                                'indicator-icon';

                                                            if (
                                                                isSelected &&
                                                                isCorrect
                                                            ) {
                                                                optionClass +=
                                                                    ' correct-selected';
                                                                icon = '✓';
                                                            } else if (
                                                                isSelected &&
                                                                !isCorrect
                                                            ) {
                                                                optionClass +=
                                                                    ' wrong';
                                                                icon = '✗';
                                                            } else if (
                                                                !isSelected &&
                                                                isCorrect
                                                            ) {
                                                                optionClass +=
                                                                    ' correct-missed';
                                                                icon = '✓';
                                                                iconClass +=
                                                                    ' info-icon';
                                                            } else {
                                                                optionClass +=
                                                                    ' irrelevant';
                                                            }

                                                            return (
                                                                <div
                                                                    key={o.id}
                                                                    className={
                                                                        optionClass
                                                                    }
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        disabled
                                                                        checked={
                                                                            isSelected
                                                                        }
                                                                    />
                                                                    <span>
                                                                        {
                                                                            o.content
                                                                        }
                                                                    </span>
                                                                    {icon && (
                                                                        <span
                                                                            className={
                                                                                iconClass
                                                                            }
                                                                        >
                                                                            {
                                                                                icon
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button
                                        className="btn-primary"
                                        style={{
                                            width: '100%',
                                            marginTop: '2rem',
                                        }}
                                        onClick={() => navigate('/dashboard')}
                                    >
                                        Return to Dashboard
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                }

                // --- TAKING EXAM VIEW ---
                return (
                    <div className="exam-taking-layout">
                        <div className="exam-main-panel">
                            <div className="exam-taking-header">
                                <h2>{exam.title}</h2>
                                <p>{exam.description}</p>
                            </div>

                            <div className="questions-list">
                                {exam.questions.map((q, index) => (
                                    <div
                                        key={q.id}
                                        id={`question-${index}`}
                                        className="question-item"
                                    >
                                        <h4>
                                            <span className="q-number">
                                                Q{index + 1}.
                                            </span>
                                            {q.content}
                                        </h4>
                                        <div className="options-list">
                                            {q.options.map((o) => {
                                                const isSelected = answers
                                                    .find(
                                                        (a) =>
                                                            a.questionId ===
                                                            q.id
                                                    )
                                                    .selectedOptionIds.has(
                                                        o.id
                                                    );
                                                return (
                                                    <label
                                                        key={o.id}
                                                        className={`option-item ${isSelected ? 'selected' : ''}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`q-${q.id}`}
                                                            checked={isSelected}
                                                            onChange={() =>
                                                                handleOptionToggle(
                                                                    q.id,
                                                                    o.id
                                                                )
                                                            }
                                                        />
                                                        {o.content}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <aside className="exam-side-panel">
                            <div
                                className={`timer-box ${timeRemaining < 300 ? 'danger' : ''}`}
                            >
                                <div className="timer-label">
                                    Time Remaining
                                </div>
                                <div className="timer-value">
                                    {formatTime(timeRemaining)}
                                </div>
                            </div>

                            <div className="question-nav-grid">
                                <h3>Navigation</h3>
                                <div className="nav-grid-container">
                                    {exam.questions.map((q, index) => {
                                        const isAnswered =
                                            answers.find(
                                                (a) => a.questionId === q.id
                                            ).selectedOptionIds.size > 0;
                                        return (
                                            <button
                                                key={q.id}
                                                onClick={() =>
                                                    scrollToQuestion(index)
                                                }
                                                className={`nav-btn ${isAnswered ? 'answered' : ''}`}
                                            >
                                                {index + 1}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="nav-legend">
                                    <span className="legend-item">
                                        <span className="legend-color answered"></span>{' '}
                                        Answered
                                    </span>
                                    <span className="legend-item">
                                        <span className="legend-color pending"></span>{' '}
                                        Pending
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    showPopup(
                                        'info',
                                        'Xác nhận nộp bài',
                                        'Bạn có chắc chắn muốn nộp bài ngay bây giờ?',
                                        handleSubmit
                                    );
                                }}
                                className="btn-submit-exam"
                            >
                                Finish & Submit
                            </button>
                        </aside>
                    </div>
                );
            })()}
        </>
    );
};

export default ExamTaking;
