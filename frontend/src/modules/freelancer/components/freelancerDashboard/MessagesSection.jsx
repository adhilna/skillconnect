import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Filter,
  Send,
  Phone,
  Video,
  DollarSign,
  Search,
  MoreVertical,
  Clock,
  Check,
  CheckCheck,
  Paperclip,
  Smile,
  ArrowLeft,
  Calendar,
  Star,
  Plus,
  X,
  Play,
  Pause,
  Download,
  FileText,
  Image,
  Mic,
  MicOff,
  Camera,
  ThumbsUp,
  Heart,
  Laugh
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
    budget: '$2,500',
    deadline: '2025-08-15',
    status: 'In Progress',
    typing: false
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
    budget: '$5,000',
    deadline: '2025-09-01',
    status: 'Planning',
    typing: true
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
    budget: '$800',
    deadline: '2025-08-10',
    status: 'Review',
    typing: false
  }
];

// Project context component
const ProjectContext = ({ project, budget, deadline, status }) => (
  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-3 m-4 mb-2">
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-white font-medium text-sm">{project}</h4>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'In Progress' ? 'bg-blue-500/20 text-blue-300' :
          status === 'Review' ? 'bg-yellow-500/20 text-yellow-300' :
            'bg-green-500/20 text-green-300'
        }`}>
        {status}
      </span>
    </div>
    <div className="flex items-center justify-between text-xs">
      <span className="text-green-400 font-medium">{budget}</span>
      <div className="flex items-center text-gray-400">
        <Calendar size={12} className="mr-1" />
        {new Date(deadline).toLocaleDateString()}
      </div>
    </div>
  </div>
);

// Reaction picker component
const ReactionPicker = ({ isVisible, onReact, onClose }) => {
  const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-full mb-2 bg-gray-800 border border-white/20 rounded-full px-3 py-2 flex space-x-2 z-50 shadow-lg">
      {reactions.map((emoji, index) => (
        <button
          key={index}
          onClick={() => onReact(emoji)}
          className="hover:scale-125 transition-transform text-lg focus:outline-none"
          aria-label={`React with ${emoji}`}
          type="button"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

// Message reactions display
const MessageReactions = ({ reactions, onReact }) => {
  if (!reactions || Object.keys(reactions).length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {Object.entries(reactions).map(([emoji, count]) => (
        <button
          key={emoji}
          onClick={() => onReact(emoji)}
          className="bg-white/10 hover:bg-white/20 rounded-full px-2 py-1 text-xs flex items-center space-x-1 transition-colors focus:outline-none"
          type="button"
          aria-label={`React with ${emoji}`}
        >
          <span>{emoji}</span>
          <span className="text-white/70">{count}</span>
        </button>
      ))}
    </div>
  );
};

// File attachment preview
const FilePreview = ({ file, onRemove }) => (
  <div className="relative bg-white/10 rounded-lg p-3 border border-white/20 flex items-center space-x-3">
    <button
      onClick={onRemove}
      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 focus:outline-none"
      aria-label="Remove attachment"
      type="button"
    >
      <X size={12} />
    </button>
    {file.type.startsWith('image/') ? (
      <div className="w-12 h-12 bg-purple-500 rounded flex items-center justify-center text-white font-bold leading-none">
        <Image size={16} />
      </div>
    ) : (
      <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center text-white font-bold leading-none">
        <FileText size={16} />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-white text-sm truncate" title={file.name}>{file.name}</p>
      <p className="text-gray-400 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
    </div>
  </div>
);

// Upload progress component
const UploadProgress = ({ progress }) => (
  <div className="bg-white/10 rounded-lg p-3 border border-white/20 mb-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-white text-sm">Uploading...</span>
      <span className="text-white text-sm">{progress}%</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div
        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

// Voice message component
const VoiceMessage = ({ duration, isPlaying, onPlayPause }) => (
  <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3 min-w-48 max-w-xs">
    <button
      onClick={onPlayPause}
      className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2 text-white hover:from-purple-600 hover:to-pink-600 focus:outline-none"
      aria-label={isPlaying ? 'Pause voice message' : 'Play voice message'}
      type="button"
    >
      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
    </button>
    <div className="flex-1">
      <div className="flex space-x-1 items-center mb-1">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`w-1 bg-white/60 rounded-full ${i < 8 ? 'h-6' : i < 12 ? 'h-4' : 'h-3'
              }`}
          />
        ))}
      </div>
      <span className="text-xs text-white/70">{duration}</span>
    </div>
  </div>
);

// Payment message component
const PaymentMessage = ({ amount, description, status, isRequest, onPayment }) => (
  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4 max-w-xs">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2">
        <DollarSign size={16} className="text-green-400" />
        <span className="text-white font-medium">${amount}</span>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs ${status === 'completed' ? 'bg-green-500/20 text-green-300' :
          status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
            'bg-red-500/20 text-red-300'
        }`}>
        {status}
      </span>
    </div>
    <p className="text-white/80 text-sm mb-3 whitespace-pre-wrap">{description}</p>
    {isRequest && status === 'pending' && (
      <button
        onClick={onPayment}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
        type="button"
        aria-label="Pay now"
      >
        Pay Now
      </button>
    )}
  </div>
);

