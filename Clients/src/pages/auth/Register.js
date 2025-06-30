import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../utils/auth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('tenant');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register({ name, email, phone, password, role });
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (response) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenId: response.tokenId, role }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        setError(data.message || 'Google login failed');
      }
    } catch (err) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold" htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label className="block mb-2 font-semibold" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="block mb-2 font-semibold" htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="tel"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <label className="block mb-2 font-semibold" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label className="block mb-2 font-semibold" htmlFor="role">Role</label>
        <select
          id="role"
          className="w-full p-2 border border-gray-300 rounded mb-6"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="tenant">Buyer/Renter</option>
          <option value="landlord">Property Owner/Vendor</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="text-center">
        <p className="mb-2">Or register with Google</p>
        <div id="googleSignInButton"></div>
      </div>
    </div>
  );
}
