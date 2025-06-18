import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [message, setMessage] = useState('');
  const [userPoints, setUserPoints] = useState(0);

  const fetchRewards = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/rewards');
      setRewards(res.data);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Failed to load rewards');
    }
  };

  const fetchUserPoints = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please log in to view points');
      return;
    }
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserPoints(res.data.sparkPoints);
    } catch (err) {
      setMessage('Failed to load user points');
    }
  };

  const handleRedeem = async (rewardId, pointsCost) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please log in to redeem rewards');
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:5000/api/rewards/redeem/${rewardId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.msg);
      setUserPoints(userPoints - pointsCost);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Failed to redeem reward');
    }
  };

  useEffect(() => {
    fetchRewards();
    fetchUserPoints();
  }, []);

  return (
    <div className="card shadow-sm p-4 fade-in">
      <h2 className="card-title text-center mb-4" style={{ color: 'var(--primary-color)' }}>Rewards Store</h2>
      <p className="text-center mb-3">Your Spark Points: <strong>{userPoints}</strong></p>
      {message && <div className="alert alert-info">{message}</div>}
      <ul className="list-group rewards-list">
        {rewards.map((reward) => (
          <li key={reward._id} className="list-group-item reward-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{reward.name}</strong>: {reward.description} ({reward.pointsCost} points)
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleRedeem(reward._id, reward.pointsCost)}
            >
              Redeem
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Rewards;