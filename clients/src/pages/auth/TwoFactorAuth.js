import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import { toast } from 'react-toastify';

export default function TwoFactorAuth() {
  const [secret, setSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [token, setToken] = useState('');
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [isEmailOtpEnabled, setIsEmailOtpEnabled] = useState(false);
  const [isSmsOtpEnabled, setIsSmsOtpEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const check2faStatus = async () => {
      try {
        const response = await API.get('/auth/2fa/status');
        setIs2faEnabled(response.data.twoFactorEnabled);
        setIsEmailOtpEnabled(response.data.emailOtpEnabled);
        setIsSmsOtpEnabled(response.data.smsOtpEnabled); // Assuming backend sends this
      } catch (err) {
        console.error('Error checking 2FA status:', err);
        toast.error('Failed to load 2FA status.');
      }
    };
    check2faStatus();
  }, []);

  const handleSetup2fa = async () => {
    setLoading(true);
    try {
      const response = await API.post('/auth/2fa/setup');
      setSecret(response.data.secret);
      setQrCodeUrl(response.data.qrCodeUrl);
      toast.success('2FA setup initiated. Scan QR code.');
    } catch (err) {
      console.error('Error setting up 2FA:', err);
      toast.error(err.response?.data?.message || 'Failed to setup 2FA.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2fa = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/2fa/enable', { token });
      setIs2faEnabled(true);
      toast.success('2FA enabled successfully!');
      setSecret('');
      setQrCodeUrl('');
      setToken('');
    } catch (err) {
      console.error('Error enabling 2FA:', err);
      toast.error(err.response?.data?.message || 'Failed to enable 2FA.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2fa = async () => {
    setLoading(true);
    try {
      await API.post('/auth/2fa/disable');
      setIs2faEnabled(false);
      toast.success('2FA disabled successfully.');
    } catch (err) {
      console.error('Error disabling 2FA:', err);
      toast.error(err.response?.data?.message || 'Failed to disable 2FA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Two-Factor Authentication</h2>

      {/* Authenticator App (TOTP) Section */}
      <div className="mb-8 p-4 border rounded-lg">
        <h3 className="text-xl font-semibold mb-3">Authenticator App (TOTP)</h3>
        {is2faEnabled ? (
          <div>
            <p className="text-green-600 mb-4">TOTP is currently enabled.</p>
            <button
              onClick={handleDisable2fa}
              className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Disabling...' : 'Disable TOTP'}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-yellow-600 mb-4">TOTP is currently disabled.</p>
            {!qrCodeUrl ? (
              <button
                onClick={handleSetup2fa}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Setting up...' : 'Setup TOTP'}
              </button>
            ) : (
              <form onSubmit={handleEnable2fa}>
                <p className="mb-4">Scan the QR code with your authenticator app (e.g., Google Authenticator, Authy).</p>
                <div className="flex justify-center mb-4">
                  <img src={qrCodeUrl} alt="QR Code" />
                </div>
                <p className="mb-4 text-center text-sm text-gray-600">Secret: {secret}</p>
                <label className="block mb-2 font-semibold" htmlFor="token">Enter TOTP Token</label>
                <input
                  id="token"
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Enabling...' : 'Enable TOTP'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Email OTP Section */}
      <div className="p-4 border rounded-lg mb-8">
        <h3 className="text-xl font-semibold mb-3">Email One-Time Password (OTP)</h3>
        {isEmailOtpEnabled ? (
          <div>
            <p className="text-green-600 mb-4">Email OTP is currently enabled.</p>
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  await API.post('/auth/2fa/email/disable');
                  setIsEmailOtpEnabled(false);
                  toast.success('Email OTP disabled successfully.');
                } catch (err) {
                  console.error('Error disabling Email OTP:', err);
                  toast.error(err.response?.data?.message || 'Failed to disable Email OTP.');
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Disabling...' : 'Disable Email OTP'}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-yellow-600 mb-4">Email OTP is currently disabled.</p>
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  await API.post('/auth/2fa/email/request-otp');
                  toast.success('Email OTP sent. Check your inbox.');
                } catch (err) {
                  console.error('Error requesting Email OTP:', err);
                  toast.error(err.response?.data?.message || 'Failed to request Email OTP.');
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Request Email OTP'}
            </button>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              try {
                await API.post('/auth/2fa/email/verify-otp', { otp: token });
                setIsEmailOtpEnabled(true);
                toast.success('Email OTP enabled successfully!');
                setToken('');
              } catch (err) {
                console.error('Error verifying Email OTP:', err);
                toast.error(err.response?.data?.message || 'Failed to verify Email OTP.');
              } finally {
                setLoading(false);
              }
            }}>
              <label className="block mb-2 font-semibold" htmlFor="emailOtpToken">Enter Email OTP</label>
              <input
                id="emailOtpToken"
                type="text"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Enable Email OTP'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* SMS OTP Section */}
      <div className="p-4 border rounded-lg">
        <h3 className="text-xl font-semibold mb-3">SMS One-Time Password (OTP)</h3>
        {isSmsOtpEnabled ? (
          <div>
            <p className="text-green-600 mb-4">SMS OTP is currently enabled.</p>
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  await API.post('/auth/2fa/sms/disable');
                  setIsSmsOtpEnabled(false);
                  toast.success('SMS OTP disabled successfully.');
                } catch (err) {
                  console.error('Error disabling SMS OTP:', err);
                  toast.error(err.response?.data?.message || 'Failed to disable SMS OTP.');
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Disabling...' : 'Disable SMS OTP'}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-yellow-600 mb-4">SMS OTP is currently disabled.</p>
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  await API.post('/auth/2fa/sms/request-otp');
                  toast.success('SMS OTP sent. Check your phone.');
                } catch (err) {
                  console.error('Error requesting SMS OTP:', err);
                  toast.error(err.response?.data?.message || 'Failed to request SMS OTP.');
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Request SMS OTP'}
            </button>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              try {
                await API.post('/auth/2fa/sms/verify-otp', { otp: token });
                setIsSmsOtpEnabled(true);
                toast.success('SMS OTP enabled successfully!');
                setToken('');
              } catch (err) {
                console.error('Error verifying SMS OTP:', err);
                toast.error(err.response?.data?.message || 'Failed to verify SMS OTP.');
              } finally {
                setLoading(false);
              }
            }}>
              <label className="block mb-2 font-semibold" htmlFor="smsOtpToken">Enter SMS OTP</label>
              <input
                id="smsOtpToken"
                type="text"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Enable SMS OTP'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
