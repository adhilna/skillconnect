import React from 'react';

export default function Stepper({ steps, formStep }) {
    return (
        <div className="flex items-center justify-between mb-8 overflow-x-auto">
            {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                    <div key={index} className="flex items-center min-w-0">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${index <= formStep
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'border-white/30 text-white/50'
                            }`}>
                            <Icon size={16} />
                        </div>
                        <div className="ml-2 hidden md:block">
                            {/* <p className={`text-xs font-medium ${index <= formStep ? 'text-blue-400' : 'text-white/50'
                                }`}>
                                {step.title}
                            </p> */}
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`w-8 h-0.5 mx-2 ${index < formStep ? 'bg-blue-500' : 'bg-white/30'
                                }`} />
                        )}
                    </div>
                );
            })}
        </div>
    )
}
