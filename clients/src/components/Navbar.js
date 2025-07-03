import { Link } from 'react-router-dom';
import { useState } from 'react';
import { getCurrentUser, logout } from '../utils/auth';
import { useTheme } from './context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { FaMoon, FaSun, FaAdjust, FaBars, FaTimes } from 'react-icons/fa';
import i18n from './i18n';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = getCurrentUser();
  const { theme, toggleTheme, highContrast, toggleHighContrast } = useTheme();
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">{t('welcome')}</Link>
        <div className="hidden sm:flex space-x-4 items-center">
          <Link to="/listings" className="hover:underline listings-link">{t('listings')}</Link>
          <Link to="/compare-properties" className="hover:underline">{t('compare')}</Link>
          <Link to="/wishlist" className="hover:underline">{t('my_wishlist')}</Link>
          <>
            <Link to="/auctions" className="hover:underline">{t('auctions')}</Link>
            <Link to={user ? `/account` : `/login`} className="hover:underline login-link">{t('profile')}</Link>
            {user ? (
              <button onClick={handleLogout} className="hover:underline">{t('logout')}</button>
            ) : (
              <>
                <Link to="/login" className="hover:underline login-link">{t('login')}</Link>
                <Link to="/register" className="hover:underline">{t('register')}</Link>
              </>
            )}
            <button onClick={toggleTheme} className="text-white ml-4">
              {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
            </button>
            <select
              value={currentLanguage}
              onChange={(e) => {
                i18n.changeLanguage(e.target.value);
                setCurrentLanguage(e.target.value);
              }}
              className="bg-blue-700 text-white p-1 rounded ml-4"
            >
              <option value="en">{t('english')}</option>
              <option value="pcm">{t('pidgin')}</option>
              <option value="yor">{t('yoruba')}</option>
              <option value="hau">{t('hausa')}</option>
              <option value="ibo">{t('igbo')}</option>
            </select>
          </>
        </div>
        <div className="sm:hidden flex items-center">
          <button onClick={toggleTheme} className="text-white mr-4" title={theme === 'light' ? t('toggle_dark_mode') : t('toggle_light_mode')}>
            {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
          </button>
          <button onClick={toggleHighContrast} className="text-white mr-2" title="Toggle High Contrast">
            <FaAdjust size={20} />
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none">
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="sm:hidden mt-2 space-y-2">
          <Link to="/listings" className="block px-2 py-1 hover:underline">Listings</Link>
          <Link to="/compare-properties" className="block px-2 py-1 hover:underline">Compare</Link>
          <Link to="/wishlist" className="block px-2 py-1 hover:underline">Wishlist</Link>
          <Link to="/help-center" className="hover:underline">Help Center</Link>
          <Link to="/forum" className="hover:underline">Forum</Link>
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
