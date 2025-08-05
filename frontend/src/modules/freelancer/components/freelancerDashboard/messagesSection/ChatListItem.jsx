import React from 'react';

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
        <div className="flex items-center space-x-3 relative">
            <div className="rounded-full overflow-hidden w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium flex-shrink-0">
                {chat.avatar && (chat.avatar.startsWith('http') || chat.avatar.startsWith('/')) ? (
                    <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                ) : (
                    <span>{chat.avatar}</span>
                )}
            </div>
            {chat.online && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
            )}
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

export default ChatListItem;
