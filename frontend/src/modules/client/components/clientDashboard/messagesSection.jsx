import React, { useState, useRef, useEffect, useContext } from 'react';
import api from '../../../../api/api';
import { AuthContext } from '../../../../context/AuthContext';
import {
    MessageCircle,
    Filter,
    Send,
    Phone,
    Video,
    DollarSign,
    Search,
    MoreVertical,
    Calendar,
    Check,
    CheckCheck,
    Paperclip,
    Smile,
    ArrowLeft,
    FileText,
    Download,
    Image,
    Mic,
    MicOff,
    Plus,
    X,
    Play,
    Pause,
} from 'lucide-react';
import ProjectContext from './messagesSection/ProjectContext';
import ChatHeader from './messagesSection/ChatHeader';

// Reaction picker component
const ReactionPicker = ({ isVisible, onReact, onClose }) => {
    const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];
    if (!isVisible) return null;

    return (
        <div
            className="absolute bottom-full mb-2 bg-gray-800 border border-white/20 rounded-full px-3 py-2 flex space-x-2 z-50 shadow-lg"
            onBlur={onClose}
            tabIndex={-1}
            role="dialog"
        >
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
    <div className="relative bg-white/10 rounded-lg p-3 border border-white/20 mb-2 flex items-center space-x-3">
        <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 focus:outline-none"
            aria-label="Remove attachment"
            type="button"
        >
            <X size={12} />
        </button>
        {file.type.startsWith('image/') ? (
            <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center text-white font-bold leading-none">
                <Image size={16} />
            </div>
        ) : (
            <div className="w-12 h-12 bg-cyan-500 rounded flex items-center justify-center text-white font-bold leading-none">
                <FileText size={16} />
            </div>
        )}
        <div className="flex-1 min-w-0">
            <p className="text-white text-sm truncate" title={file.name}>
                {file.name}
            </p>
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
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
            />
        </div>
    </div>
);

// Voice message component
const VoiceMessage = ({ duration, audioUrl, isPlaying, onPlayPause }) => {
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    // Format seconds to m:ss
    const formatTime = (secs) => {
        if (!secs || isNaN(secs) || !isFinite(secs)) return '0:00';
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Play/pause control
    useEffect(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.play().catch((err) => {
                console.error('Audio play failed:', err);
            });
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // Load metadata + track time
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => {
            setCurrentTime(audio.currentTime);
        };

        const setDur = () => {
            if (!isNaN(audio.duration) && isFinite(audio.duration)) {
                setTotalDuration(audio.duration);
            }
        };

        // First play click flag
        const markStarted = () => setHasStarted(true);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', setDur);
        audio.addEventListener('play', markStarted);

        audio.onended = () => {
            onPlayPause(false);
            setCurrentTime(0);
            setHasStarted(false); // reset so we show total length again
        };

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', setDur);
            audio.removeEventListener('play', markStarted);
        };
    }, [onPlayPause]);

    return (
        <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3 min-w-48">
            <button
                onClick={() => onPlayPause(!isPlaying)}
                className="bg-gradient-to-r from-blue-500 to-blue-500 rounded-full p-2 text-white hover:from-vlue-600 hover:to-pibluenk-600"
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
                {/* WhatsApp style display */}
                <span className="text-xs text-white/70">
                    {hasStarted || isPlaying
                        ? formatTime(currentTime)
                        : formatTime(totalDuration || parseDuration(duration))}
                </span>
            </div>

            <audio ref={audioRef} src={audioUrl} preload="metadata" />
        </div>
    );
};

// Parse backend duration string (m:ss) if needed
function parseDuration(str) {
    if (!str) return 0;
    const parts = str.split(':');
    if (parts.length === 2) {
        const m = parseInt(parts[0], 10);
        const s = parseInt(parts[1], 10);
        if (!isNaN(m) && !isNaN(s)) return m * 60 + s;
    }
    return 0;
}


