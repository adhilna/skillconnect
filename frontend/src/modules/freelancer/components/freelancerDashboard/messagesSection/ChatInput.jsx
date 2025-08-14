import React from 'react';
import { Plus, Smile, Send, MicOff } from 'lucide-react';
import AttachmentMenu from './AttachmentMenu';
import FilePreview from './FilePreview';

const ChatInput = ({
    newMessage,
    setNewMessage,
    onSend,
    attachedFiles,
    onRemoveFile,
    showAttachmentMenu,
    setShowAttachmentMenu,
    onFileSelect,
    onVoiceRecord,
    isRecording,
    handleVoiceRecord,
    isUploading,
    socket,           // <-- Add socket from parent here
    selectedChat,     // <-- Add selectedChat from parent here
}) => {
    const typingTimeoutRef = React.useRef(null);

    // Function to send typing event to backend
    const sendTyping = (typing) => {
        if (socket && socket.readyState === WebSocket.OPEN && selectedChat) {
            socket.send(JSON.stringify({
                type: 'typing',
                conversation_id: selectedChat.id,
                typing,
            }));
        }
    };

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);

        // Send typing=true immediately
        sendTyping(true);

        // Clear previous timeout
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        // Send typing=false if no input for 2 seconds
        typingTimeoutRef.current = setTimeout(() => {
            sendTyping(false);
        }, 2000);
    };

    return (
        <>
            {attachedFiles.length > 0 && (
                <div className="p-4 border-t border-white/10 bg-black/20">
                    <div className="space-y-2">
                        {attachedFiles.map((file, index) => (
                            <FilePreview
                                key={index}
                                file={file}
                                onRemove={() => onRemoveFile(index)}
                            />
                        ))}
                    </div>
                </div>
            )}

            <form
                onSubmit={onSend}
                className="p-4 border-t border-white/20 bg-black/20 backdrop-blur-lg flex items-center space-x-2 relative"
            >
                <div className="relative inline-block">
                    <button
                        type="button"
                        onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                        className="text-gray-400 hover:text-white transition-colors p-2 rounded-md"
                        aria-label="Open attachment menu"
                    >
                        <Plus size={20} />
                    </button>

                    <AttachmentMenu
                        isVisible={showAttachmentMenu}
                        onClose={() => setShowAttachmentMenu(false)}
                        onFileSelect={onFileSelect}
                        onVoiceRecord={onVoiceRecord}
                    />
                </div>

                <input
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}   // <-- changed here
                    placeholder={isRecording ? 'Recording voice...' : 'Type a message...'}
                    disabled={isRecording}
                    className="flex-grow min-w-0 bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20
           focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                    aria-label="Enter message"
                    autoComplete="off"
                />

                {isRecording ? (
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-2 rounded-lg">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-red-400 text-sm">Recording...</span>
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
                            className="text-gray-400 hover:text-white transition-colors p-2 rounded-md touch-manipulation focus:outline-none focus:ring-2 focus:ring-purple-500"
                            aria-label="Add emoji"
                        >
                            <Smile size={20} />
                        </button>
                        <button
                            type="submit"
                            disabled={isUploading || (newMessage.trim() === '' && attachedFiles.length === 0)}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg
               hover:from-purple-600 hover:to-pink-600 transition-all duration-200 touch-manipulation
               focus:outline-none focus:ring-2 focus:ring-pink-400"
                            aria-label="Send message"
                        >
                            <Send size={16} />
                        </button>
                    </>
                )}
            </form>
        </>
    );
};

export default ChatInput;
