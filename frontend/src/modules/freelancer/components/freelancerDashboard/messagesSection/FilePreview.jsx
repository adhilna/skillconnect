import React from 'react';
import { X, Image, FileText } from 'lucide-react';

const FilePreview = ({ file, onRemove }) => (
    <div className="relative bg-white/10 rounded-lg p-3 border border-white/20 mb-2">
        <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600"
            aria-label="Remove file"
        >
            <X size={12} />
        </button>
        <div className="flex items-center space-x-2">
            {file.type.startsWith('image/') ? (
                <div className="w-12 h-12 bg-purple-500 rounded flex items-center justify-center">
                    <Image size={16} className="text-white" />
                </div>
            ) : (
                <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center">
                    <FileText size={16} className="text-white" />
                </div>
            )}
            <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{file.name}</p>
                <p className="text-gray-400 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
        </div>
    </div>
);

export default FilePreview;
