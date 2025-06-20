import { useState, useEffect } from 'react';
import axios from 'axios';

const Analytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let interval;
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/analytics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setData(res.data);
      } catch (err) {
        setData(null);
      }
    };
    fetchAnalytics();
    interval = setInterval(fetchAnalytics, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="text-nebula-white">Loading analytics...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-cosmic-gray/80 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-celestial text-celestial-glow mb-4">Cosmic Trends</h2>
      <p className="text-nebula-white mb-2">Total Users: <span className="font-bold">{data.totalUsers}</span></p>
      <p className="text-nebula-white mb-2">Total Quests Completed: <span className="font-bold">{data.totalQuests}</span></p>
      <p className="text-nebula-white mb-2">Most Popular Mood: <span className="font-bold">{data.popularMood}</span></p>
      {/* Add more analytics as needed */}
    </div>
  );
};

export default Analytics;