// Single message component
const Message = ({
  id,
  sender,
  text,
  time,
  isMe,
  status,
  type = 'text',
  fileData,
  paymentData,
  voiceData,
  reactions,
  onReact,
  onLongPress
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const longPressTimer = useRef(null);

  const handleMouseDown = () => {
    longPressTimer.current = setTimeout(() => {
      setShowReactionPicker(true);
      onLongPress && onLongPress(id);
    }, 500);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleReact = (emoji) => {
    onReact(id, emoji);
    setShowReactionPicker(false);
  };

  return (
    <div className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div className="relative max-w-xs lg:max-w-md">
        <div
          role="group"
          aria-label={isMe ? "Sent message" : "Received message"}
          tabIndex={0}
          className={`px-4 py-2 rounded-2xl ${isMe
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
            : 'bg-white/10 text-white border border-white/20'
            }`}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
        >
          {!isMe && <div className="font-medium text-sm opacity-80 mb-1">{sender}</div>}

          {type === 'text' && <p className="text-sm whitespace-pre-wrap">{text}</p>}

          {type === 'file' && fileData && (
            <div className="space-y-2">
              {fileData.type.startsWith('image/') ? (
                <img
                  src={fileData.url}
                  alt={fileData.name}
                  className="max-w-full h-auto rounded-lg cursor-pointer"
                  draggable={false}
                />
              ) : (
                <a
                  href={fileData.url}
                  download={fileData.name}
                  className="flex items-center space-x-2 bg-white/10 rounded p-2 cursor-pointer hover:bg-white/20"
                  title={`Download ${fileData.name}`}
                >
                  <FileText size={20} />
                  <div>
                    <p className="text-sm">{fileData.name}</p>
                    <p className="text-xs opacity-70">{fileData.size}</p>
                  </div>
                  <Download size={16} />
                </a>
              )}
              {text && <p className="text-sm">{text}</p>}
            </div>
          )}

          {type === 'payment' && paymentData && (
            <PaymentMessage {...paymentData} />
          )}

          {type === 'voice' && voiceData && (
            <VoiceMessage
              {...voiceData}
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
            />
          )}

          <div className="flex items-center justify-end mt-1 space-x-1" aria-live="polite" aria-atomic="true">
            <span className="text-xs opacity-70">{time}</span>
            {isMe && (
              <div className="text-xs opacity-70">
                {status === 'sent' && <Check size={12} aria-label="Sent" />}
                {status === 'delivered' && <CheckCheck size={12} aria-label="Delivered" />}
                {status === 'read' && <CheckCheck size={12} className="text-blue-400" aria-label="Read" />}
              </div>
            )}
          </div>
        </div>

        <MessageReactions reactions={reactions} onReact={handleReact} />

        <ReactionPicker
          isVisible={showReactionPicker}
          onReact={handleReact}
          onClose={() => setShowReactionPicker(false)}
        />
      </div>
    </div>
  );
};

// Chat list item component
const ChatListItem = ({ chat, isActive, onClick }) => (
  <div
    className={`p-4 cursor-pointer transition-all duration-200 border-b border-white/10 hover:bg-white/5 active:bg-white/10 ${isActive ? 'bg-white/10' : ''
      }`}
    onClick={() => onClick(chat)}
    role="button"
    tabIndex={0}
    onKeyDown={e => { if (e.key === 'Enter') onClick(chat); }}
    aria-current={isActive ? 'true' : 'false'}
  >
    <div className="flex items-center space-x-3">
      <div className="relative flex-shrink-0">
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
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">{chat.time}</span>
            {chat.unread > 0 && (
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full px-2 py-1">
                {chat.unread}
              </span>
            )}
          </div>
        </div>
        <div className="mt-1 min-w-0">
          {chat.typing ? (
            <p className="text-sm text-purple-400 italic truncate">typing...</p>
          ) : (
            <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
          )}
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500 truncate">{chat.project}</span>
          <span className="text-xs text-green-400 font-medium">{chat.budget}</span>
        </div>
      </div>
    </div>
  </div>
);

// Attachment menu component (fixed to plus button)
const AttachmentMenu = ({ isVisible, onClose, onFileSelect, onVoiceRecord, onPaymentRequest }) => {
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Close menu on clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('#attachment-menu') && !event.target.closest('#attach-btn')) {
        onClose();
      }
    };
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  return (
    <div
      id="attachment-menu"
      className="absolute bottom-full mb-2 right-0 bg-gray-800 border border-white/20 rounded-lg p-2 shadow-lg z-50 w-48 grid grid-cols-2 gap-2"
      role="menu"
      aria-label="Attachment options"
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            onFileSelect(Array.from(e.target.files));
          }
        }}
        accept="*"
      />
      <input
        ref={imageInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            onFileSelect(Array.from(e.target.files));
          }
        }}
        accept="image/*"
      />
      <button
        onClick={handleFileClick}
        className="flex flex-col items-center p-3 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors focus:outline-none"
        role="menuitem"
        type="button"
        aria-label="Attach file"
      >
        <FileText size={20} />
        <span className="text-xs mt-1">File</span>
      </button>
      <button
        onClick={handleImageClick}
        className="flex flex-col items-center p-3 bg-green-500 rounded-lg text-white hover:bg-green-600 transition-colors focus:outline-none"
        role="menuitem"
        type="button"
        aria-label="Attach photo"
      >
        <Camera size={20} />
        <span className="text-xs mt-1">Photo</span>
      </button>
      <button
        onClick={() => {
          onVoiceRecord();
        }}
        className="flex flex-col items-center p-3 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors focus:outline-none"
        role="menuitem"
        type="button"
        aria-label="Record voice message"
      >
        <Mic size={20} />
        <span className="text-xs mt-1">Voice</span>
      </button>
      <button
        onClick={() => {
          onPaymentRequest();
        }}
        className="flex flex-col items-center p-3 bg-purple-500 rounded-lg text-white hover:bg-purple-600 transition-colors focus:outline-none"
        role="menuitem"
        type="button"
        aria-label="Request payment"
      >
        <DollarSign size={20} />
        <span className="text-xs mt-1">Payment</span>
      </button>
    </div>
  );
};

