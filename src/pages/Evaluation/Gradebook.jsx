import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import evaluationApi from '../../api/evaluationApi';
import './Gradebook.css';

const Gradebook = () => {
    const { examId } = useParams();
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAttempts();
    }, [examId]);

    const fetchAttempts = async () => {
        try {
            const response = await evaluationApi.getExamAttempts(examId);
            setAttempts(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch exam attempts", error);
            setLoading(false);
        }
    };

    return (
        <div className="gradebook-page">
            <h2>Exam Results & Gradebook</h2>
            <div className="attempts-table-container">
              {loading ? <p>Loading results...</p> : (
                  <table className="attempts-table">
                      <thead>
                          <tr>
                              <th>Student Name</th>
                              <th>Submission Time</th>
                              <th>Score / 10.0</th>
                              <th>Action</th>
                          </tr>
                      </thead>
                      <tbody>
                          {attempts.map(a => (
                              <tr key={a.id}>
                                  <td>{a.studentName || `Student ID: ${a.studentId}`}</td>
                                  <td>{new Date(a.submitTime).toLocaleString()}</td>
                                  <td className="score-cell">{a.score.toFixed(2)}</td>
                                  <td><button className="btn-view-detail">View Detail</button></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              )}
              {attempts.length === 0 && !loading && <p>No completions yet.</p>}
            </div>
        </div>
    );
};

export default Gradebook;
