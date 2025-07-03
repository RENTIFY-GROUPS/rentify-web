import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ConversationList = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get('/api/conversations', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setConversations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchConversations();
  }, []);

  return (
    <div className="conversation-list">
      <h2>Conversations</h2>
      <ul>
        {conversations.map(conversation => (
          <li key={conversation._id} onClick={() => onSelectConversation(conversation)}>
            {conversation.participants.map(p => p.name).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationList;