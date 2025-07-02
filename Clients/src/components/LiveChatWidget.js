import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { FaComments, FaTimes } from 'react-icons/fa';

const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Check business hours (e.g., 9 AM to 5 PM, Monday to Friday)
    const checkBusinessHours = () => {
      const now = new Date();
      const day = now.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
      const hour = now.getHours();

      // Monday to Friday, 9 AM to 5 PM
      if (day >= 1 && day <= 5 && hour >= 9 && hour < 17) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    };

    checkBusinessHours();
    const interval = setInterval(checkBusinessHours, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen && isOnline) {
      const newSocket = io('http://localhost:5000'); // Connect to your backend socket.io
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to live chat');
        setMessages([{ sender: 'System', content: 'Welcome to live chat! How can I help you?' }]);
      });

      newSocket.on('message', (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from live chat');
        setMessages(prevMessages => [...prevMessages, { sender: 'System', content: 'Chat disconnected. Please reopen to reconnect.' }]);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isOpen, isOnline]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const message = { sender: 'User', content: newMessage };
      socket.emit('message', message);
      setMessages(prevMessages => [...prevMessages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          title="Open Live Chat"
        >
          <FaComments size={24} />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Live Chat {isOnline ? '(Online)' : '(Offline)'}</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <FaTimes size={20} />
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, index) => (
              <div key={index} className={`p-2 rounded-lg ${msg.sender === 'User' ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'}`}>
                <strong>{msg.sender}:</strong> {msg.content}
              </div>
            ))}
            {!isOnline && (
              <div className="text-center text-sm text-gray-500 mt-2">
                Our support is currently offline. Please leave a message or try again during business hours (Mon-Fri, 9 AM - 5 PM).
              </div>
            )}
          </div>
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"
              disabled={!isOnline}
            />
            <button
              type="submit"
              className="mt-2 w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 font-medium"
              disabled={!isOnline}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LiveChatWidget;