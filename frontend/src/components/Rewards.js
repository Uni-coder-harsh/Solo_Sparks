import { useState, useEffect } from 'react';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_API_URL;

const rewardIcons = {
  profile_boost: '/icons/boost.png',
  exclusive_prompt: '/icons/prompt.png',
  cosmic_theme: '/icons/cosmic.png',
  badge: '/icons/badge.png',
  // Add more as needed
};

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/rewards`);
        setRewards(res.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load rewards');
      }
    };
    fetchRewards();
  }, []);

  const redeemReward = async (id) => {
    try {
      await axios.post(`${backendUrl}/api/rewards/redeem/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Reward redeemed!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Redemption failed');
    }
  };

  return (
    <div className="container mx-auto p-6 bg-cosmic-gray/80 rounded-lg shadow-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {rewards.map(reward => (
        <div key={reward._id} className="flex flex-col items-center bg-space-black rounded-xl p-6 shadow-lg">
          <img src={rewardIcons[reward.type] || '/icons/default.png'} alt={reward.type} className="w-16 h-16 mb-2" />
          <h3 className="text-xl font-semibold text-stellar-gold">{reward.name}</h3>
          <p className="text-nebula-white">{reward.description}</p>
          <p className="text-cosmic-gold">Cost: {reward.cost} Spark Points</p>
          <button onClick={() => redeemReward(reward._id)} className="btn-celestial mt-2">Redeem</button>
        </div>
      ))}
    </div>
  );
};

export default Rewards;