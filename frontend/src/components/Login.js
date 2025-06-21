import { useState } from 'react';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/api/auth/login`, formData);
      localStorage.setItem('token', res.data.token);
      window.location.href = '/profile';
    } catch (err) {
      console.error(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="container mx-auto p-6 bg-cosmic-gray/80 rounded-lg shadow-xl text-white">
      <h2 className="text-3xl font-bold mb-4 text-cosmic-blue">Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded-lg"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded-lg"
        />
        <button type="submit" className="bg-cosmic-blue hover:bg-cosmic-purple text-white font-bold py-2 px-6 rounded-lg">Login</button>
      </form>
    </div>
  );
};

export default Login;