import React from 'react';

export default function Stepper({ steps, formStep }) {
    return (
        <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                    <div key={index} className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${index <= formStep
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-white/30 text-white/50'
                            }`}>
                            <Icon size={20} />
                        </div>
                        <div className="ml-3 hidden md:block">
                            <p className={`text-sm font-medium ${index <= formStep ? 'text-green-400' : 'text-white/50'
                                }`}>
                                {step.title}
                            </p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`w-12 h-0.5 mx-4 ${index < formStep ? 'bg-green-500' : 'bg-white/30'
                                }`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}