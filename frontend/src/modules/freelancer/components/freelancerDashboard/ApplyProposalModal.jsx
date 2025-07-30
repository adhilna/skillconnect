import React, { useState, useEffect } from 'react';

const ApplyProposalModal = ({ proposal, visible, onCancel, onSubmit }) => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (visible) {
            setMessage('');  // Clear message input whenever modal opens
        }
    }, [visible]);

    if (!visible || !proposal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-gray-900 rounded-lg shadow-lg max-w-md p-6 w-full mx-4">
                <h3 className="text-white text-xl mb-4">
                    Apply for <span className="font-semibold">{proposal.title}</span>
                </h3>

                <textarea
                    className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white resize-none"
                    rows={4}
                    placeholder="Write your message to the client (optional)..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />

                <div className="flex justify-end gap-4 mt-5">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white font-semibold transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSubmit(message)}
                        className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplyProposalModal;
