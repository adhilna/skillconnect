import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, Home, ArrowLeft, Zap } from 'lucide-react';

class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null, errorInfo: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorDisplay
                    error={this.state.error}
                    onRetry={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                />
            );
        }
        return this.props.children;
    }
}

const ErrorDisplay = ({ error, onRetry }) => {
    const [glitchActive, setGlitchActive] = useState(false);
    const [particles, setParticles] = useState([]);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        // Create floating particles
        const newParticles = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 2,
            speed: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.3
        }));
        setParticles(newParticles);

        // Animate particles
        const interval = setInterval(() => {
            setParticles(prev => prev.map(p => ({
                ...p,
                y: (p.y + p.speed) % 120,
                x: p.x + Math.sin(Date.now() * 0.001 + p.id) * 0.5
            })));
        }, 100);

        // Trigger glitch effect periodically
        const glitchInterval = setInterval(() => {
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 200);
        }, 4000);

        return () => {
            clearInterval(interval);
            clearInterval(glitchInterval);
        };
    }, []);

    const handleReload = () => {
        setGlitchActive(true);
        setTimeout(() => {
            window.location.reload();
        }, 300);
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 relative overflow-hidden">
            {/* Animated background particles */}
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        opacity: particle.opacity,
                        boxShadow: '0 0 6px rgba(168, 85, 247, 0.6)'
                    }}
                />
            ))}

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                    backgroundImage: `
                        linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                }} />
            </div>

            {/* Main content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
                {/* Error icon with glow effect */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 rounded-full bg-red-500 blur-xl opacity-50 animate-pulse" />
                    <div className={`relative bg-gradient-to-r from-red-500 to-orange-500 rounded-full p-6 transform transition-all duration-300 ${glitchActive ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`}>
                        <AlertTriangle size={48} className="text-white animate-bounce" />
                    </div>
                </div>

                {/* Glitch effect title */}
                <h1 className={`text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-red-400 via-orange-400 to-red-500 bg-clip-text text-transparent transition-all duration-200 ${glitchActive ? 'animate-pulse filter blur-sm' : ''}`}>
                    SYSTEM ERROR
                </h1>

                {/* Animated subtitle */}
                <div className="relative mb-8">
                    <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl leading-relaxed">
                        Houston, we have a problem. The digital cosmos experienced a temporary glitch in the matrix.
                    </p>
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-red-500/20 rounded-lg blur-lg opacity-30 animate-pulse" />
                </div>

                {/* Error code display */}
                <div className="bg-black/50 backdrop-blur-sm border border-red-500/30 rounded-lg p-4 mb-8 font-mono text-sm">
                    <div className="flex items-center gap-2 text-red-400 mb-2">
                        <Zap size={16} className="animate-pulse" />
                        <span>ERROR_CODE: {error?.name || 'UNKNOWN'}</span>
                    </div>
                    <div className="text-gray-400 text-xs">
                        TIMESTAMP: {new Date().toISOString()}
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <button
                        onClick={handleReload}
                        className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/50 active:scale-95"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex items-center gap-3">
                            <RefreshCw size={20} className="group-hover:animate-spin" />
                            <span>Retry Mission</span>
                        </div>
                    </button>

                    <button
                        onClick={onRetry}
                        className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 active:scale-95"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex items-center gap-3">
                            <ArrowLeft size={20} className="group-hover:animate-bounce" />
                            <span>Reset Component</span>
                        </div>
                    </button>

                    <button
                        onClick={handleBack}
                        className="group relative px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/50 active:scale-95"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex items-center gap-3">
                            <Home size={20} className="group-hover:animate-pulse" />
                            <span>Go Back</span>
                        </div>
                    </button>
                </div>

                {/* Toggle details */}
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm underline decoration-dotted"
                >
                    {showDetails ? 'Hide' : 'Show'} Technical Details
                </button>

                {/* Technical details */}
                {showDetails && (
                    <div className="mt-6 bg-black/70 backdrop-blur-sm border border-gray-700 rounded-lg p-6 max-w-4xl w-full text-left">
                        <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                            <AlertTriangle size={16} />
                            Technical Information
                        </h3>
                        <div className="space-y-3 text-sm font-mono">
                            <div>
                                <span className="text-gray-400">Error Name:</span>
                                <span className="text-red-300 ml-2">{error?.name || 'Unknown'}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Error Message:</span>
                                <span className="text-red-300 ml-2">{error?.message || 'No details available'}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Stack Trace:</span>
                                <pre className="text-red-300 ml-2 mt-2 text-xs bg-black/50 p-3 rounded border overflow-x-auto">
                                    {error?.stack || 'Stack trace not available'}
                                </pre>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm">
                    <p>Don&apos;t worry, even the best rockets have technical difficulties sometimes.</p>
                </div>
            </div>
        </div>
    );
};

export default ErrorBoundary;