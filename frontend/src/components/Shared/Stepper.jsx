import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function Stepper({ formStep = 0 }) {
  const steps = [
    { label: 'Account' },
    { label: 'Details' },
    { label: 'Verify' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 px-8">
      <div className="relative">
        {/* Progress bar background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/20"
          style={{
            left: '2.5rem',
            right: '2.5rem'
          }}
        />

        {/* Progress bar foreground */}
        <div
          className="absolute top-5 h-0.5 bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500 ease-out"
          style={{
            left: '2.5rem',
            width: formStep === 0 ? '0%' : `calc(${(formStep / (steps.length - 1)) * 100}% - 2.5rem)`,
          }}
        />

        {/* Steps container */}
        <div className="relative flex justify-between items-start">
          {steps.map((step, idx) => {
            const isCompleted = idx < formStep;
            const isActive = idx === formStep;

            return (
              <div
                key={idx}
                className="flex flex-col items-center relative"
              >
                {/* Step circle */}
                <div
                  className={`
                    relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-300 ease-out transform
                    ${isCompleted
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-110'
                      : isActive
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-110 ring-4 ring-purple-600/20'
                        : 'bg-white/10 text-purple-300 border-2 border-white/20 hover:bg-white/20'
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle size={18} className="drop-shadow-sm" />
                  ) : (
                    <span className="text-sm font-semibold">{idx + 1}</span>
                  )}
                </div>

                {/* Step label */}
                <div className="mt-3 text-center">
                  <span
                    className={`
                      text-sm font-medium transition-colors duration-300
                      ${isCompleted || isActive
                        ? 'text-white'
                        : 'text-purple-300'
                      }
                    `}
                  >
                    {step.label}
                  </span>

                  {/* Status indicator */}
                  {isActive && (
                    <div className="mt-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mx-auto animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}