import React from 'react';
import { Pause, Play } from 'lucide-react';

const VoiceMessage = ({ duration, isPlaying, onPlayPause }) => (
    <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3 min-w-48">
        <button
            onClick={onPlayPause}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2 text-white hover:from-purple-600 hover:to-pink-600"
            aria-label={isPlaying ? 'Pause voice message' : 'Play voice message'}
            type="button"
        >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <div className="flex-1">
            <div className="flex space-x-1 items-center mb-1">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-1 bg-white/60 rounded-full ${i < 8 ? 'h-6' : i < 12 ? 'h-4' : 'h-3'
                            }`}
                    />
                ))}
            </div>
            <span className="text-xs text-white/70">{duration}</span>
        </div>
    </div>
);

export default VoiceMessage;
