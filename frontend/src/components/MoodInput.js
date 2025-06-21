import { useState } from 'react';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_API_URL;

const MoodInput = () => {
  const [mood, setMood] = useState('');
  const [needs, setNeeds] = useState('');

  const updateMood = async () => {
    try {
      await axios.put(`${backendUrl}/api/auth/me`, { mood, emotionalNeeds: needs.split(',') }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-cosmic-black text-nebula-white p-6">
      <h2 className="text-3xl font-celestial text-stellar-gold">Update Mood</h2>
      <select value={mood} onChange={e => setMood(e.target.value)} className="bg-space-black p-2 mt-2 w-full text-nebula-white">
        <option value="">Select Mood</option>
        <option value="Romantic">Romantic</option>
        <option value="Dreamy">Dreamy</option>
        <option value="Hopeful">Hopeful</option>
        <option value="Neutral">Neutral</option>
        <option value="Sad">Sad</option>
        <option value="Stressed">Stressed</option>
      </select>
      <input placeholder="Needs (e.g., love, peace)" onChange={e => setNeeds(e.target.value)} className="bg-space-black p-2 mt-2 w-full text-nebula-white" />
      <button onClick={updateMood} className="bg-stellar-gold text-cosmic-black p-2 mt-2">Update</button>
    </div>
  );
};

export default MoodInput;