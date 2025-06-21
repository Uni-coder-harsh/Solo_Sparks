import { useEffect, useState } from 'react';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_API_URL;

const RewardsStore = () => {
  const [rewards, setRewards] = useState([]);
  const [error, setError] = useState('');
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user points
        const userRes = await axios.get(`${backendUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setPoints(userRes.data.sparkPoints || 0);

        // Fetch rewards from rewardstore
        const rewardsRes = await axios.get(`${backendUrl}/api/rewardstore`);
        setRewards(rewardsRes.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load rewards store');
      }
    };
    fetchData();
  }, []);

  const redeem = async (reward) => {
    if (points < reward.cost) {
      setError('Not enough Spark Points to redeem this reward.');
      return;
    }
    try {
      // You can implement a redeem endpoint as needed
      await axios.post(`${backendUrl}/api/rewards/redeem/${reward._id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPoints(points - reward.cost);
      setError('');
      alert('Reward redeemed!');
    } catch (err) {
      setError(err.response?.data?.msg || 'Redemption failed');
    }
  };

  return (
    <div className="container mx-auto p-6 bg-cosmic-gray/80 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-4 text-cosmic-blue">Rewards Store</h2>
      <p className="mb-4 text-nebula-white">Your Spark Points: <span className="font-bold">{points}</span></p>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.length === 0 && <div className="text-nebula-white">No rewards available.</div>}
        {rewards.map(reward => (
          <div key={reward._id} className="flex flex-col items-center bg-space-black rounded-xl p-6 shadow-lg">
            {reward.imageUrl ? (
              <img src={reward.imageUrl} alt={reward.name} className="w-24 h-24 mb-2 object-cover rounded" />
            ) : (
              <div className="w-24 h-24 mb-2 flex items-center justify-center bg-gray-700 text-nebula-white rounded">
                No Image
              </div>
            )}
            <h3 className="text-xl font-semibold text-stellar-gold">{reward.name}</h3>
            <p className="text-nebula-white">{reward.description}</p>
            <p className="text-cosmic-gold">Cost: {reward.cost} Spark Points</p>
            <button
              onClick={() => redeem(reward)}
              className="btn-celestial mt-2"
              disabled={points < reward.cost}
            >
              Redeem
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardsStore;