import React, { useState } from 'react';
import {
  MessageCircle,
  Filter,
  Send,
  Phone,
  Video,
  CreditCard,
  Search,
  MoreVertical,
  Clock,
  Check,
  CheckCheck,
  Paperclip,
  Smile,
  ArrowLeft,
  DollarSign,
  Calendar,
  Star
} from 'lucide-react';

// Mock data for chat list
const chatListData = [
  {
    id: 1,
    name: 'Sarah Wilson',
    avatar: 'SW',
    lastMessage: 'Great, thanks for the update!',
    time: '10:33 AM',
    unread: 2,
    online: true,
    project: 'Website Redesign',
    budget: '$2,500'
  },
  {
    id: 2,
    name: 'John Davis',
    avatar: 'JD',
    lastMessage: 'When can we schedule a call?',
    time: '9:45 AM',
    unread: 0,
    online: false,
    project: 'Mobile App Development',
    budget: '$5,000'
  },
  {
    id: 3,
    name: 'Emily Chen',
    avatar: 'EC',
    lastMessage: 'Perfect! The designs look amazing.',
    time: 'Yesterday',
    unread: 1,
    online: true,
    project: 'Logo Design',
    budget: '$800'
  },
  {
    id: 4,
    name: 'Michael Brown',
    avatar: 'MB',
    lastMessage: 'Can you send me the latest files?',
    time: 'Yesterday',
    unread: 0,
    online: false,
    project: 'E-commerce Store',
    budget: '$3,200'
  }
];

// Message component
const Message = ({ sender, text, time, isMe, status }) => (
  <div className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${isMe
        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
        : 'bg-white/10 text-white border border-white/20'
      }`}>
      {!isMe && <div className="font-medium text-sm opacity-80 mb-1">{sender}</div>}
      <p className="text-sm">{text}</p>
      <div className="flex items-center justify-end mt-1 space-x-1">
        <span className="text-xs opacity-70">{time}</span>
        {isMe && (
          <div className="text-xs opacity-70">
            {status === 'sent' && <Check size={12} />}
            {status === 'delivered' && <CheckCheck size={12} />}
            {status === 'read' && <CheckCheck size={12} className="text-blue-400" />}
          </div>
        )}
      </div>
    </div>
  </div>
);

// Chat list item component
const ChatListItem = ({ chat, isActive, onClick }) => (
  <div
    className={`p-4 cursor-pointer transition-all duration-200 border-b border-white/10 hover:bg-white/5 ${isActive ? 'bg-white/10' : ''
      }`}
    onClick={() => onClick(chat)}
  >
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
          {chat.avatar}
        </div>
        {chat.online && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-medium truncate">{chat.name}</h4>
          <span className="text-xs text-gray-400">{chat.time}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
          {chat.unread > 0 && (
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full px-2 py-1 ml-2">
              {chat.unread}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">{chat.project}</span>
          <span className="text-xs text-green-400 font-medium">{chat.budget}</span>
        </div>
      </div>
    </div>
  </div>
);

// Payment request modal
const PaymentRequestModal = ({ isOpen, onClose, clientName }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold text-white mb-4">Request Payment</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Client</label>
            <input
              type="text"
              value={clientName}
              disabled
              className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this payment for?"
              rows={3}
              className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Handle payment request logic here
              alert(`Payment request sent to ${clientName} for $${amount}`);
              onClose();
            }}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
};

const FreelancerChatDashboard = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([
    { sender: 'Sarah Wilson', text: 'Hi! How is the project going?', time: '10:30 AM', isMe: false, status: 'read' },
    { sender: 'Me', text: 'Going well, will send updates soon.', time: '10:32 AM', isMe: true, status: 'read' },
    { sender: 'Sarah Wilson', text: 'Great, thanks for the update!', time: '10:33 AM', isMe: false, status: 'read' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const filteredChats = chatListData.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (newMessage.trim() === '') return;

    const newMsg = {
      sender: 'Me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      status: 'sent'
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    // In real app, load messages for this chat
  };

  const handleVoiceCall = () => {
    alert(`Starting voice call with ${selectedChat.name}...`);
  };

  const handleVideoCall = () => {
    alert(`Starting video call with ${selectedChat.name}...`);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex">
      {/* Chat List Sidebar */}
      <div className="w-1/3 border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Messages</h2>
            <button className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors">
              <Filter size={16} />
            </button>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 text-white pl-10 pr-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={selectedChat?.id === chat.id}
              onClick={handleChatSelect}
            />
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button className="lg:hidden text-white">
                    <ArrowLeft size={20} />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                      {selectedChat.avatar}
                    </div>
                    {selectedChat.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{selectedChat.name}</h3>
                    <p className="text-sm text-gray-400">{selectedChat.project}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleVoiceCall}
                    className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors"
                    title="Voice Call"
                  >
                    <Phone size={16} />
                  </button>
                  <button
                    onClick={handleVideoCall}
                    className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors"
                    title="Video Call"
                  >
                    <Video size={16} />
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
                    title="Request Payment"
                  >
                    <DollarSign size={16} />
                  </button>
                  <button className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-black/10">
              {messages.map((msg, index) => (
                <Message
                  key={index}
                  sender={msg.sender}
                  text={msg.text}
                  time={msg.time}
                  isMe={msg.isMe}
                  status={msg.status}
                />
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-lg">
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-purple-500"
                />
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Smile size={20} />
                </button>
                <button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* No Chat Selected */
          <div className="flex-1 flex items-center justify-center bg-black/10">
            <div className="text-center">
              <MessageCircle size={64} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-400 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a client from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* Payment Request Modal */}
      <PaymentRequestModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        clientName={selectedChat?.name || ''}
      />
    </div>
  );
};

export default FreelancerChatDashboard;