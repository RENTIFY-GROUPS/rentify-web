import React, { useState } from 'react';
import { FaBug, FaLightbulb, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import API from '../utils/api';
import { getCurrentUser } from '../utils/auth';

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('bug');
  const [message, setMessage] = useState('');
  const user = getCurrentUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Feedback message cannot be empty.');
      return;
    }

    try {
      const payload = {
        type: feedbackType,
        message,
        page: window.location.pathname, // Capture current page
        browser: navigator.userAgent, // Capture browser info
        os: navigator.platform, // Capture OS info
      };

      await API.post('/feedback', payload);
      toast.success('Thank you for your feedback!');
      setIsOpen(false);
      setMessage('');
    } catch (err) {
      toast.error('Failed to submit feedback. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
          title="Give Feedback"
        >
          <FaLightbulb size={24} />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-80 flex flex-col">
          <div className="bg-gray-800 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Send Feedback</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <FaTimes size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              >
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="general">General Feedback</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                placeholder="Describe the bug or suggest a feature..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 font-medium"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FeedbackWidget;