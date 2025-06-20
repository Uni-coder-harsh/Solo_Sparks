import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] relative z-10"
    >
      <h1 className="text-5xl font-celestial text-celestial-glow mb-4 text-center">Welcome to Solo Sparks</h1>
      <p className="text-xl text-nebula-white mb-8 text-center max-w-2xl">
        <span className="text-stellar-gold">Solo Sparks</span> is a cosmic dating and self-growth platform where you embark on quests, earn spark points, and unlock celestial rewards. 
        <br />
        <span className="text-cosmic-blue">Explore the universe of your emotions, connect with others, and let your journey be guided by the stars.</span>
      </p>
      {!isLoggedIn ? (
        <>
          <Link to="/register" className="btn-celestial mb-4">Begin Your Journey</Link>
          <p className="text-nebula-white mb-2">Already have an account? <Link to="/login" className="text-stellar-gold underline">Login here</Link></p>
          <div className="mt-8 text-nebula-white text-center">
            <h2 className="text-2xl font-bold mb-2">What you can do:</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>🌠 Generate personalized quests based on your mood and needs</li>
              <li>💫 Complete quests and reflect with text, photo, or audio</li>
              <li>🌌 Earn spark points and unlock exclusive cosmic rewards</li>
              <li>🔭 Track your growth and see real-time trends in the community</li>
              <li>💖 Connect with like-minded souls on a celestial journey</li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center gap-4">
            <Link to="/profile" className="btn-celestial">View Your Profile</Link>
            <Link to="/quests" className="btn-celestial">Complete a Quest</Link>
            <Link to="/rewards-list" className="btn-celestial">Claim Rewards</Link>
            <Link to="/analytics" className="btn-celestial">See Real-Time Trends</Link>
          </div>
          <div className="mt-8 text-nebula-white text-center max-w-xl">
            <h2 className="text-2xl font-bold mb-2">Your Cosmic Dashboard</h2>
            <p>Track your spark points, completed quests, and mood. Unlock new rewards as you grow!</p>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Home;