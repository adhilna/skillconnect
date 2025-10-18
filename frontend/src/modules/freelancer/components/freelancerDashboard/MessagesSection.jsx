import React, { useState, useContext, useEffect, useRef } from 'react';
import api from '../../../../api/api';
import { AuthContext } from '../../../../context/AuthContext';
import { MessageCircle } from 'lucide-react';

import ChatList from './messagesSection/ChatList';
import ChatMessages from './messagesSection/ChatMessages';
import ChatInput from './messagesSection/ChatInput';
import ProjectContext from './messagesSection/ProjectContext';
import ChatHeader from './messagesSection/ChatHeader';
import config from '../../../../config/environment';

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

  const [contract, setContract] = useState(null);
  const [currentWorkflowStatus, setCurrentWorkflowStatus] = useState('planning');
  const [loadingContract, setLoadingContract] = useState(false);
  const [contractError, setContractError] = useState(null);
  const [contractForm, setContractForm] = useState({
    amount: '',
    deadline: '',
    terms: '',
    milestones: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const socketRef = useRef(null);

  const isMobile = window.innerWidth < 768;

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const chunksRef = useRef([]);

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

        const chats = res.data.map((convo) => {
          // Normalize orderType to always be 'service' or 'proposal'
          let normalizedOrderType = 'service';
          if (convo.order_type) {
            const type = convo.order_type.toLowerCase();
            if (type === 'proposalorder' || type === 'proposal') normalizedOrderType = 'proposal';
            else if (type === 'serviceorder' || type === 'service') normalizedOrderType = 'service';
          }

          return {
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

            orderId: convo.order_id,                      // The order PK you need for contracts
            orderType: normalizedOrderType,               // Always 'service' or 'proposal'
            serviceOrderId: convo.service_order_id || null,      // Fixes previous typo
            proposalOrderId: convo.proposal_order_id || null,
          };
        });

        setChatListData(chats);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
        console.log(selectedChat.orderType, selectedChat.orderId);
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
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Map messages and fetch latest payment status if needed
        const msgs = await Promise.all(
          res.data.map(async (msg) => {
            const isSenderMe = Number(msg.sender_id) === Number(user.id);

            let paymentStatus = msg.payment_status;

            // Fetch latest status only for payment messages
            if (msg.message_type === 'payment' && msg.payment_request) {
              try {
                const paymentRes = await api.get(
                  `/api/v1/messaging/payment-requests/${msg.payment_request}/`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                paymentStatus = paymentRes.data.status; // completed, failed, rejected, pending
              } catch (err) {
                console.error('Error fetching payment request for message', msg.id, err);
              }
            }

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
                    status: paymentStatus, // <-- updated status
                    isRequest: true,
                    onPayment: () => { }, // freelancers don’t pay
                  }
                  : null,
              reactions: msg.reactions || {},
              voiceData:
                msg.message_type === 'voice'
                  ? { duration: msg.voice_duration || '0:00' }
                  : null,
            };
          })
        );

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

    // const backendHost = 'localhost:8000';
    // const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${config.wsUrl}/ws/messaging/chat/${selectedChat.id}/?token=${token}`;
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
        console.log("WS message received:", data);

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
              id: data.payment_request || data.id,
              amount: data.payment_amount,
              description: data.content,
              status: data.payment_status,
              isRequest: true,
              onPayment: () => alert('Implement payment logic'),
            } : null,
            voiceData: data.message_type === 'voice' ? { duration: data.voice_duration || '0:00' } : null,
          };

          setMessages(prev => {
            const index = prev.findIndex(
              m =>
                m.id === newMsg.id ||  // Confirmed message matched by id
                (typeof m.id === 'string' && m.id.startsWith('temp-') &&
                  m.content === newMsg.content && m.paymentData?.amount === newMsg.paymentData?.amount)
            );

            if (index !== -1) {
              const copy = [...prev];
              copy[index] = newMsg;  // Replace optimistic message with confirmed message
              return copy;
            } else {
              return sortMessages([...prev, newMsg]);
            }
          });

          return;
        }

        // ------------------ Handle payment status update ------------------
        if (data.type === 'payment_status_update') {
          const { payment_id, status } = data;

          setMessages(prev =>
            prev.map(msg =>
              msg.paymentData && msg.paymentData.id === payment_id
                ? {
                  ...msg,
                  paymentData: {
                    ...msg.paymentData,
                    status, // update the status in real-time
                  },
                  payment_status: status,
                }
                : msg
            )
          );

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

  // CONTRACT fetching lifted here
  useEffect(() => {
    if (!selectedChat?.orderType || !selectedChat?.orderId || !token) {
      setContract(null);
      setCurrentWorkflowStatus('planning');
      setContractForm({
        amount: '',
        deadline: '',
        terms: '',
        milestones: '',
      });
      return;
    }

    setLoadingContract(true);
    setContractError(null);

    api.get(
      `/api/v1/messaging/contracts/?order_type=${selectedChat.orderType}&order_id=${selectedChat.orderId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((response) => {
        if (response.data.length > 0) {
          const c = response.data[0];
          setContract(c);
          setCurrentWorkflowStatus(c.workflow_status || 'planning');
          setContractForm({
            amount: c.amount || '',
            deadline: c.deadline || '',
            terms: c.terms || '',
            milestones: c.milestones || '',
          });
        } else {
          setContract(null);
          setCurrentWorkflowStatus('planning');
          setContractForm({
            amount: '',
            deadline: '',
            terms: '',
            milestones: '',
          });
        }
      })
      .catch((err) => {
        setContractError('Failed to load contract data.');
        setContract(null);
        console.error(err);
      })
      .finally(() => {
        setLoadingContract(false);
      });
  }, [selectedChat, token]);

  // WebSocket for contract updates lifted here
  useEffect(() => {
    if (!selectedChat?.orderType || !selectedChat?.orderId || !token) return;

    let isMounted = true;
    const backendHost = 'localhost:8000';
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${wsProtocol}://${backendHost}/ws/messaging/contracts/${selectedChat.orderType}/${selectedChat.orderId}/?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      if (!isMounted) {
        ws.close();
        return;
      }
      console.log('Contract WebSocket connected');
    };

    ws.onerror = (err) => {
      console.error('Contract WebSocket error', err);
    };

    ws.onclose = (e) => {
      if (isMounted) {
        console.log('Contract WebSocket disconnected', e);
      }
    };

    ws.onmessage = (event) => {
      if (!isMounted) return;
      try {
        const data = JSON.parse(event.data);
        console.log('Contract update received', data);
        setContract(data);
        setCurrentWorkflowStatus(data.workflow_status || 'planning');
        setContractForm({
          amount: data.amount || '',
          deadline: data.deadline || '',
          terms: data.terms || '',
          milestones: data.milestones || '',
        });
      } catch (err) {
        console.error('Error parsing contract WS message', err);
      }
    };

    socketRef.current = ws;

    return () => {
      isMounted = false;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [selectedChat, token]);

  // contract sending handler
  const handleSendContract = () => {
    if (!selectedChat?.orderType || !selectedChat?.orderId) {
      console.error('Order type or order ID not available');
      return;
    }

    if (!contractForm.amount || !contractForm.deadline) {
      alert('Please fill in at least amount and deadline');
      return;
    }

    const normalizedOrderType = selectedChat.orderType.toLowerCase().startsWith('service')
      ? 'service'
      : selectedChat.orderType.toLowerCase().startsWith('proposal')
        ? 'proposal'
        : null;

    if (!normalizedOrderType) {
      alert('Invalid order type');
      return;
    }

    const payload = {
      amount: contractForm.amount,
      deadline: contractForm.deadline,
      terms: contractForm.terms,
      milestones: contractForm.milestones,
      status: 'pending',
      workflow_status: 'planning',
      order_type: normalizedOrderType,
      order_id: selectedChat.orderId,
    };

    api.post('/api/v1/messaging/contracts/', payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        setContract(response.data);
        setCurrentWorkflowStatus(response.data.workflow_status || 'planning');
        setIsModalOpen(false);
        setContractForm({
          amount: '',
          deadline: '',
          terms: '',
          milestones: '',
        });
      })
      .catch((err) => {
        alert('Failed to send contract. Please try again.');
        console.error(err);
      });
  };

  // Handle workflow status update of contract
  const handleStatusUpdate = (newStatus) => {
    if (!contract?.id) return;

    api.patch(
      `/api/v1/messaging/contracts/${contract.id}/`,
      { workflow_status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((response) => {
        setContract(response.data);
        setCurrentWorkflowStatus(response.data.workflow_status);
        setIsDropdownOpen(false);
      })
      .catch((err) => {
        alert('Failed to update workflow status.');
        console.error(err);
      });
  };

  // Handle send message
  const handleSendMessage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (newMessage.trim() === '' && attachedFiles.length === 0) return;
    if (!selectedChat || !user) return;

    try {
      const formData = new FormData();
      formData.append('content', newMessage.trim());
      if (attachedFiles.length > 0 && attachedFiles[0].type.startsWith('audio/')) {
        formData.append('message_type', 'voice');
        formData.append('content', ''); // voice notes usually have no text
        formData.append('attachment_file', attachedFiles[0]);
      } else if (attachedFiles.length > 0) {
        formData.append('message_type', 'file');
        formData.append('content', newMessage.trim());
        formData.append('attachment_file', attachedFiles[0]);
      } else {
        formData.append('message_type', 'text');
        formData.append('content', newMessage.trim());
      }
      console.log("Attached before send:", attachedFiles);
      console.log("FormData entries:", [...formData.entries()]);


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
    console.log("Selected files:", files);
    setAttachedFiles(files);
    setShowAttachmentMenu(false);
  };

  // Voice record simulation
  const handleVoiceRecord = async () => {
    setShowAttachmentMenu(false);

    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        mediaRecorderRef.current = new MediaRecorder(stream);
        chunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error accessing microphone:', err);
      }
    } else {
      if (!mediaRecorderRef.current) {
        console.error('MediaRecorder is not initialized');
        setIsRecording(false);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], `voice-${Date.now()}.webm`, {
          type: 'audio/webm',
          lastModified: Date.now(),
        });

        handleFileSelect([file]);

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        }

        setIsRecording(false);
      };

      mediaRecorderRef.current.stop();
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

  // Parent component
  const sendTypingEvent = (isTyping) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "typing",
        typing: isTyping,
      }));
    }
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
            <ChatHeader
              chat={selectedChat}
              onBack={handleBackToList}
              isMobile={isMobile}
              token={token}
            />

            <ProjectContext
              handleSendContract={handleSendContract}
              handleStatusUpdate={handleStatusUpdate}
              contract={contract}
              setContract={setContract}
              currentWorkflowStatus={currentWorkflowStatus}
              setCurrentWorkflowStatus={setCurrentWorkflowStatus}
              contractForm={contractForm}
              setContractForm={setContractForm}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              isMinimized={isMinimized}
              setIsMinimized={setIsMinimized}
              loadingContract={loadingContract}
              error={contractError}
              project={selectedChat.project}
              budget={selectedChat.budget}
              status={selectedChat.status}
              orderType={selectedChat.orderType}
              orderId={selectedChat.orderId}
              token={token}
              user={selectedChat.name}
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
              contract={contract}
              token={token}
              messages={messages}
              setMessages={setMessages}
              sendTyping={sendTypingEvent}
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
