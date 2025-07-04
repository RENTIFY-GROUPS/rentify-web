import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../utils/auth';
import { toast } from 'react-toastify';

export default function Register() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('tenant');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');
    try {
      await register({ name, email, phone, password, role, referralCode });
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setFormError(err.message || 'Failed to register');
      toast.error(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    setStep(prevStep => prevStep - 1);
  };

  // Placeholder for Google Login - will keep it as is for now
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Register</h2>
      {error && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}

      {/* Progress Tracker */}
      <div className="mb-6 flex justify-between items-center">
        <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
        <div className="mx-2 text-gray-500">Step {step} of 2</div>
        <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            <p className="text-center text-gray-600 mb-6">Tell us a bit about yourself.</p>
            <label className="block mb-2 font-semibold text-gray-700" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label className="block mb-2 font-semibold text-gray-700" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="block mb-2 font-semibold text-gray-700" htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <label className="block mb-2 font-semibold text-gray-700" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={handleNext}
              className={`w-full bg-blue-600 text-white p-3 rounded-lg ${formError ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} transition-colors duration-200`}
              disabled={formError}
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-center text-gray-600 mb-6">Are you looking to rent or list a property?</p>
            <label className="block mb-2 font-semibold text-gray-700" htmlFor="role">I am a:</label>
            <select
              id="role"
              className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="tenant">Tenant (Looking to rent)</option>
              <option value="landlord">Landlord (Property Owner)</option>
            </select>
            <label className="block mb-2 font-semibold text-gray-700" htmlFor="referralCode">Referral Code (Optional)</label>
            <input
              id="referralCode"
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="w-1/2 mr-2 bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-1/2 ml-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Google Login - kept outside the steps for now */}
      <div className="text-center mt-6">
        <p className="mb-2 text-gray-600">Or register with Google</p>
        <div id="googleSignInButton"></div>
      </div>
    </div>
  );
}