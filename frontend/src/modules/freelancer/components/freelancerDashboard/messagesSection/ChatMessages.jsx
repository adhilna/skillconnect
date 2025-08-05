import React, { useRef, useEffect } from 'react';
import Message from './Message';
import UploadProgress from './UploadProgress';

const ChatMessages = ({ messages, loading, isUploading, uploadProgress, onReact }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div
            className="flex-1 p-4 overflow-y-auto bg-black/10 touch-manipulation"
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
        >
            {loading ? (
                <p className="text-center text-gray-400 mt-4">Loading messages...</p>
            ) : messages.length === 0 ? (
                <p className="text-center text-gray-400 mt-4">No messages</p>
            ) : (
                messages.map((msg) => (
                    <Message
                        key={msg.id}
                        {...msg}
                        onReact={onReact}
                    />
                ))
            )}

            <div ref={messagesEndRef} />
            {isUploading && <UploadProgress progress={uploadProgress} />}
        </div>
    );
};

export default ChatMessages;
