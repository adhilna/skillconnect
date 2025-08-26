import React from "react";
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";

const ChatHeader = ({ chat, onBack, isMobile, onStartCall }) => {
    if (!chat) return null;

    return (
        <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
                {isMobile && (
                    <button
                        onClick={onBack}
                        className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors touch-manipulation focus:outline-none md:hidden"
                        aria-label="Back to conversation list"
                        type="button"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}
                <div className="relative rounded-full overflow-hidden w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium select-none">
                    {chat.avatar && (chat.avatar.startsWith("http") || chat.avatar.startsWith("/")) ? (
                        <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                    ) : (
                        <span>{chat.avatar || ""}</span>
                    )}
                </div>
                <div>
                    <h3 className="text-white font-medium">{chat.name || "Unknown"}</h3>
                    <p className="text-sm text-gray-400 select-none">
                        {chat.typing ? "typing..." : chat.online ? "online" : "offline"}
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onStartCall("voice")}
                    className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors touch-manipulation"
                    aria-label="Start voice call"
                    type="button"
                >
                    <Phone size={16} />
                </button>
                <button
                    onClick={() => onStartCall("video")}
                    className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors touch-manipulation"
                    aria-label="Start video call"
                    type="button"
                >
                    <Video size={16} />
                </button>
                <button
                    className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors touch-manipulation"
                    aria-label="More options"
                    type="button"
                >
                    <MoreVertical size={16} />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
