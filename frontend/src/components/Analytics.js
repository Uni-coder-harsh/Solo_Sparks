import { useEffect, useState } from 'react';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_API_URL;

const Analytics = () => {
  const [trendingQuests, setTrendingQuests] = useState([]);
  const [trendingRewards, setTrendingRewards] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const [questsRes, rewardsRes] = await Promise.all([
          axios.get(`${backendUrl}/api/analytics/trending-quests`),
          axios.get(`${backendUrl}/api/analytics/trending-rewards`)
        ]);
        setTrendingQuests(questsRes.data);
        setTrendingRewards(rewardsRes.data);
        setError('');
      } catch (err) {
        setError('Failed to load trends');
      }
    };
    fetchTrends();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4 text-cosmic-blue">Trends</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-stellar-gold">Most Completed Quests</h3>
        <ul>
          {trendingQuests.map(q => (
            <li key={q._id}>{q._id} ({q.count} completions)</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-stellar-gold">Trending Rewards</h3>
        <ul>
          {trendingRewards.map(r => (
            <li key={r._id}>{r._id} ({r.count} redeemed)</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Analytics;