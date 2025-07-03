import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';

export default function RoommateMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await API.get('/roommates/matches');
        setMatches(res.data);
      } catch (err) {
        setError('Failed to load roommate matches. Please ensure your profile is complete.');
        toast.error('Failed to load roommate matches.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-xl text-blue-600">Loading matches...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-xl text-red-600">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Roommate Matches</h1>
      {matches.length === 0 ? (
        <p className="text-center text-xl text-gray-600">No matches found. Try adjusting your profile or check back later!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map(match => (
            <div key={match._id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{match.user.name}</h2>
              <p><strong>Age:</strong> {match.age}</p>
              <p><strong>Gender:</strong> {match.gender}</p>
              <p><strong>Occupation:</strong> {match.occupation}</p>
              <p><strong>Budget:</strong> ₦{match.budget.toLocaleString()}</p>
              <p><strong>Location Preference:</strong> {match.locationPreference || 'Any'}</p>
              <p><strong>Smoking:</strong> {match.smoking ? 'Yes' : 'No'}</p>
              <p><strong>Pets:</strong> {match.pets ? 'Yes' : 'No'}</p>
              <p><strong>Sleep Schedule:</strong> {match.sleepSchedule}</p>
              <p><strong>Cleanliness:</strong> {match.cleanliness}</p>
              <p><strong>Social Habits:</strong> {match.socialHabits}</p>
              <p className="mt-2 text-gray-600">{match.bio}</p>
              {/* Add a button to contact the match */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}