// Payment message component for client (pay only)
const PaymentMessage = ({ amount, description, status, isRequest, onPayment }) => (
    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4 max-w-xs">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
                <DollarSign size={16} className="text-green-400" />
                <span className="text-white font-medium">${amount}</span>
            </div>
            <span
                className={`px-2 py-1 rounded-full text-xs ${status === 'completed'
                    ? 'bg-green-500/20 text-green-300'
                    : status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}
            >
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
    onLongPress,
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
                    aria-label={isMe ? 'Sent message' : 'Received message'}
                    tabIndex={0}
                    className={`px-4 py-2 rounded-2xl ${isMe
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
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

                    {type === 'payment' && paymentData && <PaymentMessage {...paymentData} />}

                    {type === 'voice' && voiceData && (
                        <VoiceMessage
                            {...voiceData}
                            audioUrl={fileData.url}
                            isPlaying={isPlaying}
                            onPlayPause={() => setIsPlaying(!isPlaying)}
                        />
                    )}

                    <div
                        className="flex items-center justify-end mt-1 space-x-1"
                        aria-live="polite"
                        aria-atomic="true"
                    >
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
        onKeyDown={(e) => {
            if (e.key === 'Enter') onClick(chat);
        }}
        aria-current={isActive ? 'true' : 'false'}
    >
        <div className="flex items-center space-x-3">
            <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-medium">
                    {chat.avatar && (chat.avatar.startsWith('http') || chat.avatar.startsWith('/')) ? (
                        <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                    ) : (
                        <span>{chat.avatar}</span>
                    )}
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
                            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs rounded-full px-2 py-1">
                                {chat.unread}
                            </span>
                        )}
                    </div>
                </div>
                <div className="mt-1 min-w-0">
                    {chat.typing ? (
                        <p className="text-sm text-blue-400 italic truncate">typing...</p>
                    ) : (
                        <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                    )}
                </div>
                <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500 truncate">{chat.project || 'No project'}</span>
                    <span className="text-xs text-green-400 font-medium">{chat.budget || 'N/A'}</span>
                </div>
            </div>
        </div>
    </div>
);

// Attachment menu component
const AttachmentMenu = ({ isVisible, onClose, onFileSelect, onVoiceRecord }) => {
    const fileInputRef = React.useRef(null);

    if (!isVisible) return null;

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            className="absolute bottom-full mb-2 left-1 w-40 bg-gray-800 border border-white/20 rounded-lg p-2 shadow-lg z-50 grid grid-cols-2 gap-2"
            style={{ minWidth: '10rem' }}
        >
            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                    if (e.target.files) {
                        onFileSelect(Array.from(e.target.files));
                        onClose();
                    }
                }}
            />
            <button
                onClick={handleFileClick}
                className="flex flex-col items-center justify-center p-1.5 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
                aria-label="Attach File"
            >
                <FileText size={18} />
                <span className="text-[10px] mt-1">File</span>
            </button>
            <button
                onClick={() => {
                    fileInputRef.current?.setAttribute('accept', 'image/*');
                    fileInputRef.current?.click();
                    onClose();
                }}
                className="flex flex-col items-center justify-center p-1.5 bg-green-600 rounded-lg text-white hover:bg-green-700 transition-colors"
                aria-label="Attach Photo"
            >
                <Image size={18} />
                <span className="text-[10px] mt-1">Photo</span>
            </button>
            <button
                onClick={() => {
                    onVoiceRecord();
                    onClose();
                }}
                className="flex flex-col items-center justify-center p-1.5 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors"
                aria-label="Record Voice"
            >
                <Mic size={18} />
                <span className="text-[10px] mt-1">Voice</span>
            </button>
            {/* <button
                onClick={() => {
                    onClose();
                    // Freelancer can send payment requests here if needed - else remove or disable
                }}
                className="flex flex-col items-center justify-center p-1.5 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-colors"
                aria-label="Send Payment"
            >
                <DollarSign size={18} />
                <span className="text-[10px] mt-1">Payment</span>
            </button> */}
        </div>
    );
};

