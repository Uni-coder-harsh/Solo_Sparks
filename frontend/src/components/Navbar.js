import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const isLoggedIn = !!localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-cosmic-black/80 shadow-lg z-20">
      <Link to="/" className="text-2xl font-celestial text-stellar-gold">Solo Sparks</Link>
      <div className="flex gap-6">
        <Link to="/" className="text-nebula-white hover:text-stellar-gold">Home</Link>
        {isLoggedIn ? (
          <>
            <Link to="/quests" className="text-nebula-white hover:text-stellar-gold">Quests</Link>
            <Link to="/rewards-store" className="text-nebula-white hover:text-stellar-gold">Reward Store</Link>
            <Link to="/analytics" className="text-nebula-white hover:text-stellar-gold">Trends</Link>
            <Link to="/profile" className="text-nebula-white hover:text-stellar-gold">Profile</Link>
            <button onClick={handleLogout} className="text-nebula-white hover:text-red-400">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-nebula-white hover:text-stellar-gold">Login</Link>
            <Link to="/register" className="text-nebula-white hover:text-stellar-gold">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;