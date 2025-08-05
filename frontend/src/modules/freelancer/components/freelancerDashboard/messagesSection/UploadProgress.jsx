import React from 'react';

const UploadProgress = ({ progress }) => (
    <div className="bg-white/10 rounded-lg p-3 border border-white/20 mb-2">
        <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm">Uploading...</span>
            <span className="text-white text-sm">{progress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
            <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
            />
        </div>
    </div>
);

export default UploadProgress;
