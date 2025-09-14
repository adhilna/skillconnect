import React, { useState } from 'react';
import { Plus, Smile, Send, MicOff } from 'lucide-react';
import AttachmentMenu from './AttachmentMenu';
import FilePreview from './FilePreview';
import PaymentRequestModal from './PaymentRequestModal';
import api from '../../../../../api/api';


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
    socket,
    selectedChat,
    contract,
    token,
    setMessages,
    user,
}) => {
    const typingTimeoutRef = React.useRef(null);
    const [showPaymentRequestModal, setShowPaymentRequestModal] = useState(false);

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
        sendTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            sendTyping(false);
        }, 2000);
    };

    // Handler to open payment modal from attachment menu
    const handlePaymentClick = () => {
        setShowAttachmentMenu(false);
        setShowPaymentRequestModal(true);
    };

    const handlePaymentRequestSubmit = async (paymentRequestData) => {
        if (!contract?.id) {
            alert('No active contract to link payment request.');
            return;
        }

        const payload = {
            contract: contract.id,            // Include contract id linked to backend
            amount: paymentRequestData.amount,
            description: paymentRequestData.description,
            payment_method: paymentRequestData.payment_method,
            conversation_id: selectedChat.id,
        };
        console.log('Payload being sent to API:', payload);
        try {
            // Call backend payment request API
            const response = await api.post('/api/v1/messaging/payment-requests/', payload, {
                headers: { Authorization: `Bearer ${token}` },  // make sure token is available or pass it as prop if needed
            });

            alert('Payment request sent successfully!');

            const paymentMessage = {
                id: response.data.id,
                sender: user || 'me', // or user name or email from context/state
                isMe: true,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'payment',
                content: response.data.description,
                paymentData: {
                    amount: response.data.amount,
                    description: response.data.description,
                    status: response.data.status,
                    isRequest: true,
                    onPayment: () => alert('Implement actual payment flow here'),
                },
                conversation_id: selectedChat.id,
            };

            // Update messages state here to show payment in chat immediately
            setMessages((prevMessages) => [...prevMessages, paymentMessage]);

            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(paymentMessage));
            }

            setShowPaymentRequestModal(false);
        } catch (error) {
            console.error('Error creating payment request:', error);
            throw error; // So modal can display error
        }
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
                        onPaymentClick={handlePaymentClick}  // Pass the payment click handler
                    />
                </div>

                <input
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
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

            {/* Payment Request Modal */}
            <PaymentRequestModal
                isVisible={showPaymentRequestModal}
                onClose={() => setShowPaymentRequestModal(false)}
                onSubmit={handlePaymentRequestSubmit}
            />
        </>
    );
};

export default ChatInput;
