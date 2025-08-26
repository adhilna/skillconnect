import React from "react";
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";

const ChatHeader = ({ chat, onBack, isMobile, onVoiceCall, onVideoCall }) => (
    <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
            {isMobile && (
                <button
                    onClick={onBack}
                    className="text-white p-2 rounded-lg hover:bg-white/10 md:hidden"
                    aria-label="Back to conversation list"
                >
                    <ArrowLeft size={20} />
                </button>
            )}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                {chat?.avatar?.startsWith("http") ? (
                    <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                ) : (
                    <span>{chat?.avatar}</span>
                )}
            </div>
            <div>
                <h3 className="text-white font-medium">{chat?.name}</h3>
                <p className="text-sm text-gray-400">{chat?.typing ? "typing..." : chat?.online ? "online" : "offline"}</p>
            </div>
        </div>
        <div className="flex items-center space-x-2">
            <button
                onClick={onVoiceCall}
                className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20"
                aria-label="Start voice call"
            >
                <Phone size={16} />
            </button>
            <button
                onClick={onVideoCall}
                className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20"
                aria-label="Start video call"
            >
                <Video size={16} />
            </button>
            <button className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20" aria-label="More options">
                <MoreVertical size={16} />
            </button>
        </div>
    </div>
);

export default ChatHeader;
