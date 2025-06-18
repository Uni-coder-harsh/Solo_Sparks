import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quest = () => {
  const [quests, setQuests] = useState([]);
  const [message, setMessage] = useState('');
  const [reflection, setReflection] = useState({ questId: '', type: 'text', content: '', file: null });

  const fetchQuests = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please log in to view quests');
      return;
    }
    try {
      const res = await axios.get('http://localhost:5000/api/quests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuests(res.data);
      setMessage('');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error fetching quests');
    }
  };

  const generateQuest = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please log in to generate quests');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/quests/generate', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuests([...quests, res.data]);
      setMessage('New quest generated!');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error generating quest');
    }
  };

  const handleReflectionSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please log in to submit reflections');
      return;
    }

    const formData = new FormData();
    formData.append('type', reflection.type);
    if (reflection.type === 'text') {
      if (!reflection.content) {
        setMessage('Text content required');
        return;
      }
      formData.append('content', reflection.content);
    } else if (reflection.file) {
      formData.append('file', reflection.file);
    } else {
      setMessage('File required for photo or audio');
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/reflections/${reflection.questId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Reflection submitted!');
      setQuests(quests.map((q) => (q._id === reflection.questId ? { ...q, completed: true } : q)));
      setReflection({ questId: '', type: 'text', content: '', file: null });
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error submitting reflection');
    }
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  return (
    <div className="card shadow-sm p-4 fade-in">
      <h2 className="card-title text-center mb-4" style={{ color: 'var(--primary-color)' }}>Your Quests</h2>
      <button className="btn btn-primary mb-3 w-100" onClick={generateQuest}>
        Generate New Quest
      </button>
      {message && <div className="alert alert-info">{message}</div>}
      <ul className="list-group quest-list">
        {quests.map((quest) => (
          <li key={quest._id} className="list-group-item quest-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{quest.title}</strong>: {quest.description}
                <span className="ms-2">({quest.points} points)</span>
              </div>
              {quest.completed && <span className="badge bg-success">Completed</span>}
            </div>
            {!quest.completed && (
              <form onSubmit={handleReflectionSubmit} className="mt-3">
                <div className="mb-2">
                  <select
                    className="form-select"
                    value={reflection.type}
                    onChange={(e) => setReflection({ ...reflection, type: e.target.value, questId: quest._id })}
                  >
                    <option value="text">Text</option>
                    <option value="photo">Photo</option>
                    <option value="audio">Audio</option>
                  </select>
                </div>
                {reflection.type === 'text' ? (
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Enter your reflection"
                    value={reflection.questId === quest._id ? reflection.content : ''}
                    onChange={(e) => setReflection({ ...reflection, content: e.target.value, questId: quest._id })}
                  />
                ) : (
                  <input
                    type="file"
                    className="form-control mb-2"
                    accept={reflection.type === 'photo' ? 'image/*' : 'audio/*'}
                    onChange={(e) => setReflection({ ...reflection, file: e.target.files[0], questId: quest._id })}
                  />
                )}
                <button type="submit" className="btn btn-primary">
                  Submit Reflection
                </button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Quest;