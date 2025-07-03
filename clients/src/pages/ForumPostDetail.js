import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { isAuthenticated } from '../../utils/auth';

export default function ForumPostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get(`/forum/${id}`);
        setPost(res.data);
      } catch (err) {
        setError('Failed to load forum post. Please try again later.');
        toast.error('Failed to load forum post.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      toast.error('Please log in to comment.');
      return;
    }
    try {
      const res = await API.post(`/forum/${id}/comments`, { content: newComment });
      setPost(prevPost => ({
        ...prevPost,
        comments: [...prevPost.comments, res.data]
      }));
      setNewComment('');
      toast.success('Comment added successfully!');
    } catch (err) {
      toast.error('Failed to add comment. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-xl text-blue-600">Loading post...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-xl text-red-600">{error}</p>;
  }

  if (!post) {
    return <p className="text-center mt-10 text-xl text-gray-600">Post not found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">{post.title}</h1>
        <p className="text-gray-700 text-sm mb-4">By {post.user.name} on {new Date(post.createdAt).toLocaleDateString()} | Category: {post.category} | Views: {post.views}</p>
        <p className="text-gray-800">{post.content}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Comments ({post.comments.length})</h2>
        <div className="space-y-4 mb-6">
          {post.comments.length === 0 ? (
            <p>No comments yet. Be the first to comment!</p>
          ) : (
            post.comments.map(comment => (
              <div key={comment._id} className="border-b pb-4 last:border-b-0">
                <p><strong>{comment.user.name}:</strong> {comment.content}</p>
                <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleCommentSubmit} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"
          ></textarea>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">
            Add Comment
          </button>
        </form>
      </div>
    </div>
  );
}