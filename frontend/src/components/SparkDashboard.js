import { useEffect, useState } from 'react';
import axios from 'axios';

const SparkDashboard = () => {
  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setPoints(res.data.sparkPoints || 0);
        setRewards(res.data.rewards || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-cosmic-black text-nebula-white p-6">
      <h2 className="text-3xl font-celestial text-stellar-gold">Spark Points</h2>
      <p>Points: {points}</p>
      <h3 className="text-xl font-orbitron">Available Rewards</h3>
      {rewards.map(r => <p key={r} className="text-nebula-white">{r}</p>)}
    </div>
  );
};

export default SparkDashboard;