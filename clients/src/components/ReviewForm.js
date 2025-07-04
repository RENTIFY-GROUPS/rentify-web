import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ propertyId, landlordId, onReviewSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/reviews', {
        propertyId,
        landlordId,
        rating,
        comment
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onReviewSubmit(res.data);
      setRating(5);
      setComment('');
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Leave a Review</h3>
      {error && <div className="error">{error}</div>}
      <div>
        <label>Rating</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value={5}>5 Stars</option>
          <option value={4}>4 Stars</option>
          <option value={3}>3 Stars</option>
          <option value={2}>2 Stars</option>
          <option value={1}>1 Star</option>
        </select>
      </div>
      <div>
        <label>Comment</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;