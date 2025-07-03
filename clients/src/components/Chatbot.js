import React, { useState } from 'react';
import { FaCommentDots, FaTimes } from 'react-icons/fa';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! How can I help you today?", sender: "bot" },
    { id: 2, text: "Here are some common questions:", sender: "bot" },
    { id: 3, text: "- How do I verify my listing?", sender: "bot" },
    { id: 4, text: "- How do I save a search?", sender: "bot" },
    { id: 5, text: "- How do I contact a landlord?", sender: "bot" },
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    const newMessages = [...messages, { id: messages.length + 1, text: input, sender: "user" }];
    setMessages(newMessages);
    setInput('');

    // Simple bot response logic (for demo)
    setTimeout(() => {
      let botResponse = "I'm sorry, I don't understand that question yet. Please try rephrasing or contact support.";
      if (input.toLowerCase().includes('verify listing')) {
        botResponse = "To verify your listing, please go to your landlord dashboard and upload the required documents under the 'Verification' section.";
      } else if (input.toLowerCase().includes('save search')) {
        botResponse = "You can save a search by applying your desired filters on the Listings page and then clicking the 'Save Search' button.";
      } else if (input.toLowerCase().includes('contact landlord')) {
        botResponse = "You can contact a landlord directly through the chat feature available on each property's details page.";
      }
      setMessages(prev => [...prev, { id: prev.length + 1, text: botResponse, sender: "bot" }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        title="Open Chatbot"
      >
        {isOpen ? <FaTimes className="text-xl" /> : <FaCommentDots className="text-xl" />}
      </button>

      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col absolute bottom-16 right-0 border border-gray-200">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h4 className="font-semibold">Rentify Assistant</h4>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <FaTimes />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-200 flex">
            <input
              type="text"
              className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
