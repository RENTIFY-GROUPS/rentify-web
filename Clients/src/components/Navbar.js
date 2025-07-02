import { Link } from 'react-router-dom';
import { useState } from 'react';
import { getCurrentUser, logout } from '../utils/auth';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Rentify</Link>
        <div className="hidden sm:flex space-x-4 items-center">
          <Link to="/listings" className="hover:underline">Listings</Link>
          <Link to="/compare-properties" className="hover:underline">Compare</Link>
          <>
            <Link to="/auctions" className="hover:underline">Auctions</Link>
            <Link to={user ? `/account` : `/login`} className="hover:underline">Profile</Link>
            {user ? (
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            ) : (
              <>
                <Link to="/login" className="hover:underline">Login</Link>
                <Link to="/register" className="hover:underline">Register</Link>
              </>
            )}
          </>
        </div>
        <div className="sm:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="sm:hidden mt-2 space-y-2">
          <Link to="/listings" className="block px-2 py-1 hover:underline">Listings</Link>
          <Link to="/compare-properties" className="block px-2 py-1 hover:underline">Compare</Link>
          <>
            <Link to="/auctions" className="block px-2 py-1 hover:underline">Auctions</Link>
            <Link to={user ? `/account` : `/login`} className="block px-2 py-1 hover:underline">Profile</Link>
            {user ? (
              <button onClick={handleLogout} className="block px-2 py-1 hover:underline text-left w-full">Logout</button>
            ) : (
              <>
                <Link to="/login" className="block px-2 py-1 hover:underline">Login</Link>
                <Link to="/register" className="block px-2 py-1 hover:underline">Register</Link>
              </>
            )}
          </>
        </div>
      )}
    </nav>
  );
}