// Main component
const FreelancerChatDashboard = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'chat'
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Sarah Wilson',
      text: 'Hi! How is the project going?',
      time: '10:30 AM',
      isMe: false,
      status: 'read',
      type: 'text',
      reactions: { '👍': 2, '❤️': 1 }
    },
    {
      id: 2,
      sender: 'Me',
      text: 'Going well, will send updates soon.',
      time: '10:32 AM',
      isMe: true,
      status: 'read',
      type: 'text'
    },
    {
      id: 3,
      sender: 'Me',
      text: '',
      time: '10:33 AM',
      isMe: true,
      status: 'read',
      type: 'payment',
      paymentData: {
        amount: 500,
        description: 'Website wireframes - milestone 1',
        status: 'pending',
        isRequest: false,
        onPayment: () => alert('Payment processed!')
      }
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Responsive breakpoint detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredChats = chatListData.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (newMessage.trim() === '' && attachedFiles.length === 0) return;

    if (attachedFiles.length > 0) {
      setIsUploading(true);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadProgress(0);

          const fileMsg = {
            id: messages.length + 1,
            sender: 'Me',
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
            status: 'sent',
            type: 'file',
            fileData: {
              name: attachedFiles[0].name,
              type: attachedFiles[0].type,
              size: `${(attachedFiles[0].size / 1024).toFixed(1)} KB`,
              url: URL.createObjectURL(attachedFiles[0])
            }
          };

          setMessages(prev => [...prev, fileMsg]);
          setAttachedFiles([]);
        }
      }, 200);
    } else {
      const newMsg = {
        id: messages.length + 1,
        sender: 'Me',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        status: 'sent',
        type: 'text'
      };

      setMessages(prev => [...prev, newMsg]);
    }

    setNewMessage('');
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setCurrentView('chat');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedChat(null);
  };

  const handleFileSelect = (files) => {
    setAttachedFiles(files);
    setShowAttachmentMenu(false);
  };

  const handleVoiceRecord = () => {
    setIsRecording(true);
    setShowAttachmentMenu(false);

    // Simulate 3 second voice recording
    setTimeout(() => {
      const voiceMsg = {
        id: messages.length + 1,
        sender: 'Me',
        text: '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        status: 'sent',
        type: 'voice',
        voiceData: {
          duration: '0:15'
        }
      };
      setMessages(prev => [...prev, voiceMsg]);
      setIsRecording(false);
    }, 3000);
  };

  const handleReaction = (messageId, emoji) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions };
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        return { ...msg, reactions };
      }
      return msg;
    }));
  };

  const handlePaymentRequest = () => {
    setShowPaymentModal(true);
    setShowAttachmentMenu(false);
  };

  // Add scroll ref for messages container to scroll down on new message
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col md:flex-row">
      {/* Chat List */}
      <div className={`w-full md:w-1/3 border-r border-white/10 flex flex-col ${isMobile ? (currentView === 'list' ? 'flex' : 'hidden') : 'flex'
        }`}>
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Messages</h2>
            <button className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors touch-manipulation" aria-label="Filter conversations">
              <Filter size={16} />
            </button>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="search"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 text-white pl-10 pr-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:border-purple-500 text-base"
              aria-label="Search conversations"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto" aria-label="Conversation list">
          {filteredChats.length === 0 ? (
            <p className="text-center text-gray-400 mt-4">No conversations found</p>
          ) : (
            filteredChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isActive={selectedChat?.id === chat.id}
                onClick={handleChatSelect}
              />
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col ${isMobile ? (currentView === 'chat' ? 'flex' : 'hidden') : 'flex'
        }`} aria-live="polite">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isMobile && (
                  <button
                    onClick={handleBackToList}
                    className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors touch-manipulation focus:outline-none"
                    aria-label="Back to conversation list"
                    type="button"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium select-none">
                    {selectedChat.avatar}
                  </div>
                  {selectedChat.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-medium">{selectedChat.name}</h3>
                  <p className="text-sm text-gray-400 select-none">
                    {selectedChat.typing ? 'typing...' : selectedChat.online ? 'online' : 'offline'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors touch-manipulation" aria-label="Start voice call" type="button">
                  <Phone size={16} />
                </button>
                <button className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors touch-manipulation" aria-label="Start video call" type="button">
                  <Video size={16} />
                </button>
                <button className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors touch-manipulation" aria-label="More options" type="button">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* Project Context */}
            <ProjectContext
              project={selectedChat.project}
              budget={selectedChat.budget}
              deadline={selectedChat.deadline}
              status={selectedChat.status}
            />

            {/* Messages Area */}
            <div
              className="flex-1 p-4 overflow-y-auto bg-black/10 touch-manipulation"
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
            >
              {messages.map((msg) => (
                <Message
                  key={msg.id}
                  {...msg}
                  onReact={handleReaction}
                  onLongPress={(id) => console.log('Long press on message', id)}
                />
              ))}
              <div ref={messagesEndRef} />

              {/* Upload Progress */}
              {isUploading && (
                <UploadProgress progress={uploadProgress} />
              )}
            </div>

            {/* Attached Files Preview */}
            {attachedFiles.length > 0 && (
              <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {attachedFiles.map((file, index) => (
                    <FilePreview
                      key={index}
                      file={file}
                      onRemove={() => setAttachedFiles(files => files.filter((_, i) => i !== index))}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Message Input + Attachment menu container */}
            <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-lg flex items-center space-x-2 relative z-10">
              <div className="relative" style={{ flexShrink: 0 }}>
                {/* Wrap button & menu in relative container */}
                <button
                  id="attach-btn"
                  onClick={() => setShowAttachmentMenu(v => !v)}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-full touch-manipulation focus:outline-none focus:ring-2 focus:ring-purple-400"
                  aria-haspopup="true"
                  aria-expanded={showAttachmentMenu}
                  aria-controls="attachment-menu"
                  type="button"
                  title="Open attachment menu"
                >
                  <Plus size={20} />
                </button>
                <AttachmentMenu
                  isVisible={showAttachmentMenu}
                  onClose={() => setShowAttachmentMenu(false)}
                  onFileSelect={handleFileSelect}
                  onVoiceRecord={handleVoiceRecord}
                  onPaymentRequest={handlePaymentRequest}
                />
              </div>

              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                placeholder={isRecording ? "Recording voice..." : "Type a message..."}
                className="flex-1 bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:border-purple-500 text-base"
                disabled={isRecording}
                aria-label="Type a message"
                autoComplete="off"
                spellCheck={false}
              />

              {isRecording ? (
                <>
                  <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-2 rounded-lg text-red-400 text-sm select-none">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    Recording...
                  </div>
                  <button
                    onClick={handleVoiceRecord}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors touch-manipulation focus:outline-none"
                    aria-label="Stop recording"
                    type="button"
                  >
                    <MicOff size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="text-gray-400 hover:text-white transition-colors p-2 focus:outline-none"
                    aria-label="Emoji picker (not implemented)"
                    type="button"
                    tabIndex={-1} // disabled for now, placeholder
                  >
                    <Smile size={20} />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 touch-manipulation focus:outline-none"
                    aria-label="Send message"
                    type="button"
                  >
                    <Send size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Payment Request Modal - mock */}
            {showPaymentModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 w-full max-w-md mx-4">
                  <h3 className="text-xl font-bold text-white mb-4">Request Payment</h3>
                  <p className="text-white mb-4">This is a mock payment modal - implement your payment UI here.</p>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-medium w-full"
                    type="button"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* No Chat Selected */
          <div className="flex-1 flex items-center justify-center bg-black/10 select-none">
            <div className="text-center px-6">
              <MessageCircle size={64} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-400 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a client from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerChatDashboard;














// import React, { useState } from 'react';
// import {
//   MessageCircle,
//   Filter,
//   Send,
//   Phone,
//   Video,
//   CreditCard,
//   Search,
//   MoreVertical,
//   Clock,
//   Check,
//   CheckCheck,
//   Paperclip,
//   Smile,
//   ArrowLeft,
//   DollarSign,
//   Calendar,
//   Star
// } from 'lucide-react';

// // Mock data for chat list
// const chatListData = [
//   {
//     id: 1,
//     name: 'Sarah Wilson',
//     avatar: 'SW',
//     lastMessage: 'Great, thanks for the update!',
//     time: '10:33 AM',
//     unread: 2,
//     online: true,
//     project: 'Website Redesign',
//     budget: '$2,500'
//   },
//   {
//     id: 2,
//     name: 'John Davis',
//     avatar: 'JD',
//     lastMessage: 'When can we schedule a call?',
//     time: '9:45 AM',
//     unread: 0,
//     online: false,
//     project: 'Mobile App Development',
//     budget: '$5,000'
//   },
//   {
//     id: 3,
//     name: 'Emily Chen',
//     avatar: 'EC',
//     lastMessage: 'Perfect! The designs look amazing.',
//     time: 'Yesterday',
//     unread: 1,
//     online: true,
//     project: 'Logo Design',
//     budget: '$800'
//   },
//   {
//     id: 4,
//     name: 'Michael Brown',
//     avatar: 'MB',
//     lastMessage: 'Can you send me the latest files?',
//     time: 'Yesterday',
//     unread: 0,
//     online: false,
//     project: 'E-commerce Store',
//     budget: '$3,200'
//   }
// ];

// // Message component
// const Message = ({ sender, text, time, isMe, status }) => (
//   <div className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
//     <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${isMe
//       ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
//       : 'bg-white/10 text-white border border-white/20'
//       }`}>
//       {!isMe && <div className="font-medium text-sm opacity-80 mb-1">{sender}</div>}
//       <p className="text-sm">{text}</p>
//       <div className="flex items-center justify-end mt-1 space-x-1">
//         <span className="text-xs opacity-70">{time}</span>
//         {isMe && (
//           <div className="text-xs opacity-70">
//             {status === 'sent' && <Check size={12} />}
//             {status === 'delivered' && <CheckCheck size={12} />}
//             {status === 'read' && <CheckCheck size={12} className="text-blue-400" />}
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// );

// // Chat list item component
// const ChatListItem = ({ chat, isActive, onClick }) => (
//   <div
//     className={`p-4 cursor-pointer transition-all duration-200 border-b border-white/10 hover:bg-white/5 ${isActive ? 'bg-white/10' : ''
//       }`}
//     onClick={() => onClick(chat)}
//   >
//     <div className="flex items-center space-x-3">
//       <div className="relative">
//         <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
//           {chat.avatar}
//         </div>
//         {chat.online && (
//           <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
//         )}
//       </div>
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center justify-between">
//           <h4 className="text-white font-medium truncate">{chat.name}</h4>
//           <span className="text-xs text-gray-400">{chat.time}</span>
//         </div>
//         <div className="flex items-center justify-between mt-1">
//           <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
//           {chat.unread > 0 && (
//             <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full px-2 py-1 ml-2">
//               {chat.unread}
//             </span>
//           )}
//         </div>
//         <div className="flex items-center justify-between mt-1">
//           <span className="text-xs text-gray-500">{chat.project}</span>
//           <span className="text-xs text-green-400 font-medium">{chat.budget}</span>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Payment request modal
// const PaymentRequestModal = ({ isOpen, onClose, clientName }) => {
//   const [amount, setAmount] = useState('');
//   const [description, setDescription] = useState('');
//   const [dueDate, setDueDate] = useState('');

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 w-full max-w-md mx-4">
//         <h3 className="text-xl font-bold text-white mb-4">Request Payment</h3>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">Client</label>
//             <input
//               type="text"
//               value={clientName}
//               disabled
//               className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">Amount ($)</label>
//             <input
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               placeholder="0.00"
//               className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-purple-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="What is this payment for?"
//               rows={3}
//               className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-purple-500 resize-none"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
//             <input
//               type="date"
//               value={dueDate}
//               onChange={(e) => setDueDate(e.target.value)}
//               className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-purple-500"
//             />
//           </div>
//         </div>
//         <div className="flex space-x-3 mt-6">
//           <button
//             onClick={onClose}
//             className="flex-1 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => {
//               // Handle payment request logic here
//               alert(`Payment request sent to ${clientName} for $${amount}`);
//               onClose();
//             }}
//             className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
//           >
//             Send Request
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const FreelancerChatDashboard = () => {
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [messages, setMessages] = useState([
//     { sender: 'Sarah Wilson', text: 'Hi! How is the project going?', time: '10:30 AM', isMe: false, status: 'read' },
//     { sender: 'Me', text: 'Going well, will send updates soon.', time: '10:32 AM', isMe: true, status: 'read' },
//     { sender: 'Sarah Wilson', text: 'Great, thanks for the update!', time: '10:33 AM', isMe: false, status: 'read' },
//   ]);
//   const [newMessage, setNewMessage] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showPaymentModal, setShowPaymentModal] = useState(false);

//   const filteredChats = chatListData.filter(chat =>
//     chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     chat.project.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleSendMessage = (e) => {
//     if (e && e.preventDefault) e.preventDefault();
//     if (newMessage.trim() === '') return;

//     const newMsg = {
//       sender: 'Me',
//       text: newMessage,
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       isMe: true,
//       status: 'sent'
//     };

//     setMessages([...messages, newMsg]);
//     setNewMessage('');
//   };

//   const handleChatSelect = (chat) => {
//     setSelectedChat(chat);
//     // In real app, load messages for this chat
//   };

//   const handleVoiceCall = () => {
//     alert(`Starting voice call with ${selectedChat.name}...`);
//   };

//   const handleVideoCall = () => {
//     alert(`Starting video call with ${selectedChat.name}...`);
//   };

//   return (
//     <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex">
//       {/* Chat List Sidebar */}
//       <div className="w-1/3 border-r border-white/10 flex flex-col">
//         {/* Header */}
//         <div className="p-4 border-b border-white/10">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-bold text-white">Messages</h2>
//             <button className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors">
//               <Filter size={16} />
//             </button>
//           </div>
//           {/* Search */}
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//             <input
//               type="text"
//               placeholder="Search conversations..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full bg-white/10 text-white pl-10 pr-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-purple-500"
//             />
//           </div>
//         </div>

//         {/* Chat List */}
//         <div className="flex-1 overflow-y-auto">
//           {filteredChats.map((chat) => (
//             <ChatListItem
//               key={chat.id}
//               chat={chat}
//               isActive={selectedChat?.id === chat.id}
//               onClick={handleChatSelect}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {selectedChat ? (
//           <>
//             {/* Chat Header */}
//             <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-lg">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <button className="lg:hidden text-white">
//                     <ArrowLeft size={20} />
//                   </button>
//                   <div className="relative">
//                     <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
//                       {selectedChat.avatar}
//                     </div>
//                     {selectedChat.online && (
//                       <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
//                     )}
//                   </div>
//                   <div>
//                     <h3 className="text-white font-medium">{selectedChat.name}</h3>
//                     <p className="text-sm text-gray-400">{selectedChat.project}</p>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex items-center space-x-2">
//                   <button
//                     onClick={handleVoiceCall}
//                     className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors"
//                     title="Voice Call"
//                   >
//                     <Phone size={16} />
//                   </button>
//                   <button
//                     onClick={handleVideoCall}
//                     className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors"
//                     title="Video Call"
//                   >
//                     <Video size={16} />
//                   </button>
//                   <button
//                     onClick={() => setShowPaymentModal(true)}
//                     className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
//                     title="Request Payment"
//                   >
//                     <DollarSign size={16} />
//                   </button>
//                   <button className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors">
//                     <MoreVertical size={16} />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Messages Area */}
//             <div className="flex-1 p-4 overflow-y-auto bg-black/10">
//               {messages.map((msg, index) => (
//                 <Message
//                   key={index}
//                   sender={msg.sender}
//                   text={msg.text}
//                   time={msg.time}
//                   isMe={msg.isMe}
//                   status={msg.status}
//                 />
//               ))}
//             </div>

//             {/* Message Input */}
//             <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-lg">
//               <div className="flex items-center space-x-2">
//                 <button className="text-gray-400 hover:text-white transition-colors">
//                   <Paperclip size={20} />
//                 </button>
//                 <input
//                   type="text"
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
//                   placeholder="Type a message..."
//                   className="flex-1 bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-purple-500"
//                 />
//                 <button className="text-gray-400 hover:text-white transition-colors">
//                   <Smile size={20} />
//                 </button>
//                 <button
//                   onClick={handleSendMessage}
//                   className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
//                 >
//                   <Send size={16} />
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           /* No Chat Selected */
//           <div className="flex-1 flex items-center justify-center bg-black/10">
//             <div className="text-center">
//               <MessageCircle size={64} className="text-gray-600 mx-auto mb-4" />
//               <h3 className="text-xl font-medium text-gray-400 mb-2">Select a conversation</h3>
//               <p className="text-gray-500">Choose a client from the list to start chatting</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Payment Request Modal */}
//       <PaymentRequestModal
//         isOpen={showPaymentModal}
//         onClose={() => setShowPaymentModal(false)}
//         clientName={selectedChat?.name || ''}
//       />
//     </div>
//   );
// };

// export default FreelancerChatDashboard;