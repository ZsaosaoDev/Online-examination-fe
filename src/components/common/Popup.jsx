import React, { useEffect } from 'react';
import './Popup.css';

const Popup = ({ isOpen, type = 'error', title, message, onClose, actionLabel = 'OK', onAction }) => {
    
    // Auto-close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const isError = type === 'error';
    const isSuccess = type === 'success';

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className={`popup-container ${type}`} onClick={e => e.stopPropagation()}>
                <div className="popup-icon">
                    {isError && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    )}
                    {isSuccess && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    )}
                    {!isError && !isSuccess && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                    )}
                </div>
                
                <div className="popup-content">
                    <h3 className="popup-title">{title || (isError ? "Lỗi" : isSuccess ? "Thành công" : "Thông báo")}</h3>
                    <p className="popup-message">{message}</p>
                </div>
                
                <div className="popup-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    {onAction && (
                        <button 
                            className="popup-btn cancel" 
                            style={{ background: '#f1f5f9', color: '#475569' }}
                            onClick={onClose}
                        >
                            Hủy bỏ
                        </button>
                    )}
                    <button 
                        className={`popup-btn ${type}`} 
                        onClick={() => {
                            if (onAction) onAction();
                            onClose();
                        }}
                    >
                        {actionLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Popup;