const ClientChatDashboard = ({ conversationId }) => {
    const [chatListData, setChatListData] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [currentView, setCurrentView] = useState('list');
    const [loadingChats, setLoadingChats] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const { user, token } = useContext(AuthContext);
    const [newMessage, setNewMessage] = useState('');
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const messagesEndRef = useRef(null);


    const isMobile = window.innerWidth < 768;

    const mediaRecorderRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const chunksRef = useRef([]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!conversationId || chatListData.length === 0) return;

        const conversation = chatListData.find(c => c.id === conversationId);
        if (conversation) {
            setSelectedChat(conversation);
            setCurrentView('chat');
        } else {
            // Optionally fetch conversation by ID if not found locally
        }
    }, [conversationId, chatListData]);


    // Fetch conversations list from backend
    useEffect(() => {
        if (!user || !token) return;

        const fetchConversations = async () => {
            setLoadingChats(true);
            try {
                const res = await api.get('/api/v1/messaging/conversations/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('Fetched conversations:', res.data);

                const chats = res.data.map(convo => {
                    const name = convo.freelancer_name || `Freelancer ${convo.freelancer_id || ''}`;
                    const avatar = convo.freelancer_profile_pic || '';
                    const project = convo.service_title && convo.service_title.trim() !== '' ? convo.service_title : `Order #${convo.order_id}`;
                    const budget = convo.service_price && convo.service_price !== 'null' ? convo.service_price : '';
                    const lastMessageContent = convo.last_message?.content || '';

                    // Normalize orderType
                    let normalizedOrderType = 'service';
                    if (convo.order_type) {
                        const type = convo.order_type.toLowerCase();
                        if (type === 'proposalorder' || type === 'proposal') normalizedOrderType = 'proposal';
                        else if (type === 'serviceorder' || type === 'service') normalizedOrderType = 'service';
                    }

                    return {
                        id: convo.id,
                        name,
                        avatar,
                        lastMessage: lastMessageContent,
                        time: convo.last_message
                            ? new Date(convo.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : '',
                        unread: convo.unread_count || 0,
                        online: convo.freelancer_online || false,
                        project,
                        budget,
                        deadline: convo.service_deadline || '—',
                        status: convo.status || 'Active',
                        typing: convo.freelancer_typing || false,
                        orderType: normalizedOrderType,
                        orderId: convo.order_id,
                    };
                });



                setChatListData(chats);
            } catch (err) {
                console.error('Failed to fetch conversations', err);
            } finally {
                setLoadingChats(false);
            }
        };


        fetchConversations();
    }, [user, token]);

    // Helper to sort messages by timestamp
    const sortMessages = (msgs) => {
        return msgs.slice().sort((a, b) => {
            const timeA = new Date(a.created_at || a.time).getTime();
            const timeB = new Date(b.created_at || b.time).getTime();
            return timeA - timeB;
        });
    };

    // Fetch messages for selected conversation
    useEffect(() => {
        if (!user || !token || !selectedChat) return;

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
                        created_at: msg.created_at,
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
                                    isRequest: false, // Client can only pay, no request creation
                                    onPayment: () => handlePaymentClick(msg),
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
                console.error('Error fetching messages', err);
                setMessages([]);
            } finally {
                setLoadingMessages(false);
            }
        };

        fetchMessages();
    }, [selectedChat, token, user]);

    // WebSocket for real-time messages
    useEffect(() => {
        if (!selectedChat || !token) return;

        let isMounted = true;
        const backendHost = 'localhost:8000';
        const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const wsUrl = `${wsProtocol}://${backendHost}/ws/messaging/chat/${selectedChat.id}/?token=${token}`;
        const socket = new WebSocket(wsUrl);

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

        socket.onclose = () => {
            if (isMounted) console.log('WebSocket disconnected');
        };

        socket.onmessage = (event) => {
            if (!isMounted) return;
            const data = JSON.parse(event.data);
            const isSenderMe = Number(data.sender_id) === Number(user.id);

            const newMsg = {
                ...data,
                sender: isSenderMe ? 'Me' : selectedChat.name,
                isMe: isSenderMe,
                text: data.content,
                time: new Date(data.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                created_at: data.created_at,
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
                    isRequest: false,
                    onPayment: () => handlePaymentClick(data),
                } : null,
                voiceData: data.message_type === 'voice' ? {
                    duration: data.voice_duration || '0:00',
                } : null,
            };

            setMessages(prev => {
                const combined = [...prev, newMsg];
                const uniqueMessages = Array.from(new Map(combined.map(m => [m.id, m])).values());
                return sortMessages(uniqueMessages);
            });
        };

        return () => {
            isMounted = false;
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [selectedChat, token, user]);


    // Sending message handler
    const handleSendMessage = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (newMessage.trim() === '' && attachedFiles.length === 0) return;
        if (!selectedChat || !user) return;

        try {
            const formData = new FormData();
            formData.append('content', newMessage.trim());
            formData.append('message_type', attachedFiles.length > 0 ? 'file' : 'text');
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

            // DO NOT update messages here, let the WebSocket event do it!
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

    // File selection handler
    const handleFileSelect = (files) => {
        setAttachedFiles(files);
        setShowAttachmentMenu(false);
    };

    // Voice recording handler (simulated)
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

    // Payment modal handlers
    const handlePaymentClick = (paymentData) => {
        setSelectedPayment(paymentData);
        setShowPaymentModal(true);
    };

    const handlePaymentConfirm = async () => {
        try {
            // Call backend to update payment status here if needed

            setMessages((prev) =>
                prev.map((msg) => {
                    if (msg.type === 'payment' && msg.paymentData?.amount === selectedPayment?.amount) {
                        return {
                            ...msg,
                            paymentData: {
                                ...msg.paymentData,
                                status: 'completed',
                            },
                        };
                    }
                    return msg;
                })
            );

            setShowPaymentModal(false);
            setSelectedPayment(null);
            alert('Payment processed successfully!');
        } catch (err) {
            console.error('Payment processing failed:', err);
            alert('Payment processing failed. Please try again.');
        }
    };

    // Filter chats based on search
    const filteredChats = chatListData.filter(
        (chat) =>
            chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chat.project.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Enhanced messages to pass onPayment handler dynamically
    const enhancedMessages = messages.map((msg) => {
        if (msg.type === 'payment' && msg.paymentData) {
            return {
                ...msg,
                paymentData: {
                    ...msg.paymentData,
                    onPayment: () => handlePaymentClick(msg),
                },
            };
        }
        return msg;
    });

    // Handle chat selection
    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
        setCurrentView('chat');
        setMessages([]);
    };

    // Back to chat list for mobile view
    const handleBackToList = () => {
        setCurrentView('list');
        setSelectedChat(null);
        setMessages([]);
    };

    return (
        <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col md:flex-row">

            {/* Chat List */}
            <div
                className={`w-full md:w-1/3 border-r border-white/10 flex flex-col h-full ${isMobile ? (currentView === 'list' ? 'flex' : 'hidden') : 'flex'
                    }`}
            >

                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">Messages</h2>
                        <button
                            className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors touch-manipulation"
                            aria-label="Filter conversations"
                        >
                            <Filter size={16} />
                        </button>
                    </div>
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                        />
                        <input
                            type="search"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/10 text-white pl-10 pr-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:border-blue-500 text-base"
                            aria-label="Search conversations"
                            spellCheck={false}
                            autoComplete="off"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto" aria-label="Conversation list" role="list">
                    {loadingChats ? (
                        <p className="text-center text-gray-400 mt-4">Loading conversations...</p>
                    ) : filteredChats.length === 0 ? (
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
            <div
                className={`flex-1 flex flex-col h-full ${isMobile ? (currentView === 'chat' ? 'flex' : 'hidden') : 'flex'
                    }`}
                aria-live="polite"
            >

                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <ChatHeader
                            chat={selectedChat}
                            onBack={handleBackToList}
                            isMobile={isMobile}
                            token={token}
                            userId={user?.id}
                        />
                        {/* Project Context */}
                        <ProjectContext
                            project={selectedChat.project}
                            budget={selectedChat.budget}
                            deadline={selectedChat.deadline}
                            status={selectedChat.status}
                            token={token}
                            orderType={selectedChat.orderType}
                            orderId={selectedChat.orderId}
                        />

                        {/* Messages Area */}
                        <div
                            className="flex-1 p-4 overflow-y-auto bg-black/10 touch-manipulation"
                            role="log"
                            aria-live="polite"
                            aria-relevant="additions text"
                        >
                            {loadingMessages ? (
                                <p className="text-center text-gray-400 mt-4">Loading messages...</p>
                            ) : messages.length === 0 ? (
                                <p className="text-center text-gray-400 mt-4">No messages</p>
                            ) : (
                                enhancedMessages.map((msg) => (
                                    <Message
                                        key={msg.id}
                                        {...msg}
                                        onReact={handleReaction}
                                        onLongPress={(id) => console.log('Long press on message', id)}
                                    />
                                ))
                            )}
                            <div ref={messagesEndRef} />
                            {isUploading && <UploadProgress progress={uploadProgress} />}
                        </div>

                        {/* Attached Files Preview */}
                        {attachedFiles.length > 0 && (
                            <div className="p-4 border-t border-white/10 bg-black/20">
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {attachedFiles.map((file, index) => (
                                        <FilePreview
                                            key={index}
                                            file={file}
                                            onRemove={() => setAttachedFiles((files) => files.filter((_, i) => i !== index))}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Message Input + Attachment menu */}
                        <form
                            onSubmit={handleSendMessage}
                            className="p-4 border-t border-white/20 bg-black/20 backdrop-blur-lg flex items-center space-x-2 relative"
                        >
                            <div className="relative inline-block">
                                <button
                                    type="button"
                                    onClick={() => setShowAttachmentMenu((v) => !v)}
                                    className="text-gray-400 hover:text-white transition-colors p-2 rounded-md touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    aria-label="Open attachment menu"
                                >
                                    <Plus size={20} />
                                </button>
                                <AttachmentMenu
                                    isVisible={showAttachmentMenu}
                                    onClose={() => setShowAttachmentMenu(false)}
                                    onFileSelect={handleFileSelect}
                                    onVoiceRecord={handleVoiceRecord}
                                />
                            </div>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={isRecording ? 'Recording voice...' : 'Type a message...'}
                                disabled={isRecording}
                                className="flex-grow min-w-0 bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                                aria-label="Enter message"
                                autoComplete="off"
                                spellCheck={false}
                            />
                            {isRecording ? (
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-2 rounded-lg text-red-400 text-sm select-none">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                        Recording...
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleVoiceRecord}
                                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-red-400"
                                        aria-label="Stop recording"
                                    >
                                        <MicOff size={16} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-white transition-colors p-2 rounded-md touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        aria-label="Add emoji"
                                    >
                                        <Smile size={20} />
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUploading || (newMessage.trim() === '' && attachedFiles.length === 0)}
                                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-2 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        aria-label="Send message"
                                    >
                                        <Send size={16} />
                                    </button>
                                </>
                            )}
                        </form>

                        {/* Payment Modal */}
                        {showPaymentModal && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                                <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 w-full max-w-md mx-4">
                                    <h3 className="text-xl font-bold text-white mb-4">Payment Details</h3>
                                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4 mb-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <DollarSign size={20} className="text-green-400" />
                                                <span className="text-white font-bold text-lg">${selectedPayment?.amount}</span>
                                            </div>
                                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">{selectedPayment?.status}</span>
                                        </div>
                                        <p className="text-white/80 text-sm mb-4">{selectedPayment?.description}</p>
                                        <div className="space-y-2 text-sm text-white/70">
                                            <div className="flex justify-between">
                                                <span>Amount:</span>
                                                <span className="text-white">${selectedPayment?.amount}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Processing Fee:</span>
                                                <span className="text-white">$2.50</span>
                                            </div>
                                            <hr className="border-white/20" />
                                            <div className="flex justify-between font-medium">
                                                <span>Total:</span>
                                                <span className="text-white">${(selectedPayment?.amount + 2.5).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => {
                                                setShowPaymentModal(false);
                                                setSelectedPayment(null);
                                            }}
                                            className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                                            type="button"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handlePaymentConfirm}
                                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-3 rounded-lg font-medium transition-all"
                                            type="button"
                                        >
                                            Pay Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-black/10 select-none">
                        <div className="text-center px-6">
                            <MessageCircle size={64} className="text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-400 mb-2">Select a conversation</h3>
                            <p className="text-gray-500">Choose a freelancer from the list to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientChatDashboard;
