import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_API_URL;

function validatePassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
}

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mood: '',
    personality: { loveType: '', openness: 0.5, extraversion: 0.5 },
    emotionalNeeds: []
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('personality.')) {
      const field = name.split('.')[1];
      setFormData({ ...formData, personality: { ...formData.personality, [field]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters, include uppercase, lowercase, number, and special character.');
      return;
    }
    try {
      const res = await axios.post(`${backendUrl}/api/auth/register`, formData);
      localStorage.setItem('token', res.data.token);
      window.location.href = '/profile';
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="container mx-auto p-6 bg-cosmic-gray/80 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-4 text-cosmic-blue">Register</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded-lg" />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded-lg" />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded-lg" minLength={8} maxLength={32} />
        <select name="mood" value={formData.mood} onChange={handleChange} className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded-lg">
          <option value="">Select Mood</option>
          {['Romantic', 'Dreamy', 'Hopeful', 'Neutral'].map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <input name="personality.loveType" placeholder="Love Type" value={formData.personality.loveType} onChange={handleChange} className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded-lg" />
        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg">Register</button>
      </form>
      <p className="mt-4 text-nebula-white">
        Already have an account? <Link to="/login" className="text-stellar-gold underline">Login here</Link>
      </p>
    </div>
  );
};

export default Register;