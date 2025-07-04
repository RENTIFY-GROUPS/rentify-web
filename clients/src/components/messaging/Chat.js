import React, { useState } from 'react';
import ConversationList from './ConversationList';
import MessageWindow from './MessageWindow';

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="chat-container">
      <ConversationList onSelectConversation={setSelectedConversation} />
      <MessageWindow conversation={selectedConversation} />
    </div>
  );
};

export default Chat;