import React from 'react';

export default function Stepper({ steps, formStep }) {
    return (
        <div className="mb-6 sm:mb-8">
            <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${index <= formStep
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-700 text-gray-400'
                            }`}>
                            <step.icon size={14} className="sm:hidden" />
                            <step.icon size={18} className="hidden sm:block" />
                        </div>
                        {/* Step label - only show on larger screens */}
                        <span className="hidden md:block text-xs text-white/60 mt-2 text-center font-medium">
                            {step.label || `Step ${index + 1}`}
                        </span>
                    </div>
                ))}
            </div>

            {/* Progress bar */}
            <div className="mt-3 sm:mt-4 h-1 sm:h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                    className="h-full bg-green-500 transition-all duration-300 ease-in-out"
                    style={{ width: `${(formStep / (steps.length - 1)) * 100}%` }}
                ></div>
            </div>

            {/* Current step indicator for mobile */}
            <div className="mt-3 text-center sm:hidden">
                <span className="text-sm text-white/60">
                    Step {formStep + 1} of {steps.length}
                </span>
            </div>
        </div>
    );
};
