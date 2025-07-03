import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';

export default function RoommateQuestionnaire() {
  const [profile, setProfile] = useState({
    gender: '',
    age: '',
    occupation: '',
    smoking: false,
    pets: false,
    sleepSchedule: '',
    cleanliness: '',
    socialHabits: '',
    budget: '',
    locationPreference: '',
    moveInDate: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/roommates/me');
        setProfile(res.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // Profile not found, so it's a new user
          setProfile({
            gender: '',
            age: '',
            occupation: '',
            smoking: false,
            pets: false,
            sleepSchedule: '',
            cleanliness: '',
            socialHabits: '',
            budget: '',
            locationPreference: '',
            moveInDate: '',
            bio: '',
          });
        } else {
          setError('Failed to load profile. Please try again.');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/roommates', profile);
      toast.success('Roommate profile saved successfully!');
    } catch (err) {
      toast.error('Failed to save profile. Please check your inputs.');
      console.error(err);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-xl text-blue-600">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-xl text-red-600">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Roommate Questionnaire</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select name="gender" value={profile.gender} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full">
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input type="number" name="age" value={profile.age} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Occupation</label>
          <input type="text" name="occupation" value={profile.occupation} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full" />
        </div>
        <div className="flex items-center">
          <input type="checkbox" name="smoking" checked={profile.smoking} onChange={handleChange} className="form-checkbox" />
          <label className="ml-2 text-sm font-medium text-gray-700">Smoking</label>
        </div>
        <div className="flex items-center">
          <input type="checkbox" name="pets" checked={profile.pets} onChange={handleChange} className="form-checkbox" />
          <label className="ml-2 text-sm font-medium text-gray-700">Pets</label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sleep Schedule</label>
          <select name="sleepSchedule" value={profile.sleepSchedule} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full">
            <option value="">Select...</option>
            <option value="Early Bird">Early Bird</option>
            <option value="Night Owl">Night Owl</option>
            <option value="Flexible">Flexible</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cleanliness</label>
          <select name="cleanliness" value={profile.cleanliness} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full">
            <option value="">Select...</option>
            <option value="Very Clean">Very Clean</option>
            <option value="Moderately Clean">Moderately Clean</option>
            <option value="Relaxed">Relaxed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Social Habits</label>
          <select name="socialHabits" value={profile.socialHabits} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full">
            <option value="">Select...</option>
            <option value="Very Social">Very Social</option>
            <option value="Moderately Social">Moderately Social</option>
            <option value="Quiet">Quiet</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Budget (₦)</label>
          <input type="number" name="budget" value={profile.budget} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location Preference</label>
          <input type="text" name="locationPreference" value={profile.locationPreference} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Move-in Date</label>
          <input type="date" name="moveInDate" value={profile.moveInDate} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio (max 500 characters)</label>
          <textarea name="bio" value={profile.bio} onChange={handleChange} maxLength="500" rows="4" className="mt-1 p-2 border rounded-md w-full"></textarea>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">
          Save Profile
        </button>
      </form>
    </div>
  );
}