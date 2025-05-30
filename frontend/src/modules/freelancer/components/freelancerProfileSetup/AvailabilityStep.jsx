import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function AvailabilityStep({ isAvailable, handleInputChange }) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Availability</h2>
                <p className="text-white/70">Set your current availability status</p>
            </div>

            <div className="flex justify-center">
                <div className="bg-white/5 border border-white/20 rounded-lg p-8 text-center">
                    <div className="mb-6">
                        <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${isAvailable ? 'bg-green-500/20 border-2 border-green-500' : 'bg-red-500/20 border-2 border-red-500'
                            }`}>
                            <CheckCircle size={32} className={isAvailable ? 'text-green-500' : 'text-red-500'} />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                        {isAvailable ? 'Available for Work' : 'Not Available'}
                    </h3>
                    <p className="text-white/70 mb-6">
                        {isAvailable
                            ? 'You are currently available to take on new projects'
                            : 'You are not currently available for new projects'
                        }
                    </p>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isAvailable}
                            onChange={handleInputChange}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-white">Available for work</span>
                    </label>
                </div>
            </div>
        </div>
    );
}