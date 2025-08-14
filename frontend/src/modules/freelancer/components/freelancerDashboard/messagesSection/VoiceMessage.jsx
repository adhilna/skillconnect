import React, { useRef, useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';

const VoiceMessage = ({ duration, audioUrl, isPlaying, onPlayPause }) => {
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    // Format seconds to m:ss
    const formatTime = (secs) => {
        if (!secs || isNaN(secs) || !isFinite(secs)) return '0:00';
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Play/pause control
    useEffect(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.play().catch((err) => {
                console.error('Audio play failed:', err);
            });
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // Load metadata + track time
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => {
            setCurrentTime(audio.currentTime);
        };

        const setDur = () => {
            if (!isNaN(audio.duration) && isFinite(audio.duration)) {
                setTotalDuration(audio.duration);
            }
        };

        // First play click flag
        const markStarted = () => setHasStarted(true);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', setDur);
        audio.addEventListener('play', markStarted);

        audio.onended = () => {
            onPlayPause(false);
            setCurrentTime(0);
            setHasStarted(false); // reset so we show total length again
        };

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', setDur);
            audio.removeEventListener('play', markStarted);
        };
    }, [onPlayPause]);

    return (
        <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3 min-w-48">
            <button
                onClick={() => onPlayPause(!isPlaying)}
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
                            className={`w-1 bg-white/60 rounded-full ${
                                i < 8 ? 'h-6' : i < 12 ? 'h-4' : 'h-3'
                            }`}
                        />
                    ))}
                </div>
                {/* WhatsApp style display */}
                <span className="text-xs text-white/70">
                    {hasStarted || isPlaying
                        ? formatTime(currentTime)
                        : formatTime(totalDuration || parseDuration(duration))}
                </span>
            </div>

            <audio ref={audioRef} src={audioUrl} preload="metadata" />
        </div>
    );
};

// Parse backend duration string (m:ss) if needed
function parseDuration(str) {
    if (!str) return 0;
    const parts = str.split(':');
    if (parts.length === 2) {
        const m = parseInt(parts[0], 10);
        const s = parseInt(parts[1], 10);
        if (!isNaN(m) && !isNaN(s)) return m * 60 + s;
    }
    return 0;
}

export default VoiceMessage;
