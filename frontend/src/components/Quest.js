import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quest = () => {
  const [quests, setQuests] = useState([]);
  const [message, setMessage] = useState('');

  const fetchQuests = async () => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Debug token
    if (!token) {
      setMessage('Please log in to view quests');
      return;
    }
    try {
      const res = await axios.get('http://localhost:5000/api/quests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched quests:', res.data); // Debug response
      setQuests(res.data);
      setMessage('');
    } catch (err) {
      console.error('Fetch error:', err.response); // Debug error
      setMessage(err.response?.data?.msg || 'Error fetching quests');
    }
  };

  const generateQuest = async () => {
    const token = localStorage.getItem('token');
    console.log('Token for generate:', token); // Debug token
    if (!token) {
      setMessage('Please log in to generate quests');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/quests/generate', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Generated quest:', res.data); // Debug response
      setQuests([...quests, res.data]);
      setMessage('New quest generated!');
    } catch (err) {
      console.error('Generate error:', err.response); // Debug error
      setMessage(err.response?.data?.msg || 'Error generating quest');
    }
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  return (
    <div>
      <h2>Your Quests</h2>
      <button onClick={generateQuest}>Generate New Quest</button>
      {message && <p>{message}</p>}
      <ul>
        {quests.map((quest) => (
          <li key={quest._id}>
            <strong>{quest.title}</strong>: {quest.description} ({quest.points} points)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Quest;