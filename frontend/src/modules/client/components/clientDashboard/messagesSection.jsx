import React from 'react';
import { MessageCircle } from 'lucide-react';

const MessagesSection = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">Messages</h3>
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">5 Unread</span>
        </div>
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
            <MessageCircle size={48} className="text-white/30 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Team Communication</h4>
            <p className="text-white/70 mb-6">Chat with freelancers, share files, and manage conversations</p>
            <div className="text-white/50 text-sm">Real-time messaging system in development...</div>
        </div>
    </div>
);

export default MessagesSection;