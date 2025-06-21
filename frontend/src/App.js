import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CosmosBackground from './components/CosmosBackground';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Profile from './components/Profile';
import Quest from './components/Quest';
import Login from './components/Login';
import Register from './components/Register';
import Onboarding from './components/Onboarding';
import QuestDisplay from './components/QuestDisplay';
import SubmissionPortal from './components/SubmissionPortal';
import SparkDashboard from './components/SparkDashboard';
import RewardsStore from './components/RewardsStore';
import ProgressTracker from './components/ProgressTracker';
import MoodInput from './components/MoodInput';
import Rewards from './components/Rewards';
import Analytics from './components/Analytics';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-cosmic-black via-space-purple to-midnight-blue text-nebula-white relative">
        <CosmosBackground />
        <div className="relative z-10">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/quests" element={<Quest />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/quest-display" element={<QuestDisplay />} />
            <Route path="/submit" element={<SubmissionPortal />} />
            <Route path="/spark" element={<SparkDashboard />} />
            <Route path="/rewards-store" element={<RewardsStore />} />
            <Route path="/rewards-list" element={<Rewards />} />
            <Route path="/progress" element={<ProgressTracker />} />
            <Route path="/mood" element={<MoodInput />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;