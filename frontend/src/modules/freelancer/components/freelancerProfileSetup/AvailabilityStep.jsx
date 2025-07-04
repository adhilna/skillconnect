import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function AvailabilityStep({
    isAvailable,
    handleInputChange
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8 sm:py-12">
            {/* Animated Icon with Glow Effect */}
            <div className="relative mb-8">
                <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto flex items-center justify-center border-2 transition-all duration-500 transform hover:scale-110
                ${isAvailable
                            ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-green-400 shadow-lg shadow-green-500/25'
                            : 'bg-gradient-to-br from-red-500/30 to-rose-500/30 border-red-400 shadow-lg shadow-red-500/25'
                        }`}
                >
                    {/* Pulsing ring effect */}
                    <div
                        className={`absolute inset-0 rounded-full animate-pulse
                    ${isAvailable ? 'bg-green-500/10' : 'bg-red-500/10'}`}
                    ></div>

                    <CheckCircle
                        size={40}
                        className={`relative z-10 transition-colors duration-300 ${isAvailable ? "text-green-400" : "text-red-400"}`}
                    />
                </div>
            </div>

            {/* Title with gradient text */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Almost Done!
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-md text-center">
                Just one final step to complete your profile
            </p>

            {/* Main Card with Glass Effect */}
            <div className="w-full max-w-md sm:max-w-lg bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
                {/* Toggle Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                            Availability Status
                        </h3>
                        <p className="text-sm text-gray-400">
                            Let clients know if you&apos;re ready for new projects
                        </p>
                    </div>

                    {/* Enhanced Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer select-none group">
                        <input
                            type="checkbox"
                            name="is_available"
                            checked={isAvailable}
                            onChange={handleInputChange}
                            className="sr-only peer"
                        />
                        {/* Toggle Track with enhanced styling */}
                        <div
                            className={`w-14 h-7 rounded-full transition-all duration-300 relative shadow-inner
                        ${isAvailable
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/30'
                                    : 'bg-gradient-to-r from-gray-600 to-gray-700 shadow-gray-500/20'
                                }
                        peer-focus:ring-4 peer-focus:ring-blue-300/50 group-hover:shadow-lg`}
                        >
                            {/* Toggle Thumb with improved design */}
                            <div
                                className={`absolute top-[2px] left-[2px] h-6 w-6 rounded-full transition-all duration-300 shadow-lg flex items-center justify-center
                            ${isAvailable
                                        ? 'bg-white translate-x-7 shadow-green-200/50'
                                        : 'bg-white translate-x-0 shadow-gray-200/50'
                                    }`}
                            >
                                {/* Mini icon in toggle */}
                                <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isAvailable ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                            </div>
                        </div>
                    </label>
                </div>

                {/* Status Display with Enhanced Animation */}
                <div
                    className={`relative overflow-hidden rounded-xl p-4 sm:p-5 transition-all duration-500 transform
                ${isAvailable
                            ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 shadow-lg shadow-green-500/10"
                            : "bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-400/30 shadow-lg shadow-red-500/10"
                        }`}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    </div>

                    <div className="relative flex items-center gap-3">
                        <div className={`p-2 rounded-full ${isAvailable ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                            {isAvailable ? (
                                <CheckCircle className="text-green-400" size={24} />
                            ) : (
                                <XCircle className="text-red-400" size={24} />
                            )}
                        </div>

                        <div className="flex-1">
                            <p className={`text-sm sm:text-base font-medium ${isAvailable ? 'text-green-300' : 'text-red-300'}`}>
                                {isAvailable ? "Ready for new projects!" : "Currently unavailable"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {isAvailable
                                    ? "Clients can contact you for new opportunities"
                                    : "Your profile will show as unavailable to clients"
                                }
                            </p>
                        </div>

                        {/* Status indicator dot */}
                        <div className={`w-3 h-3 rounded-full animate-pulse ${isAvailable ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-gray-400 text-center">
                        💡 You can change your availability status anytime from your profile settings
                    </p>
                </div>
            </div>
        </div>
    );

};
