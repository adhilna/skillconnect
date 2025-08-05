import React, { useState, useRef } from 'react';
import {
    Check,
    CheckCheck,
    FileText,
    Download,
    Image,
    Pause,
    Play,
    MicOff,
} from 'lucide-react';

import ReactionPicker from './ReactionPicker';
import MessageReactions from './MessageReactions';
import PaymentMessage from './PaymentMessage';
import VoiceMessage from './VoiceMessage';

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
                            {text && <p className="text-sm whitespace-pre-wrap">{text}</p>}
                        </div>
                    )}

                    {type === 'payment' && paymentData && <PaymentMessage {...paymentData} />}

                    {type === 'voice' && voiceData && (
                        <VoiceMessage
                            {...voiceData}
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
                                {status === 'read' && (
                                    <CheckCheck size={12} className="text-blue-400" aria-label="Read" />
                                )}
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

export default Message;
