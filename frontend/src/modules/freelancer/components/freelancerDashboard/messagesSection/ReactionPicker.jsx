import React from 'react';

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

export default ReactionPicker;
