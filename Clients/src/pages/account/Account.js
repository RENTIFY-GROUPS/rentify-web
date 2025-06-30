import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Account Profile</h2>
      {message && <p className="mb-4 text-red-600">{message}</p>}
      <form onSubmit={onSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password (leave blank to keep current)</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Avatar</label>
          {formData.avatarPreview && (
            <img src={formData.avatarPreview} alt="Avatar Preview" className="w-24 h-24 mb-2 rounded-full object-cover" />
          )}
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={onChange}
            className="w-full"
          />
        </div>
        {formData.role === 'landlord' && (
          <>
            <div className="mb-4">
              <label className="block mb-1">ID Document</label>
              {formData.idDocumentPreview && (
                <img src={formData.idDocumentPreview} alt="ID Document Preview" className="w-full mb-2" />
              )}
              <input
                type="file"
                name="idDocument"
                accept="image/*,application/pdf"
                onChange={onChange}
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Proof of Ownership</label>
              {formData.ownershipProofPreview && (
                <img src={formData.ownershipProofPreview} alt="Ownership Proof Preview" className="w-full mb-2" />
              )}
              <input
                type="file"
                name="ownershipProof"
                accept="image/*,application/pdf"
                onChange={onChange}
                className="w-full"
              />
            </div>
          </>
        )}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Account;
