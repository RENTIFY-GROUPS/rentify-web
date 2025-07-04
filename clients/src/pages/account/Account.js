import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FaCheckCircle, FaTimesCircle, FaUserCircle, FaIdCard, FaFileAlt } from 'react-icons/fa';

const Account = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    avatar: null,
    avatarPreview: '',
    idDocument: null,
    idDocumentPreview: '',
    ownershipProof: null,
    ownershipProofPreview: '',
    role: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        const user = res.data;
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          password: '',
          avatar: null,
          avatarPreview: user.avatar || '',
          idDocument: null,
          idDocumentPreview: user.idDocument || '',
          ownershipProof: null,
          ownershipProofPreview: user.ownershipProof || '',
          role: user.role || ''
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setMessage('Failed to load profile');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const onChange = e => {
    if (e.target.name === 'avatar') {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        avatar: file,
        avatarPreview: URL.createObjectURL(file)
      });
    } else if (e.target.name === 'idDocument') {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        idDocument: file,
        idDocumentPreview: URL.createObjectURL(file)
      });
    } else if (e.target.name === 'ownershipProof') {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        ownershipProof: file,
        ownershipProofPreview: URL.createObjectURL(file)
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    setMessage('');
    const data = new FormData();
    if (formData.name) data.append('name', formData.name);
    if (formData.email) data.append('email', formData.email);
    if (formData.phone) data.append('phone', formData.phone);
    if (formData.password) data.append('password', formData.password);
    if (formData.avatar) data.append('avatar', formData.avatar);
    if (formData.idDocument) data.append('idDocument', formData.idDocument);
    if (formData.ownershipProof) data.append('ownershipProof', formData.ownershipProof);

    try {
      const res = await api.put('/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(res.data.message || 'Profile updated successfully');
      setFormData({ ...formData, password: '' });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to update profile');
    }
  };

  // Calculate profile completeness
  const calculateCompleteness = () => {
    let completedFields = 0;
    const totalFields = 5; // Name, Email, Phone, Avatar, Role

    if (formData.name) completedFields++;
    if (formData.email) completedFields++;
    if (formData.phone) completedFields++;
    if (formData.avatarPreview) completedFields++;
    if (formData.role) completedFields++;

    if (formData.role === 'landlord') {
      // Add landlord specific fields
      if (formData.idDocumentPreview) completedFields++;
      if (formData.ownershipProofPreview) completedFields++;
      // Adjust total fields for landlord
      return Math.round(((completedFields / (totalFields + 2)) * 100));
    }

    return Math.round(((completedFields / totalFields) * 100));
  };

  const profileCompleteness = calculateCompleteness();

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Profile</h2>
      {message && <p className={`mb-4 p-3 rounded-md ${message.includes('Failed') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{message}</p>}

      {/* Profile Completeness Meter */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Profile Completeness</h3>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full text-xs flex items-center justify-center text-white"
            style={{ width: `${profileCompleteness}%` }}
          >
            {profileCompleteness}%
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Complete your profile to unlock all features!</p>
      </div>

      {/* Verification Badges */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Verification Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            {formData.email ? <FaCheckCircle className="text-green-500 mr-2" /> : <FaTimesCircle className="text-red-500 mr-2" />}
            <span className="font-medium">Email Verified</span>
          </div>
          <div className="flex items-center">
            {formData.avatarPreview ? <FaCheckCircle className="text-green-500 mr-2" /> : <FaTimesCircle className="text-red-500 mr-2" />}
            <span className="font-medium">Profile Photo Added</span>
          </div>
          {formData.role === 'landlord' && (
            <>
              <div className="flex items-center">
                {formData.idDocumentPreview ? <FaCheckCircle className="text-green-500 mr-2" /> : <FaTimesCircle className="text-red-500 mr-2" />}
                <span className="font-medium">ID Verified</span>
              </div>
              <div className="flex items-center">
                {formData.ownershipProofPreview ? <FaCheckCircle className="text-green-500 mr-2" /> : <FaTimesCircle className="text-red-500 mr-2" />}
                <span className="font-medium">Ownership Verified</span>
              </div>
            </>
          )}
        </div>
      </div>

      <form onSubmit={onSubmit} encType="multipart/form-data" className="space-y-6">
        {/* General Profile Information */}
        <div className="bg-gray-50 p-5 rounded-lg shadow-inner">
          <h3 className="text-2xl font-bold mb-4 text-gray-700">General Information</h3>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Password (leave blank to keep current)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Profile Avatar</label>
            {formData.avatarPreview && (
              <img src={formData.avatarPreview} alt="Avatar Preview" className="w-32 h-32 mb-3 rounded-full object-cover border-4 border-blue-300 shadow-md" />
            )}
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={onChange}
              className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        {/* Landlord Specific Documents */}
        {formData.role === 'landlord' && (
          <div className="bg-gray-50 p-5 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold mb-4 text-gray-700">Landlord Documents</h3>
            <div>
              <label className="block mb-2 font-semibold text-gray-700">ID Document</label>
              {formData.idDocumentPreview && (
                <img src={formData.idDocumentPreview} alt="ID Document Preview" className="w-full h-48 object-contain mb-3 border border-gray-300 rounded-lg" />
              )}
              <input
                type="file"
                name="idDocument"
                accept="image/*,application/pdf"
                onChange={onChange}
                className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div className="mt-6">
              <label className="block mb-2 font-semibold text-gray-700">Proof of Ownership</label>
              {formData.ownershipProofPreview && (
                <img src={formData.ownershipProofPreview} alt="Ownership Proof Preview" className="w-full h-48 object-contain mb-3 border border-gray-300 rounded-lg" />
              )}
              <input
                type="file"
                name="ownershipProof"
                accept="image/*,application/pdf"
                onChange={onChange}
                className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
        )}

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Account;
