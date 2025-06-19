import React, { useState } from 'react';
import { MessageCircle, Filter, Send } from 'lucide-react';

// Example: Message component for each chat message
const Message = ({ sender, text, time, isMe }) => (
  <div className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
      isMe
        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
        : 'bg-black/20 text-white'
    }`}>
      <div className="font-medium">{sender}</div>
      <p>{text}</p>
      <div className="text-xs opacity-70 mt-1">{time}</div>
    </div>
  </div>
);

const MessagesSection = () => {
  const [messages, setMessages] = useState([
    { sender: 'Sarah Wilson', text: 'Hi! How is the project going?', time: '10:30 AM', isMe: false },
    { sender: 'Me', text: 'Going well, will send updates soon.', time: '10:32 AM', isMe: true },
    { sender: 'Sarah Wilson', text: 'Great, thanks!', time: '10:33 AM', isMe: false },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    setMessages([
      ...messages,
      { sender: 'Me', text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isMe: true },
    ]);
    setNewMessage('');
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Messages</h3>
        <div className="flex items-center space-x-2">
          <button className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center space-x-2">
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>
      </div>
      <div className="flex-1 bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6 flex flex-col">
        <div className="flex-1 overflow-auto space-y-4 mb-4">
          {messages.map((msg, index) => (
            <Message
              key={index}
              sender={msg.sender}
              text={msg.text}
              time={msg.time}
              isMe={msg.isMe}
            />
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white/10 text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessagesSection;
