import { useState, useEffect } from 'react';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_API_URL;

const Analytics = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let interval;
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/analytics`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setData(res.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load analytics');
      }
    };
    fetchAnalytics();
    interval = setInterval(fetchAnalytics, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-cosmic-black text-nebula-white p-6">
      <h2 className="text-3xl font-celestial text-stellar-gold">Cosmic Analytics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {data ? (
        <div>
          <p>Total Users: {data.totalUsers}</p>
          <p>Total Completed Quests: {data.totalQuests}</p>
          <p>Most Popular Mood: {data.popularMood}</p>
        </div>
      ) : (
        !error && <div>Loading...</div>
      )}
    </div>
  );
};

export default Analytics;