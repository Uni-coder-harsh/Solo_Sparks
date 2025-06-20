import { useEffect, useState } from 'react';
import axios from 'axios';

const RewardsStore = () => {
  const [rewards, setRewards] = useState([]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setPoints(res.data.sparkPoints || 0);
        setRewards(['Profile Boost (50)', 'Exclusive Prompt (100)']);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const redeem = async (reward) => {
    const cost = parseInt(reward.split('(')[1]);
    if (points >= cost) {
      try {
        await axios.post(`http://localhost:5000/api/auth/redeem/${reward.split(' ')[0]}`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="bg-cosmic-black text-nebula-white p-6">
      <h2 className="text-3xl font-celestial text-stellar-gold">Rewards Store</h2>
      {rewards.map(r => (
        <div key={r} className="bg-cosmic-gray/70 p-2 mt-2">
          <p>{r}</p>
          <button onClick={() => redeem(r)} className="bg-stellar-gold text-cosmic-black p-1">Redeem</button>
        </div>
      ))}
    </div>
  );
};

export default RewardsStore;