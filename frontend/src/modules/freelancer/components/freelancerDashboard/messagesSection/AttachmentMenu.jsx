import React, { useRef } from 'react';
import { FileText, Image, Mic, DollarSign } from 'lucide-react';

const AttachmentMenu = ({
    isVisible,
    onClose,
    onFileSelect,
    onVoiceRecord,
    onPaymentClick
}) => {
    const fileInputRef = useRef(null);

    if (!isVisible) return null;

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            className="absolute bottom-full mb-2 left-1 w-40 bg-gray-800 border border-white/20 rounded-lg p-2 shadow-lg z-50
                 grid grid-cols-2 gap-2"
            style={{ minWidth: '10rem' }}
        >
            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                    if (e.target.files) {
                        onFileSelect(Array.from(e.target.files));
                        onClose();
                    }
                }}
            />
            <button
                onClick={handleFileClick}
                className="flex flex-col items-center justify-center p-1.5 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
                aria-label="Attach File"
                type="button"
            >
                <FileText size={18} />
                <span className="text-[10px] mt-1">File</span>
            </button>
            <button
                onClick={() => {
                    fileInputRef.current?.setAttribute('accept', 'image/*');
                    fileInputRef.current?.click();
                    onClose();
                }}
                className="flex flex-col items-center justify-center p-1.5 bg-green-600 rounded-lg text-white hover:bg-green-700 transition-colors"
                aria-label="Attach Photo"
                type="button"
            >
                <Image size={18} />
                <span className="text-[10px] mt-1">Photo</span>
            </button>
            <button
                onClick={() => {
                    onVoiceRecord();
                    onClose();
                }}
                className="flex flex-col items-center justify-center p-1.5 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors"
                aria-label="Record Voice"
                type="button"
            >
                <Mic size={18} />
                <span className="text-[10px] mt-1">Voice</span>
            </button>
            <button
                onClick={() => {
                    onClose();
                    if (onPaymentClick) onPaymentClick();
                }}
                className="flex flex-col items-center justify-center p-1.5 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-colors"
                aria-label="Send Payment"
                type="button"
            >
                <DollarSign size={18} />
                <span className="text-[10px] mt-1">Payment</span>
            </button>
        </div>
    );
};

export default AttachmentMenu;
