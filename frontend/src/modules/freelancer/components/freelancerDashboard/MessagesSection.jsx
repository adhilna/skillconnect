import React, { useState, useContext, useEffect, useRef } from 'react';
import api from '../../../../api/api';
import { AuthContext } from '../../../../context/AuthContext';
import { MessageCircle } from 'lucide-react';

import ChatList from './messagesSection/ChatList';
import ChatHeader from './messagesSection/ChatHeader';
import ChatMessages from './messagesSection/ChatMessages';
import ChatInput from './messagesSection/ChatInput';
import ProjectContext from './messagesSection/ProjectContext';

const FreelancerChatDashboard = ({ conversationId }) => {
  const { user, token } = useContext(AuthContext);
  const [currentView, setCurrentView] = useState('list');
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatListData, setChatListData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const socketRef = useRef(null);

  const isMobile = window.innerWidth < 768;

  const sortMessages = (msgs) => {
    return msgs.slice().sort((a, b) => {
      const timeA = new Date(a.created_at || a.time).getTime();
      const timeB = new Date(b.created_at || b.time).getTime();
      return timeA - timeB;
    });
  };

  // Fetch chat list
  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      setLoadingChats(true);
      try {
        const res = await api.get('/api/v1/messaging/conversations/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const chats = res.data.map((convo) => ({
          id: convo.id,
          name: convo.client_name || `Client ${convo.client_id}`,
          avatar: convo.client_profile_pic || '',
          lastMessage: convo.last_message?.content || '',
          time: convo.last_message
            ? new Date(convo.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '',
          unread: convo.unread_count || 0,
          online: false,
          project: convo.service_title || `Order #${convo.order_id}`,
          budget: convo.service_price || '—',
          deadline: convo.service_deadline || '—',
          status: 'Active',
          typing: false,
        }));
        setChatListData(chats);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoadingChats(false);
      }
    };

    fetchConversations();
  }, [user, token]);

  // Listen to conversationId change to select chat if found
  useEffect(() => {
    if (!conversationId || chatListData.length === 0) return;

    const chat = chatListData.find((c) => c.id === conversationId);
    if (chat) {
      setSelectedChat(chat);
      setCurrentView('chat');
    }
  }, [conversationId, chatListData]);

  // Fetch messages when chat changes
  useEffect(() => {
    if (!user || !selectedChat) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await api.get(
          `/api/v1/messaging/conversations/${selectedChat.id}/messages/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const msgs = res.data.map((msg) => {
          const isSenderMe = Number(msg.sender_id) === Number(user.id);

          return {
            id: msg.id,
            sender: isSenderMe ? 'Me' : selectedChat.name,
            isMe: isSenderMe,
            text: msg.content,
            time: new Date(msg.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            status: msg.status,
            type: msg.message_type,
            fileData: msg.attachment
              ? {
                name: msg.attachment.file_name,
                type: msg.attachment.file_type || '',
                size: `${(msg.attachment.file_size / 1024).toFixed(1)} KB`,
                url: msg.attachment.file,
              }
              : null,
            paymentData:
              msg.message_type === 'payment'
                ? {
                  amount: msg.payment_amount,
                  description: msg.content,
                  status: msg.payment_status,
                  isRequest: true,
                  onPayment: () => alert('Implement payment logic'),
                }
                : null,
            reactions: msg.reactions || {},
            voiceData:
              msg.message_type === 'voice'
                ? {
                  duration: msg.voice_duration || '0:00',
                }
                : null,
          };
        });

        setMessages(sortMessages(msgs));
      } catch (err) {
        console.error('Error loading messages:', err);
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedChat, user, token]);

  // WebSocket connection for realtime messages omitted for brevity (keep your existing code here)
  useEffect(() => {
    if (!selectedChat || !token) return;


    let isMounted = true;

    const backendHost = 'localhost:8000';
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${wsProtocol}://${backendHost}/ws/messaging/chat/${selectedChat.id}/?token=${token}`;
    socketRef.current = new WebSocket(wsUrl);

    const socket = socketRef.current;


    try {
      socket.onopen = () => {
        if (!isMounted) {
          socket.close();
          return;
        }
        console.log('WebSocket connected');
      };

      socket.onerror = (e) => {
        console.error('WebSocket error', e);
      };

      socket.onclose = (e) => {
        if (isMounted) {
          console.log('WebSocket disconnected', e);
          // optional: implement reconnect logic here if desired
        }
      };

      socket.onmessage = (event) => {
        if (!isMounted) return;

        const data = JSON.parse(event.data);

        // Handle different incoming event types:
        if (data.type === 'chat_message' || (!data.type && data.id)) {
          // Normal chat message event (some backend messages might lack explicit type)
          const isSenderMe = Number(data.sender_id) === Number(user.id);

          const newMsg = {
            ...data,
            sender: isSenderMe ? 'Me' : selectedChat.name,
            isMe: isSenderMe,
            text: data.content,
            time: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: data.status,
            type: data.message_type,
            reactions: data.reactions || {},
            fileData: data.attachment ? {
              name: data.attachment.file_name,
              type: data.attachment.file_type || '',
              size: `${(data.attachment.file_size / 1024).toFixed(1)} KB`,
              url: data.attachment.file,
            } : null,
            paymentData: data.message_type === 'payment' ? {
              amount: data.payment_amount,
              description: data.content,
              status: data.payment_status,
              isRequest: true,
              onPayment: () => alert('Implement payment logic'),
            } : null,
            voiceData: data.message_type === 'voice' ? { duration: data.voice_duration || '0:00' } : null,
          };

          setMessages(prev => sortMessages([...prev, newMsg]));
          return;
        }

        if (data.type === 'read') {
          // Clear unread badge for the conversation that was read
          setChatListData(prevChats =>
            prevChats.map(chat =>
              chat.id === data.conversation_id ? { ...chat, unread: 0 } : chat
            )
          );

          return;
        }

        if (data.type === 'typing') {
          // Update typing indicator for this conversation
          setChatListData(prevChats =>
            prevChats.map(chat =>
              chat.id === data.conversation_id ? { ...chat, typing: data.typing } : chat
            )
          );
          return;
        }

        // Optional: log if unknown message type is received
        console.warn('Unknown WebSocket message type:', data);
      };
    } catch (error) {
      console.error("WebSocket initialization error", error);
    }

    return () => {
      isMounted = false;
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [selectedChat, token, user]);

  // Handle send message
  const handleSendMessage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (newMessage.trim() === '' && attachedFiles.length === 0) return;
    if (!selectedChat || !user) return;

    try {
      const formData = new FormData();
      formData.append('content', newMessage.trim());
      formData.append('message_type', attachedFiles.length > 0 ? 'file' : 'text');
      if (attachedFiles.length > 0) {
        formData.append('attachment_file', attachedFiles[0]);
      }

      setIsUploading(true);
      setUploadProgress(0);

      await api.post(
        `/api/v1/messaging/conversations/${selectedChat.id}/messages/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      // DO NOT add newMsg to setMessages here!
      setNewMessage('');
      setAttachedFiles([]);
      setIsUploading(false);
      setUploadProgress(0);
    } catch (err) {
      console.error('Message send failed:', err);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };


  // File select handler
  const handleFileSelect = (files) => {
    setAttachedFiles(files);
    setShowAttachmentMenu(false);
  };

  // Voice record simulation
  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    setShowAttachmentMenu(false);

    if (!isRecording) {
      setTimeout(() => {
        const voiceMsg = {
          id: messages.length + 1,
          sender: 'Me',
          isMe: true,
          text: '',
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: 'sent',
          type: 'voice',
          voiceData: {
            duration: '0:15',
          },
        };
        setMessages((prev) => [...prev, voiceMsg]);
        setIsRecording(false);
      }, 3000);
    }
  };

  // Reaction handler
  const handleReaction = (messageId, emoji) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = { ...(msg.reactions || {}) };
          reactions[emoji] = (reactions[emoji] || 0) + 1;
          return { ...msg, reactions };
        }
        return msg;
      })
    );
  };

  // Chat select handler
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setCurrentView('chat');
  };

  // Back to chat list handler
  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedChat(null);
    setMessages([]);
  };

  // Filter chats based on search
  const filteredChats = chatListData.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col md:flex-row">
      {/* Chat List */}
      <div
        className={`${isMobile
          ? currentView === 'list'
            ? 'flex flex-col h-full'
            : 'hidden'
          : 'w-1/3 border-r border-white/10 flex flex-col'
          }`}
      >
        <ChatList
          chatList={filteredChats}
          selectedChatId={selectedChat?.id}
          onSelectChat={handleChatSelect}
          loading={loadingChats}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {/* Chat Window */}
      <div
        className={`flex-1 flex flex-col ${isMobile && currentView !== 'chat' ? 'hidden' : 'flex flex-col h-full'
          }`}
        aria-live="polite"
      >
        {selectedChat ? (
          <>
            <ChatHeader chat={selectedChat} onBack={handleBackToList} isMobile={isMobile} />

            <ProjectContext
              project={selectedChat.project}
              budget={selectedChat.budget}
              deadline={selectedChat.deadline}
              status={selectedChat.status}
            />

            <ChatMessages
              messages={messages}
              loading={loadingMessages}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              onReact={handleReaction}
            />

            <ChatInput
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              onSend={handleSendMessage}
              socket={socketRef.current}
              selectedChat={selectedChat}
              attachedFiles={attachedFiles}
              onRemoveFile={(index) =>
                setAttachedFiles((files) => files.filter((_, i) => i !== index))
              }
              showAttachmentMenu={showAttachmentMenu}
              setShowAttachmentMenu={setShowAttachmentMenu}
              onFileSelect={handleFileSelect}
              onVoiceRecord={handleVoiceRecord}
              isRecording={isRecording}
              handleVoiceRecord={handleVoiceRecord}
              isUploading={isUploading}
            />
          </>
        ) : (
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















// import React, { useState, useRef, useEffect, useContext } from 'react';
// import api from '../../../../api/api';
// import {
//   MessageCircle,
//   Filter,
//   Send,
//   Phone,
//   Video,
//   DollarSign,
//   Search,
//   MoreVertical,
//   Calendar,
//   Check,
//   CheckCheck,
//   Paperclip,
//   Smile,
//   ArrowLeft,
//   FileText,
//   Download,
//   Image,
//   Mic,
//   MicOff,
//   Plus,
//   X,
//   Play,
//   Pause,
// } from 'lucide-react';
// import { AuthContext } from '../../../../context/AuthContext';

// // Project context component for showing project info
// const ProjectContext = ({ project, budget, deadline, status }) => (
//   <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-3 m-4 mb-2">
//     <div className="flex items-center justify-between mb-2">
//       <h4 className="text-white font-medium text-sm">{project}</h4>
//       <span
//         className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'In Progress'
//           ? 'bg-blue-500/20 text-blue-300'
//           : status === 'Review'
//             ? 'bg-yellow-500/20 text-yellow-300'
//             : 'bg-green-500/20 text-green-300'
//           }`}
//       >
//         {status}
//       </span>
//     </div>
//     <div className="flex items-center justify-between text-xs">
//       <span className="text-green-400 font-medium">{budget}</span>
//       <div className="flex items-center text-gray-400">
//         <Calendar size={15} className="mr-1" />
//         {deadline ? new Date(deadline).toLocaleDateString() : 'N/A'}
//       </div>
//     </div>
//   </div>
// );


// // Reaction picker component
// const ReactionPicker = ({ isVisible, onReact, onClose }) => {
//   const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];
//   if (!isVisible) return null;

//   return (
//     <div
//       className="absolute bottom-full mb-2 bg-gray-800 border border-white/20 rounded-full px-3 py-2 flex space-x-2 z-50 shadow-lg"
//       onBlur={onClose}
//       tabIndex={-1}
//       role="dialog"
//     >
//       {reactions.map((emoji, index) => (
//         <button
//           key={index}
//           onClick={() => onReact(emoji)}
//           className="hover:scale-125 transition-transform text-lg focus:outline-none"
//           aria-label={`React with ${emoji}`}
//           type="button"
//         >
//           {emoji}
//         </button>
//       ))}
//     </div>
//   );
// };


// // Message reactions display
// const MessageReactions = ({ reactions, onReact }) => {
//   if (!reactions || Object.keys(reactions).length === 0) return null;

//   return (
//     <div className="flex flex-wrap gap-1 mt-1">
//       {Object.entries(reactions).map(([emoji, count]) => (
//         <button
//           key={emoji}
//           onClick={() => onReact(emoji)}
//           className="bg-white/10 hover:bg-white/20 rounded-full px-2 py-1 text-xs flex items-center space-x-1 transition-colors"
//           type="button"
//           aria-label={`React with ${emoji}`}
//         >
//           <span>{emoji}</span>
//           <span className="text-white/70">{count}</span>
//         </button>
//       ))}
//     </div>
//   );
// };


// // File attachment preview
// const FilePreview = ({ file, onRemove }) => (
//   <div className="relative bg-white/10 rounded-lg p-3 border border-white/20 mb-2">
//     <button
//       onClick={onRemove}
//       className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600"
//       aria-label="Remove file"
//     >
//       <X size={12} />
//     </button>
//     <div className="flex items-center space-x-2">
//       {file.type.startsWith('image/') ? (
//         <div className="w-12 h-12 bg-purple-500 rounded flex items-center justify-center">
//           <Image size={16} className="text-white" />
//         </div>
//       ) : (
//         <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center">
//           <FileText size={16} className="text-white" />
//         </div>
//       )}
//       <div className="flex-1 min-w-0">
//         <p className="text-white text-sm truncate">{file.name}</p>
//         <p className="text-gray-400 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
//       </div>
//     </div>
//   </div>
// );


// // Upload progress bar
// const UploadProgress = ({ progress }) => (
//   <div className="bg-white/10 rounded-lg p-3 border border-white/20 mb-2">
//     <div className="flex items-center justify-between mb-2">
//       <span className="text-white text-sm">Uploading...</span>
//       <span className="text-white text-sm">{progress}%</span>
//     </div>
//     <div className="w-full bg-gray-700 rounded-full h-2">
//       <div
//         className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
//         style={{ width: `${progress}%` }}
//       />
//     </div>
//   </div>
// );


// // Voice message component
// const VoiceMessage = ({ duration, isPlaying, onPlayPause }) => (
//   <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3 min-w-48">
//     <button
//       onClick={onPlayPause}
//       className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2 text-white hover:from-purple-600 hover:to-pink-600"
//       aria-label={isPlaying ? 'Pause voice message' : 'Play voice message'}
//       type="button"
//     >
//       {isPlaying ? <Pause size={16} /> : <Play size={16} />}
//     </button>
//     <div className="flex-1">
//       <div className="flex space-x-1 items-center mb-1">
//         {[...Array(20)].map((_, i) => (
//           <div
//             key={i}
//             className={`w-1 bg-white/60 rounded-full ${i < 8 ? 'h-6' : i < 12 ? 'h-4' : 'h-3'
//               }`}
//           />
//         ))}
//       </div>
//       <span className="text-xs text-white/70">{duration}</span>
//     </div>
//   </div>
// );


// // Payment message component
// const PaymentMessage = ({ amount, description, status, isRequest, onPayment }) => (
//   <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4 max-w-xs">
//     <div className="flex items-center justify-between mb-2">
//       <div className="flex items-center space-x-2">
//         <DollarSign size={16} className="text-green-400" />
//         <span className="text-white font-medium">${amount}</span>
//       </div>
//       <span
//         className={`px-2 py-1 rounded-full text-xs ${status === 'completed'
//           ? 'bg-green-500/20 text-green-300'
//           : status === 'pending'
//             ? 'bg-yellow-500/20 text-yellow-300'
//             : 'bg-red-500/20 text-red-300'
//           }`}
//       >
//         {status}
//       </span>
//     </div>
//     <p className="text-white/80 text-sm mb-3">{description}</p>
//     {isRequest && status === 'pending' && (
//       <button
//         onClick={onPayment}
//         className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
//       >
//         Pay Now
//       </button>
//     )}
//   </div>
// );


// // Message component with reactions and long press for picker
// const Message = ({
//   id,
//   sender,
//   text,
//   time,
//   isMe,
//   status,
//   type = 'text',
//   fileData,
//   paymentData,
//   voiceData,
//   reactions,
//   onReact,
//   onLongPress,
// }) => {
//   const [showReactionPicker, setShowReactionPicker] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const longPressTimer = useRef(null);

//   const handleMouseDown = () => {
//     longPressTimer.current = setTimeout(() => {
//       setShowReactionPicker(true);
//       onLongPress && onLongPress(id);
//     }, 500);
//   };

//   const handleMouseUp = () => {
//     if (longPressTimer.current) {
//       clearTimeout(longPressTimer.current);
//     }
//   };

//   const handleReact = (emoji) => {
//     onReact(id, emoji);
//     setShowReactionPicker(false);
//   };

//   return (
//     <div className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
//       <div className="relative max-w-xs lg:max-w-md">
//         <div
//           role="group"
//           aria-label={isMe ? 'Sent message' : 'Received message'}
//           tabIndex={0}
//           className={`px-4 py-2 rounded-2xl ${isMe
//             ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
//             : 'bg-white/10 text-white border border-white/20'
//             }`}
//           onMouseDown={handleMouseDown}
//           onMouseUp={handleMouseUp}
//           onTouchStart={handleMouseDown}
//           onTouchEnd={handleMouseUp}
//         >
//           {!isMe && (
//             <div className="font-medium text-sm opacity-80 mb-1">{sender}</div>
//           )}

//           {type === 'text' && <p className="text-sm whitespace-pre-wrap">{text}</p>}

//           {type === 'file' && fileData && (
//             <div className="space-y-2">
//               {fileData.type.startsWith('image/') ? (
//                 <img
//                   src={fileData.url}
//                   alt={fileData.name}
//                   className="max-w-full h-auto rounded-lg cursor-pointer"
//                   draggable={false}
//                 />
//               ) : (
//                 <a
//                   href={fileData.url}
//                   download={fileData.name}
//                   className="flex items-center space-x-2 bg-white/10 rounded p-2 cursor-pointer hover:bg-white/20"
//                   title={`Download ${fileData.name}`}
//                 >
//                   <FileText size={20} />
//                   <div>
//                     <p className="text-sm">{fileData.name}</p>
//                     <p className="text-xs opacity-70">{fileData.size}</p>
//                   </div>
//                   <Download size={16} />
//                 </a>
//               )}
//               {text && <p className="text-sm whitespace-pre-wrap">{text}</p>}
//             </div>
//           )}

//           {type === 'payment' && paymentData && <PaymentMessage {...paymentData} />}

//           {type === 'voice' && voiceData && (
//             <VoiceMessage
//               {...voiceData}
//               isPlaying={isPlaying}
//               onPlayPause={() => setIsPlaying(!isPlaying)}
//             />
//           )}

//           <div
//             className="flex items-center justify-end mt-1 space-x-1"
//             aria-live="polite"
//             aria-atomic="true"
//           >
//             <span className="text-xs opacity-70">{time}</span>
//             {isMe && (
//               <div className="text-xs opacity-70">
//                 {status === 'sent' && <Check size={12} aria-label="Sent" />}
//                 {status === 'delivered' && <CheckCheck size={12} aria-label="Delivered" />}
//                 {status === 'read' && (
//                   <CheckCheck
//                     size={12}
//                     className="text-blue-400"
//                     aria-label="Read"
//                   />
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         <MessageReactions reactions={reactions} onReact={handleReact} />

//         <ReactionPicker
//           isVisible={showReactionPicker}
//           onReact={handleReact}
//           onClose={() => setShowReactionPicker(false)}
//         />
//       </div>
//     </div>
//   );
// };


// // Chat list item component
// const ChatListItem = ({ chat, isActive, onClick }) => (
//   <div
//     className={`p-4 cursor-pointer transition-all duration-200 border-b border-white/10 hover:bg-white/5 active:bg-white/10 ${isActive ? 'bg-white/10' : ''
//       }`}
//     onClick={() => onClick(chat)}
//     role="button"
//     tabIndex={0}
//     onKeyDown={(e) => {
//       if (e.key === 'Enter') onClick(chat);
//     }}
//     aria-current={isActive ? 'true' : 'false'}
//   >
//     <div className="flex items-center space-x-3">
//       <div className="relative flex-shrink-0 rounded-full overflow-hidden w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
//         {chat.avatar && (chat.avatar.startsWith('http') || chat.avatar.startsWith('/')) ? (
//           <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
//         ) : (
//           <span>{chat.avatar}</span>
//         )}
//       </div>
//       {chat.online && (
//         <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
//       )}
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center justify-between">
//           <h4 className="text-white font-medium truncate">{chat.name}</h4>
//           <div className="flex items-center space-x-2">
//             <span className="text-xs text-gray-400">{chat.time}</span>
//             {chat.unread > 0 && (
//               <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full px-2 py-1">
//                 {chat.unread}
//               </span>
//             )}
//           </div>
//         </div>
//         <div className="mt-1 min-w-0">
//           {chat.typing ? (
//             <p className="text-sm text-purple-400 italic truncate">typing...</p>
//           ) : (
//             <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
//           )}
//         </div>
//         <div className="flex items-center justify-between mt-1">
//           <span className="text-xs text-gray-500 truncate">{chat.project}</span>
//           <span className="text-xs text-green-400 font-medium">{chat.budget}</span>
//         </div>
//       </div>
//     </div>
//   </div>
// );


// // Attachment menu component
// const AttachmentMenu = ({ isVisible, onClose, onFileSelect, onVoiceRecord }) => {
//   const fileInputRef = React.useRef(null);

//   if (!isVisible) return null;

//   const handleFileClick = () => {
//     fileInputRef.current?.click();
//   };

//   return (
//     <div
//       className="absolute bottom-full mb-2 left-1 w-40 bg-gray-800 border border-white/20 rounded-lg p-2 shadow-lg z-50
//                  grid grid-cols-2 gap-2"
//       style={{ minWidth: '10rem' }}
//     >
//       <input
//         ref={fileInputRef}
//         type="file"
//         multiple
//         className="hidden"
//         onChange={(e) => {
//           if (e.target.files) {
//             onFileSelect(Array.from(e.target.files));
//             onClose();
//           }
//         }}
//       />
//       <button
//         onClick={handleFileClick}
//         className="flex flex-col items-center justify-center p-1.5 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
//         aria-label="Attach File"
//       >
//         <FileText size={18} />
//         <span className="text-[10px] mt-1">File</span>
//       </button>
//       <button
//         onClick={() => {
//           fileInputRef.current?.setAttribute('accept', 'image/*');
//           fileInputRef.current?.click();
//           onClose();
//         }}
//         className="flex flex-col items-center justify-center p-1.5 bg-green-600 rounded-lg text-white hover:bg-green-700 transition-colors"
//         aria-label="Attach Photo"
//       >
//         <Image size={18} />
//         <span className="text-[10px] mt-1">Photo</span>
//       </button>
//       <button
//         onClick={() => {
//           onVoiceRecord();
//           onClose();
//         }}
//         className="flex flex-col items-center justify-center p-1.5 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors"
//         aria-label="Record Voice"
//       >
//         <Mic size={18} />
//         <span className="text-[10px] mt-1">Voice</span>
//       </button>
//       <button
//         onClick={() => {
//           onClose();
//           // Payment modal logic can be added here
//         }}
//         className="flex flex-col items-center justify-center p-1.5 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-colors"
//         aria-label="Send Payment"
//       >
//         <DollarSign size={18} />
//         <span className="text-[10px] mt-1">Payment</span>
//       </button>
//     </div>
//   );
// };



// const FreelancerChatDashboard = ({ conversationId }) => {
//   const { user, token } = useContext(AuthContext);
//   const [currentView, setCurrentView] = useState('list');
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [chatListData, setChatListData] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [loadingChats, setLoadingChats] = useState(false);
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [newMessage, setNewMessage] = useState('');
//   const [attachedFiles, setAttachedFiles] = useState([]);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [isUploading, setIsUploading] = useState(false);
//   const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);

//   const messagesEndRef = useRef(null);

//   // Scroll messages to bottom on new message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   useEffect(() => {
//     if (!conversationId || chatListData.length === 0) return;

//     // Try to find conversation in chatListData by conversationId
//     const chat = chatListData.find(c => c.id === conversationId);

//     if (chat) {
//       setSelectedChat(chat);
//       setCurrentView('chat');  // open the chat view if on mobile or controlling view
//     } else {
//       // Optionally: fetch conversation by ID from API here if not found locally
//       // For example:
//       // api.get(`/api/v1/messaging/conversations/${conversationId}/`)
//       //   .then(res => {
//       //      // process and add to chatListData and setSelectedChat
//       //   });
//     }
//   }, [conversationId, chatListData]);



//   // Fetch conversations list
//   useEffect(() => {
//     if (!user) return;

//     const fetchConversations = async () => {
//       setLoadingChats(true);
//       try {
//         const res = await api.get('/api/v1/messaging/conversations/', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const chats = res.data.map((convo) => ({
//           id: convo.id,
//           name: convo.client_name || `Client ${convo.client_id}`,
//           avatar: convo.client_profile_pic || '',
//           lastMessage: convo.last_message?.content || '',
//           time: convo.last_message
//             ? new Date(convo.last_message.timestamp).toLocaleTimeString([], {
//               hour: '2-digit',
//               minute: '2-digit',
//             })
//             : '',
//           unread: 0,
//           online: false,
//           project: convo.service_title || `Order #${convo.order_id}`,
//           budget: convo.service_price || '—',
//           deadline: convo.service_deadline || '—',
//           status: 'Active',
//           typing: false,
//         }));
//         setChatListData(chats);
//       } catch (error) {
//         console.error('Failed to fetch conversations:', error);
//       } finally {
//         setLoadingChats(false);
//       }
//     };

//     fetchConversations();
//   }, [user, token]);

//   const sortMessages = (msgs) => {
//     return msgs.slice().sort((a, b) => {
//       const timeA = new Date(a.created_at || a.time).getTime();
//       const timeB = new Date(b.created_at || b.time).getTime();
//       return timeA - timeB;
//     });
//   };

//   // Fetch messages for selected chat
//   useEffect(() => {
//     if (!user || !selectedChat) return;

//     const fetchMessages = async () => {
//       setLoadingMessages(true);
//       try {
//         const res = await api.get(
//           `/api/v1/messaging/conversations/${selectedChat.id}/messages/`,
//           {
//             headers: { Authorization: `Bearer ${token}` }
//           }
//         );

//         const msgs = res.data.map((msg) => {
//           const isSenderMe = Number(msg.sender_id) === Number(user.id);
//           // console.log('Fetched message:', { id: msg.id, isMe: isSenderMe, sender_id: msg.sender_id, userId: user.id });

//           return {
//             id: msg.id,
//             sender: isSenderMe ? 'Me' : selectedChat.name,
//             isMe: isSenderMe,
//             text: msg.content,
//             time: new Date(msg.created_at).toLocaleTimeString([], {
//               hour: '2-digit',
//               minute: '2-digit',
//             }),
//             status: msg.status,
//             type: msg.message_type,
//             fileData: msg.attachment
//               ? {
//                 name: msg.attachment.file_name,
//                 type: msg.attachment.file_type || '',
//                 size: `${(msg.attachment.file_size / 1024).toFixed(1)} KB`,
//                 url: msg.attachment.file,
//               }
//               : null,
//             paymentData:
//               msg.message_type === 'payment'
//                 ? {
//                   amount: msg.payment_amount,
//                   description: msg.content,
//                   status: msg.payment_status,
//                   isRequest: true,
//                   onPayment: () => alert('Implement payment logic'),
//                 }
//                 : null,
//             reactions: msg.reactions || {},
//             voiceData:
//               msg.message_type === 'voice'
//                 ? {
//                   duration: msg.voice_duration || '0:00',
//                 }
//                 : null,
//           };
//         });

//         setMessages(sortMessages(msgs));
//       } catch (err) {
//         console.error('Error loading messages:', err);
//         setMessages([]);
//       } finally {
//         setLoadingMessages(false);
//       }
//     };

//     fetchMessages();
//   }, [selectedChat, user, token]);

//   // Websocket connection for real-time messages
//   useEffect(() => {
//     if (!selectedChat || !token) return;

//     let socket;
//     let isMounted = true;

//     const backendHost = 'localhost:8000';
//     const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
//     const wsUrl = `${wsProtocol}://${backendHost}/ws/messaging/chat/${selectedChat.id}/?token=${token}`;

//     try {
//       socket = new WebSocket(wsUrl);

//       socket.onopen = () => {
//         if (!isMounted) {
//           socket.close();
//           return;
//         }
//         console.log('WebSocket connected');
//       };

//       socket.onerror = (e) => {
//         console.error('WebSocket error', e);
//       };

//       socket.onclose = (e) => {
//         if (isMounted) {
//           console.log('WebSocket disconnected', e);
//           // optional: implement reconnect logic here if desired
//         }
//       };

//       socket.onmessage = (event) => {
//         if (!isMounted) return;

//         const data = JSON.parse(event.data);
//         const isSenderMe = Number(data.sender_id) === Number(user.id);

//         console.log('Received WS message:', { id: data.id, isMe: isSenderMe, sender_id: data.sender_id, userId: user.id });

//         const newMsg = {
//           ...data,
//           sender: isSenderMe ? 'Me' : selectedChat.name,
//           isMe: isSenderMe,
//           text: data.content,
//           time: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//           status: data.status,
//           type: data.message_type,
//           reactions: data.reactions || {},
//           fileData: data.attachment ? {
//             name: data.attachment.file_name,
//             type: data.attachment.file_type || '',
//             size: `${(data.attachment.file_size / 1024).toFixed(1)} KB`,
//             url: data.attachment.file,
//           } : null,
//           paymentData: data.message_type === 'payment' ? {
//             amount: data.payment_amount,
//             description: data.content,
//             status: data.payment_status,
//             isRequest: true,
//             onPayment: () => alert('Implement payment logic'),
//           } : null,
//           voiceData: data.message_type === 'voice' ? { duration: data.voice_duration || '0:00' } : null,
//         };

//         setMessages(prev => sortMessages([...prev, newMsg]));
//       };
//     } catch (error) {
//       console.error("WebSocket initialization error", error);
//     }

//     return () => {
//       isMounted = false;
//       if (socket && socket.readyState === WebSocket.OPEN) {
//         socket.close();
//       }
//     };
//   }, [selectedChat, token, user]);

//   // Handle sending message (text or file)
//   const handleSendMessage = async (e) => {
//     if (e && e.preventDefault) e.preventDefault();
//     if (newMessage.trim() === '' && attachedFiles.length === 0) return;
//     if (!selectedChat || !user) return;

//     try {
//       const formData = new FormData();
//       formData.append('content', newMessage.trim());
//       formData.append('message_type', attachedFiles.length > 0 ? 'file' : 'text');
//       if (attachedFiles.length > 0) {
//         formData.append('attachment_file', attachedFiles[0]);
//       }

//       setIsUploading(true);
//       setUploadProgress(0);

//       await api.post(
//         `/api/v1/messaging/conversations/${selectedChat.id}/messages/`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             Authorization: `Bearer ${token}`,
//           },
//           onUploadProgress: (progressEvent) => {
//             const percentCompleted = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             setUploadProgress(percentCompleted);
//           },
//         }
//       );

//       // DO NOT add newMsg to setMessages here!
//       setNewMessage('');
//       setAttachedFiles([]);
//       setIsUploading(false);
//       setUploadProgress(0);
//     } catch (err) {
//       console.error('Message send failed:', err);
//       setIsUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   // File selection handler
//   const handleFileSelect = (files) => {
//     setAttachedFiles(files);
//     setShowAttachmentMenu(false);
//   };

//   // Voice recording simulation
//   const handleVoiceRecord = () => {
//     setIsRecording(!isRecording);
//     setShowAttachmentMenu(false);

//     if (!isRecording) {
//       setTimeout(() => {
//         const voiceMsg = {
//           id: messages.length + 1,
//           sender: 'Me',
//           isMe: true,
//           text: '',
//           time: new Date().toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//           }),
//           status: 'sent',
//           type: 'voice',
//           voiceData: {
//             duration: '0:15',
//           },
//         };
//         setMessages((prev) => [...prev, voiceMsg]);
//         setIsRecording(false);
//       }, 3000);
//     }
//   };

//   // Reaction handler
//   const handleReaction = (messageId, emoji) => {
//     setMessages((prev) =>
//       prev.map((msg) => {
//         if (msg.id === messageId) {
//           const reactions = { ...(msg.reactions || {}) };
//           reactions[emoji] = (reactions[emoji] || 0) + 1;
//           return { ...msg, reactions };
//         }
//         return msg;
//       })
//     );
//   };

//   // Handle chat selection
//   const handleChatSelect = (chat) => {
//     setSelectedChat(chat);
//     setCurrentView('chat');
//   };

//   // Back to chat list
//   const handleBackToList = () => {
//     setCurrentView('list');
//     setSelectedChat(null);
//     setMessages([]);
//   };

//   // Chat list search filter
//   const [searchQuery, setSearchQuery] = useState('');
//   const filteredChats = chatListData.filter(
//     (chat) =>
//       chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       chat.project.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const isMobile = window.innerWidth < 768;

//   return (
//     <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col md:flex-row">
//       {/* Chat List */}
//       <div
//         className={`${isMobile
//           ? currentView === 'list'
//             ? 'flex flex-col h-full'
//             : 'hidden'
//           : 'w-1/3 border-r border-white/10 flex flex-col'
//           }`}
//       >
//         <div className="p-4 border-b border-white/10">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-bold text-white">Messages</h2>
//             <button
//               className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors touch-manipulation"
//               aria-label="Filter conversations"
//             >
//               <Filter size={16} />
//             </button>
//           </div>
//           <div className="relative">
//             <Search
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//               size={16}
//             />
//             <input
//               type="search"
//               placeholder="Search conversations..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full bg-white/10 text-white pl-10 pr-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:border-purple-500 text-base"
//               aria-label="Search conversations"
//             />
//           </div>
//         </div>

//         <div
//           className="flex-1 overflow-y-auto"
//           aria-label="Conversation list"
//           role="list"
//         >
//           {loadingChats ? (
//             <p className="text-center text-gray-400 mt-4">Loading conversations...</p>
//           ) : filteredChats.length === 0 ? (
//             <p className="text-center text-gray-400 mt-4">No conversations found</p>
//           ) : (
//             filteredChats.map((chat) => (
//               <ChatListItem
//                 key={chat.id}
//                 chat={chat}
//                 isActive={selectedChat?.id === chat.id}
//                 onClick={handleChatSelect}
//               />
//             ))
//           )}
//         </div>
//       </div>

//       {/* Chat Window */}
//       <div
//         className={`flex-1 flex flex-col ${isMobile ? (currentView === 'chat' ? 'flex flex-col h-full' : 'hidden') : ''
//           }`}
//         aria-live="polite"
//       >
//         {selectedChat ? (
//           <>
//             {/* Chat Header */}
//             <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-lg flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <button
//                   onClick={handleBackToList}
//                   className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors touch-manipulation focus:outline-none md:hidden"
//                   aria-label="Back to conversation list"
//                   type="button"
//                 >
//                   <ArrowLeft size={20} />
//                 </button>
//                 <div className="relative rounded-full overflow-hidden w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium select-none">
//                   {selectedChat.avatar &&
//                     (selectedChat.avatar.startsWith('http') ||
//                       selectedChat.avatar.startsWith('/')) ? (
//                     <img
//                       src={selectedChat.avatar}
//                       alt={selectedChat.name}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <span>{selectedChat.avatar}</span>
//                   )}
//                 </div>
//                 <div>
//                   <h3 className="text-white font-medium">{selectedChat.name}</h3>
//                   <p className="text-sm text-gray-400 select-none">
//                     {selectedChat.typing
//                       ? 'typing...'
//                       : selectedChat.online
//                         ? 'online'
//                         : 'offline'}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center space-x-2">
//                 <button
//                   className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors touch-manipulation"
//                   aria-label="Start voice call"
//                   type="button"
//                 >
//                   <Phone size={16} />
//                 </button>
//                 <button
//                   className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors touch-manipulation"
//                   aria-label="Start video call"
//                   type="button"
//                 >
//                   <Video size={16} />
//                 </button>
//                 <button
//                   className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors touch-manipulation"
//                   aria-label="More options"
//                   type="button"
//                 >
//                   <MoreVertical size={16} />
//                 </button>
//               </div>
//             </div>

//             {/* Project Context */}
//             <ProjectContext
//               project={selectedChat.project}
//               budget={selectedChat.budget}
//               deadline={selectedChat.deadline}
//               status={selectedChat.status}
//             />

//             {/* Messages area */}
//             <div
//               className="flex-1 p-4 overflow-y-auto bg-black/10 touch-manipulation"
//               role="log"
//               aria-live="polite"
//               aria-relevant="additions text"
//             >
//               {loadingMessages ? (
//                 <p className="text-center text-gray-400 mt-4">Loading messages...</p>
//               ) : messages.length === 0 ? (
//                 <p className="text-center text-gray-400 mt-4">No messages</p>
//               ) : (
//                 messages.map((msg) => (
//                   <Message
//                     key={msg.id}
//                     {...msg}
//                     onReact={handleReaction}
//                     onLongPress={(id) => console.log('Long press on message', id)}
//                   />
//                 ))
//               )}

//               <div ref={messagesEndRef} />

//               {isUploading && <UploadProgress progress={uploadProgress} />}
//             </div>

//             {/* File attachment previews */}
//             {attachedFiles.length > 0 && (
//               <div className="p-4 border-t border-white/10 bg-black/20">
//                 <div className="space-y-2">
//                   {attachedFiles.map((file, index) => (
//                     <FilePreview
//                       key={index}
//                       file={file}
//                       onRemove={() =>
//                         setAttachedFiles((files) => files.filter((_, i) => i !== index))
//                       }
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Message input form */}
//             <form
//               onSubmit={handleSendMessage}
//               className="p-4 border-t border-white/20 bg-black/20 backdrop-blur-lg flex items-center space-x-2 relative"
//             >
//               <div className="relative inline-block">
//                 <button
//                   type="button"
//                   onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
//                   className="text-gray-400 hover:text-white transition-colors p-2 rounded-md"
//                   aria-label="Open attachment menu"
//                 >
//                   <Plus size={20} />
//                 </button>

//                 <AttachmentMenu
//                   isVisible={showAttachmentMenu}
//                   onClose={() => setShowAttachmentMenu(false)}
//                   onFileSelect={handleFileSelect}
//                   onVoiceRecord={handleVoiceRecord}
//                 />
//               </div>


//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 placeholder={isRecording ? 'Recording voice...' : 'Type a message...'}
//                 disabled={isRecording}
//                 className="flex-grow min-w-0 bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20
//                focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
//                 aria-label="Enter message"
//                 autoComplete="off"
//               />

//               {isRecording ? (
//                 <div className="flex items-center space-x-2">
//                   <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-2 rounded-lg">
//                     <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//                     <span className="text-red-400 text-sm">Recording...</span>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={handleVoiceRecord}
//                     className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-red-400"
//                     aria-label="Stop recording"
//                   >
//                     <MicOff size={16} />
//                   </button>
//                 </div>
//               ) : (
//                 <>
//                   <button
//                     type="button"
//                     className="text-gray-400 hover:text-white transition-colors p-2 rounded-md touch-manipulation focus:outline-none focus:ring-2 focus:ring-purple-500"
//                     aria-label="Add emoji"
//                   >
//                     <Smile size={20} />
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={isUploading || (newMessage.trim() === '' && attachedFiles.length === 0)}
//                     className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg
//                    hover:from-purple-600 hover:to-pink-600 transition-all duration-200 touch-manipulation
//                    focus:outline-none focus:ring-2 focus:ring-pink-400"
//                     aria-label="Send message"
//                   >
//                     <Send size={16} />
//                   </button>
//                 </>
//               )}
//             </form>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center bg-black/10 select-none">
//             <div className="text-center px-6">
//               <MessageCircle size={64} className="text-gray-600 mx-auto mb-4" />
//               <h3 className="text-xl font-medium text-gray-400 mb-2">Select a conversation</h3>
//               <p className="text-gray-500">Choose a client from the list to start chatting</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FreelancerChatDashboard;
