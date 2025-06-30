import React, { useState, useEffect, useRef } from 'react';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

// Utility functions for encryption/decryption
const generateKeyPair = () => {
  return nacl.box.keyPair();
};

const encryptMessage = (message, nonce, publicKey, secretKey) => {
  const messageUint8 = naclUtil.decodeUTF8(message);
  const encrypted = nacl.box(messageUint8, nonce, publicKey, secretKey);
  return naclUtil.encodeBase64(encrypted);
};

const decryptMessage = (encryptedMessage, nonce, publicKey, secretKey) => {
  const encryptedUint8 = naclUtil.decodeBase64(encryptedMessage);
  const decrypted = nacl.box.open(encryptedUint8, nonce, publicKey, secretKey);
  if (!decrypted) return null;
  return naclUtil.encodeUTF8(decrypted);
};

const Chat = () => {
  const [messages, setMessages] = useState(() => {
    // Load messages from localStorage
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [keyPair, setKeyPair] = useState(null);
  const [peerPublicKey, setPeerPublicKey] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Generate key pair on mount
    const keys = generateKeyPair();
    setKeyPair(keys);
    // TODO: Implement secure key exchange mechanism here
    // For demo, peerPublicKey is same as publicKey (in real app, exchange keys securely)
    setPeerPublicKey(keys.publicKey);
  }, []);

  useEffect(() => {
    // Scroll to bottom on new message
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    // Save messages to localStorage
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !keyPair || !peerPublicKey) return;

    const nonce = nacl.randomBytes(nacl.box.nonceLength);
    const encrypted = encryptMessage(input, nonce, peerPublicKey, keyPair.secretKey);

    const newMessage = {
      id: Date.now(),
      encryptedMessage: encrypted,
      nonce: naclUtil.encodeBase64(nonce),
      sender: 'me',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  const decrypt = (msg) => {
    if (!keyPair) return '';
    const nonce = naclUtil.decodeBase64(msg.nonce);
    const decrypted = decryptMessage(msg.encryptedMessage, nonce, peerPublicKey, keyPair.secretKey);
    return decrypted || '[Unable to decrypt]';
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow h-96 flex flex-col">
      <div className="flex-grow overflow-auto mb-4">
        {messages.map(msg => (
          <div key={msg.id} className={`mb-2 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
            <div className="inline-block bg-primary text-white rounded px-3 py-1">
              {decrypt(msg)}
            </div>
            <div className="text-xs text-text">{new Date(msg.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className="flex-grow border border-primary rounded-l px-3 py-2 text-text"
          placeholder="Type a message"
        />
        <button
          onClick={handleSend}
          className="bg-primary text-white px-4 py-2 rounded-r hover:bg-secondary"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
