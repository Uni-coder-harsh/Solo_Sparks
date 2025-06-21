import { useEffect, useState } from 'react';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_API_URL;

const ProgressTracker = () => {
  const [growth, setGrowth] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/auth/me`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setGrowth(res.data.analytics?.growth || 0);
        setError('');
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load progress');
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-cosmic-black text-nebula-white p-6">
      <h2 className="text-3xl font-celestial text-stellar-gold">Growth Journey</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <div className="w-full bg-cosmic-gray/50 h-6 mt-2">
        <div style={{ width: `${growth}%` }} className="bg-stellar-gold h-6"></div>
      </div>
      <p>Growth: {growth}%</p>
    </div>
  );
};

export default ProgressTracker;