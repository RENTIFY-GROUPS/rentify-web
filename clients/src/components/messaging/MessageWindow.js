import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const MessageWindow = ({ conversation }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = io('http://localhost:5000'); // Replace with your server URL

  useEffect(() => {
    if (conversation) {
      const fetchMessages = async () => {
        try {
          const res = await axios.get(`/api/conversations/${conversation._id}/messages`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setMessages(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchMessages();

      socket.emit('joinConversation', conversation._id);

      socket.on('receiveMessage', (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [conversation]);

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/messages', {
        conversationId: conversation._id,
        content: newMessage
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      socket.emit('sendMessage', res.data);
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  if (!conversation) {
    return <div className="message-window">Select a conversation to start chatting</div>;
  }

  return (
    <div className="message-window">
      <div className="messages">
        {messages.map(message => (
          <div key={message._id} className="message">
            <strong>{message.sender.name}:</strong> {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default MessageWindow;