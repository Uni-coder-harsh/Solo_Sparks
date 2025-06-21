import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const moods = ['Romantic', 'Dreamy', 'Hopeful', 'Neutral', 'Sad', 'Stressed'];
const backendUrl = process.env.REACT_APP_API_URL;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUser(res.data);
        setForm({
          name: res.data.name,
          mood: res.data.mood,
          emotionalNeeds: res.data.emotionalNeeds?.join(', ') || '',
        });
        setAvatarPreview(res.data.avatar || '/default-avatar.png');
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append('reflectionPhoto', file);
    try {
      const res = await axios.put(`${backendUrl}/api/auth/me`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setUser(res.data);
      setAvatarPreview(res.data.avatar || '/default-avatar.png');
    } catch (err) {
      alert('Failed to upload avatar');
    }
  };

  const handleEdit = () => setEditMode(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`${backendUrl}/api/auth/me`, {
        name: form.name,
        mood: form.mood,
        emotionalNeeds: form.emotionalNeeds // just a string, backend will parse
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEditMode(false);
      window.location.reload();
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  if (!user) return <div className="text-nebula-white">Loading...</div>;

  return (
    <div className="max-w-2xl w-full mx-auto mt-10 p-8 bg-cosmic-gray/80 rounded-xl shadow-2xl flex flex-col items-center overflow-hidden">
      <div className="relative mb-4">
        <img
          src={
            avatarPreview
              ? avatarPreview.startsWith('/uploads/')
                ? backendUrl + avatarPreview
                : avatarPreview
              : '/default-avatar.png'
          }
          alt="Avatar"
          className="w-32 h-32 rounded-full border-4 border-stellar-gold shadow-lg object-cover"
        />
        <button
          className="absolute bottom-0 right-0 bg-stellar-gold rounded-full p-2 text-xs"
          onClick={() => fileInputRef.current.click()}
          title="Change avatar"
        >✏️</button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>
      {editMode ? (
        <>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mb-2 p-2 rounded w-full text-black"
            placeholder="Name"
          />
          <select
            name="mood"
            value={form.mood}
            onChange={handleChange}
            className="mb-2 p-2 rounded w-full text-black"
          >
            {moods.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input
            name="emotionalNeeds"
            value={form.emotionalNeeds}
            onChange={handleChange}
            className="mb-2 p-2 rounded w-full text-black"
            placeholder="Emotional Needs (comma separated)"
          />
          <button onClick={handleSave} className="btn-celestial mb-2">Save</button>
          <button onClick={() => setEditMode(false)} className="btn-celestial mb-2">Cancel</button>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-celestial text-celestial-glow mb-2 break-words">{user.name}</h2>
          <p className="text-nebula-white mb-2">Mood: <span className="font-bold">{user.mood}</span></p>
          <p className="text-nebula-white mb-2">Emotional Needs: <span className="font-bold">{user.emotionalNeeds?.join(', ')}</span></p>
          <p className="text-nebula-white mb-2">Spark Points: <span className="font-bold">{user.sparkPoints}</span></p>
          <p className="text-nebula-white mb-2">Completed Quests: <span className="font-bold">{user.analytics?.completions || 0}</span></p>
          <p className="text-nebula-white mb-2">Growth: <span className="font-bold">{user.analytics?.growth || 0}%</span></p>
          <button onClick={handleEdit} className="btn-celestial mb-2">Edit Profile</button>
        </>
      )}
      <div className="flex flex-wrap gap-4 mt-6">
        <a href="/quests" className="btn-celestial">Complete a Quest</a>
        <a href="/rewards-list" className="btn-celestial">Claim Rewards</a>
        <a href="/analytics" className="btn-celestial">See Trends</a>
      </div>
    </div>
  );
};

export default Profile;