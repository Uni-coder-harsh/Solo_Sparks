import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const isLoggedIn = !!localStorage.getItem('token');
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-cosmic-black/80 shadow-lg z-20">
      <div className="flex justify-between items-center px-8 py-4">
        <Link to="/" className="text-2xl font-celestial text-stellar-gold">Solo Sparks</Link>
        <button
          className="md:hidden text-nebula-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
        <div className={`flex-col md:flex-row md:flex gap-6 ${menuOpen ? 'flex' : 'hidden'} md:items-center md:static absolute top-16 left-0 w-full md:w-auto bg-cosmic-black/90 md:bg-transparent`}>
          <Link to="/" className="text-nebula-white hover:text-stellar-gold px-4 py-2 block">Home</Link>
          {isLoggedIn ? (
            <>
              <Link to="/quests" className="text-nebula-white hover:text-stellar-gold px-4 py-2 block">Quests</Link>
              <Link to="/rewards-store" className="text-nebula-white hover:text-stellar-gold px-4 py-2 block">Reward Store</Link>
              <Link to="/analytics" className="text-nebula-white hover:text-stellar-gold px-4 py-2 block">Trends</Link>
              <Link to="/profile" className="text-nebula-white hover:text-stellar-gold px-4 py-2 block">Profile</Link>
              <button onClick={handleLogout} className="text-nebula-white hover:text-red-400 px-4 py-2 block text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-nebula-white hover:text-stellar-gold px-4 py-2 block">Login</Link>
              <Link to="/register" className="text-nebula-white hover:text-stellar-gold px-4 py-2 block">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;