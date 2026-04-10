import React, { useState } from 'react';
import examApi from '../../api/examApi';
import Popup from '../../components/common/Popup';
import './Exam.css';

const ExamBuilder = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([
        { content: '', type: 'SINGLE_CHOICE', options: [{ content: '', isCorrect: false }] }
    ]);
    
    // Popup state
    const [popupState, setPopupState] = useState({ isOpen: false, type: 'info', title: '', message: '' });

    const showPopup = (type, title, message) => {
        setPopupState({ isOpen: true, type, title, message });
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { content: '', type: 'SINGLE_CHOICE', options: [{ content: '', isCorrect: false }] }]);
    };

    const handleRemoveQuestion = (qIndex) => {
        const newQuestions = questions.filter((_, i) => i !== qIndex);
        setQuestions(newQuestions);
    };

    const handleAddOption = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push({ content: '', isCorrect: false });
        setQuestions(newQuestions);
    };

    const handleRemoveOption = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== oIndex);
        setQuestions(newQuestions);
    };

    const handleQuestionChange = (qIndex, field, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, field, value) => {
        const newQuestions = [...questions];
        // Single choice: only one option can be correct
        if (field === 'isCorrect' && value === true) {
            newQuestions[qIndex].options.forEach((opt, idx) => {
                opt.isCorrect = (idx === oIndex);
            });
        } else {
            newQuestions[qIndex].options[oIndex][field] = value;
        }
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await examApi.createExam({ title, description, questions });
            showPopup('success', 'Thành công', 'Đề thi đã được tạo thành công!');
            setTitle('');
            setDescription('');
            setQuestions([{ content: '', type: 'SINGLE_CHOICE', options: [{ content: '', isCorrect: false }] }]);
        } catch (error) {
            console.error("Failed to create exam", error);
            showPopup('error', 'Lỗi tạo đề thi', 'Không thể tạo đề thi. Vui lòng kiểm tra lại kết nối hoặc phân quyền.');
        }
    };

    return (
        <div className="exam-builder-container">
            <Popup 
                isOpen={popupState.isOpen}
                type={popupState.type}
                title={popupState.title}
                message={popupState.message}
                onClose={() => setPopupState(prev => ({ ...prev, isOpen: false }))}
            />

            <div className="builder-header">
                <h2>Create New Exam</h2>
                <p>Design your test by adding questions and marking correct answers.</p>
            </div>

            <form onSubmit={handleSubmit} className="builder-form">
                <section className="exam-info-section">
                    <div className="form-group">
                        <label>Exam Title</label>
                        <input 
                            type="text" 
                            placeholder="Enter a descriptive title" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea 
                            placeholder="Briefly describe the purpose of this exam" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                        />
                    </div>
                </section>

                <div className="questions-manager">
                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="question-card">
                            <div className="question-header">
                                <span className="question-number">Question {qIndex + 1}</span>
                                <button 
                                    type="button" 
                                    className="btn-remove-q"
                                    onClick={() => handleRemoveQuestion(qIndex)}
                                    title="Remove Question"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="question-body">
                                <textarea 
                                    placeholder="Enter your question here..." 
                                    value={q.content} 
                                    onChange={(e) => handleQuestionChange(qIndex, 'content', e.target.value)} 
                                    required 
                                />

                                <div className="options-container">
                                    <label>Options:</label>
                                    {q.options.map((o, oIndex) => (
                                        <div key={oIndex} className="option-row">
                                            <input 
                                                type="radio" 
                                                name={`correct-${qIndex}`}
                                                className="option-check"
                                                checked={o.isCorrect} 
                                                onChange={(e) => handleOptionChange(qIndex, oIndex, 'isCorrect', e.target.checked)} 
                                            />
                                            <input 
                                                type="text" 
                                                className="option-input"
                                                placeholder={`Option ${oIndex + 1}`} 
                                                value={o.content} 
                                                onChange={(e) => handleOptionChange(qIndex, oIndex, 'content', e.target.value)} 
                                                required 
                                            />
                                            <button 
                                                type="button" 
                                                className="btn-remove-opt"
                                                onClick={() => handleRemoveOption(qIndex, oIndex)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    <button 
                                        type="button" 
                                        className="btn-add-opt" 
                                        onClick={() => handleAddOption(qIndex)}
                                    >
                                        + Add Alternative
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <button type="button" onClick={handleAddQuestion} className="btn-add-question">
                        + Add New Question
                    </button>
                </div>

                <div className="builder-footer">
                    <button type="submit" className="btn-save-full-exam">Publish Exam</button>
                </div>
            </form>
        </div>
    );
};

export default ExamBuilder;
