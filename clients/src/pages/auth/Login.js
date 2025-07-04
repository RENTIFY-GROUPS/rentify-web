import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, verify2fa } from '../../utils/auth';
import { toast } from 'react-toastify';
import API from '../../utils/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [show2faInput, setShow2faInput] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [userIdFor2fa, setUserIdFor2fa] = useState(null);
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [emailOtpEnabled, setEmailOtpEnabled] = useState(false);
  const [selected2faMethod, setSelected2faMethod] = useState(''); // 'totp' or 'email'
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await login({ email, password });
      if (result.twoFactorRequired) {
        setShow2faInput(true);
        setUserIdFor2fa(result.userId);
        setTotpEnabled(result.totpEnabled);
        setEmailOtpEnabled(result.emailOtpEnabled);
        setSuccess('2FA required. Please select a method and enter your token.');
      } else {
        setSuccess('Login successful!');
        setTimeout(() => {
          navigate('/'); // Redirect to home or dashboard after login
        }, 1000);
      }
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handle2faSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (selected2faMethod === 'totp') {
        await verify2fa(userIdFor2fa, twoFactorToken);
      } else if (selected2faMethod === 'email') {
        await API.post('/auth/2fa/email/verify-otp', { userId: userIdFor2fa, otp: twoFactorToken });
      }
      setSuccess('2FA verified. Login successful!');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setError(err.message || '2FA verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}

      {!show2faInput ? (
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      ) : (
        <form onSubmit={handle2faSubmit}>
          <h3 className="text-xl font-bold mb-4">Two-Factor Authentication</h3>
          <p className="mb-4">Please select your 2FA method and enter the token.</p>

          {(totpEnabled || emailOtpEnabled) && (
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Select 2FA Method:</label>
              {totpEnabled && (
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    className="form-radio"
                    name="2faMethod"
                    value="totp"
                    checked={selected2faMethod === 'totp'}
                    onChange={() => setSelected2faMethod('totp')}
                  />
                  <span className="ml-2">Authenticator App</span>
                </label>
              )}
              {emailOtpEnabled && (
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="2faMethod"
                    value="email"
                    checked={selected2faMethod === 'email'}
                    onChange={() => setSelected2faMethod('email')}
                  />
                  <span className="ml-2">Email OTP</span>
                </label>
              )}
            </div>
          )}

          {selected2faMethod === 'email' && (
            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                try {
                  await API.post('/auth/2fa/email/request-otp', { userId: userIdFor2fa });
                  toast.success('Email OTP sent. Check your inbox.');
                } catch (err) {
                  toast.error(err.response?.data?.message || 'Failed to send Email OTP.');
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 disabled:opacity-50 mb-4"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Request Email OTP'}
            </button>
          )}

          <label className="block mb-2 font-semibold" htmlFor="twoFactorToken">2FA Token</label>
          <input
            id="twoFactorToken"
            type="text"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={twoFactorToken}
            onChange={(e) => setTwoFactorToken(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading || !selected2faMethod}
          >
            {loading ? 'Verifying...' : 'Verify 2FA'}
          </button>
        </form>
      )}

      <div className="mt-4 text-center">
        <p>
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
