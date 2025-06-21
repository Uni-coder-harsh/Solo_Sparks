import { useEffect, useState } from 'react';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_API_URL;

const QuestDisplay = () => {
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/quests`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setQuests(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuests();
  }, []);

  return (
    <div className="bg-cosmic-black text-nebula-white p-6">
      <h2 className="text-3xl font-celestial text-stellar-gold">Daily Quests</h2>
      {quests.map(quest => (
        <div key={quest._id} className="bg-cosmic-gray/70 p-4 mt-4 rounded-lg">
          <h3 className="text-xl font-orbitron">{quest.title}</h3>
          <p className="text-nebula-white">{quest.description}</p>
          <p className="text-nebula-white">Points: {quest.points}</p>
        </div>
      ))}
    </div>
  );
};

export default QuestDisplay;