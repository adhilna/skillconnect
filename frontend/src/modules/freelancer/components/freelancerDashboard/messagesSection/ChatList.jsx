import React from 'react';
import { Filter, Search } from 'lucide-react';
import ChatListItem from './ChatListItem';

const ChatList = ({
    chatList,
    selectedChatId,
    onSelectChat,
    loading,
    searchQuery,
    setSearchQuery,
}) => (
    <div className="flex flex-col h-full">
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
                    className="w-full bg-white/10 text-white pl-10 pr-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:border-purple-500 text-base"
                    aria-label="Search conversations"
                />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto" aria-label="Conversation list" role="list">
            {loading ? (
                <p className="text-center text-gray-400 mt-4">Loading conversations...</p>
            ) : chatList.length === 0 ? (
                <p className="text-center text-gray-400 mt-4">No conversations found</p>
            ) : (
                chatList.map((chat) => (
                    <ChatListItem
                        key={chat.id}
                        chat={chat}
                        isActive={selectedChatId === chat.id}
                        onClick={onSelectChat}
                    />
                ))
            )}
        </div>
    </div>
);

export default ChatList;
