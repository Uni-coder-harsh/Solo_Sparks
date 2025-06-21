import { useState, useEffect } from 'react';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_API_URL;

const Quest = () => {
  const [quests, setQuests] = useState([]);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [response, setResponse] = useState('');
  const [sparkPoints, setSparkPoints] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState({ completions: 0, growth: 0 });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questsRes, profileRes] = await Promise.all([
          axios.get(`${backendUrl}/api/quests`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
          axios.get(`${backendUrl}/api/auth/me`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        ]);
        setQuests(questsRes.data);
        setSparkPoints(profileRes.data.sparkPoints || 0);
        setRewards(profileRes.data.rewards || []);
        setAnalytics(profileRes.data.analytics || { completions: 0, growth: 0 });
        setError('');
      } catch (err) {
        setError(err.response?.data?.msg || 'Fetch failed');
      }
    };
    fetchData();
  }, []);

  const generateQuest = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/quests/generate`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setQuests([...quests, res.data]);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to generate quest');
    }
  };

  const completeQuest = async () => {
    try {
      if (!response.trim()) {
        setError('Response is required');
        return;
      }
      if (!selectedQuest || !selectedQuest._id) {
        setError('Invalid quest selected');
        return;
      }
      const formData = new FormData();
      formData.append('response', response);
      if (file) formData.append('photo', file);
      const res = await axios.post(
        `${backendUrl}/api/quests/complete/${selectedQuest._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setQuests(quests.filter(q => q._id !== selectedQuest._id));
      setSelectedQuest(null);
      setResponse('');
      setSparkPoints(res.data.updatedPoints);
      setRewards(res.data.rewards);
      setAnalytics(prev => ({
        completions: res.data.analytics?.completions || prev.completions,
        growth: res.data.analytics?.growth || prev.growth
      }));
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to complete quest');
    }
  };

  const redeemReward = async (rewardId) => {
    try {
      const res = await axios.post(`${backendUrl}/api/auth/redeem/${rewardId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSparkPoints(res.data.sparkPoints);
      setRewards(res.data.rewards);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Redemption failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cosmic-black via-space-purple to-midnight-blue text-nebula-white p-6">
      <h2 className="text-4xl font-celestial mb-6 text-stellar-gold">Celestial Quests</h2>
      <p className="mb-4"><span className="font-orbitron">Spark Points:</span> {sparkPoints}</p>
      <p className="mb-4"><span className="font-orbitron">Completions:</span> {analytics.completions}</p>
      <p className="mb-4"><span className="font-orbitron">Growth:</span> {analytics.growth}%</p>
      {error && <p className="text-red-400 mt-2">{error}</p>}
      <button onClick={generateQuest} className="bg-stellar-gold hover:bg-cosmic-gold text-cosmic-black font-bold py-2 px-6 rounded-lg mb-4">Generate Quest</button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quests.map(quest => (
          <div key={quest._id} className="bg-cosmic-gray/70 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-orbitron text-nebula-white">{quest.title}</h3>
            <p className="text-nebula-white">{quest.description}</p>
            <p><span className="font-orbitron text-nebula-white">Points:</span> {quest.points}</p>
            <button onClick={() => setSelectedQuest(quest)} className="mt-2 bg-green-700 hover:bg-green-900 text-nebula-white py-1 px-3 rounded">Complete</button>
          </div>
        ))}
      </div>
      {selectedQuest && (
        <div className="mt-4 p-4 bg-cosmic-gray/70 rounded-lg shadow-lg">
          <h3 className="text-xl font-orbitron text-nebula-white">{selectedQuest.title}</h3>
          <textarea value={response} onChange={(e) => setResponse(e.target.value)} className="w-full p-2 bg-space-black border border-stellar-gold rounded-lg text-nebula-white mt-2" placeholder="Enter your reflection..." />
          <input
            type="file"
            accept="image/*,audio/*"
            className="mt-2 block"
            onChange={e => setFile(e.target.files[0])}
          />
          <button onClick={completeQuest} className="mt-2 bg-stellar-gold hover:bg-cosmic-gold text-cosmic-black font-bold py-2 px-6 rounded-lg">Submit to Cosmos</button>
        </div>
      )}
      <div className="mt-4">
        <h3 className="font-orbitron text-xl text-nebula-white">Rewards</h3>
        {rewards.length > 0 ? rewards.map(r => (
          <button key={r} onClick={() => redeemReward(r)} className="mt-2 bg-cosmic-purple hover:bg-space-purple text-nebula-white py-1 px-3 rounded-lg">Redeem {r}</button>
        )) : <p className="text-gray-500">No rewards available</p>}
      </div>
    </div>
  );
};

export default Quest;