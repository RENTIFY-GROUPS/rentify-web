import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import { toast } from 'react-toastify';

export default function ForumList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get('/forum');
        setPosts(res.data);
      } catch (err) {
        setError('Failed to load forum posts. Please try again later.');
        toast.error('Failed to load forum posts.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-xl text-blue-600">Loading forum posts...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-xl text-red-600">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Community Forum</h1>
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-center text-xl text-gray-600">No forum posts yet. Be the first to start a discussion!</p>
        ) : (
          posts.map(post => (
            <div key={post._id} className="bg-white p-6 rounded-lg shadow-md">
              <Link to={`/forum/${post._id}`} className="text-xl font-semibold text-blue-600 hover:underline">
                {post.title}
              </Link>
              <p className="text-gray-700 text-sm mt-1">By {post.user.name} on {new Date(post.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-600 mt-2">Category: {post.category} | Views: {post.views} | Comments: {post.comments.length}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}