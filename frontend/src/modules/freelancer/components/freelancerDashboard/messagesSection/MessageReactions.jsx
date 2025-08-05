import React from 'react';

const MessageReactions = ({ reactions, onReact }) => {
    if (!reactions || Object.keys(reactions).length === 0) return null;

    return (
        <div className="flex flex-wrap gap-1 mt-1">
            {Object.entries(reactions).map(([emoji, count]) => (
                <button
                    key={emoji}
                    onClick={() => onReact(emoji)}
                    className="bg-white/10 hover:bg-white/20 rounded-full px-2 py-1 text-xs flex items-center space-x-1 transition-colors"
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

export default MessageReactions;
