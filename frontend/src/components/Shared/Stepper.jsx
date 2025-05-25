import { CheckCircle } from 'lucide-react';

export default function Stepper({ formStep }) {
  const steps = [
    { label: 'Account' },
    { label: 'Details' },
    { label: 'Verify' },
  ];

  return (
    <div className="flex justify-between items-center mb-8 relative">
      {steps.map((step, idx) => (
        <div key={idx} className="flex flex-col items-center z-10">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              idx < formStep
                ? 'bg-green-500 text-white'
                : idx === formStep
                ? 'bg-purple-600 text-white'
                : 'bg-white/20 text-purple-200'
            }`}
          >
            {idx < formStep ? <CheckCircle size={20} /> : <span>{idx + 1}</span>}
          </div>
          <span className="text-xs text-purple-200 mt-2">{step.label}</span>
        </div>
      ))}
      <div className="absolute h-1 bg-white/20 left-0 right-0 top-14 -z-10 translate-y-1">
        <div
          className="h-full bg-purple-600 transition-all"
          style={{ width: `${(formStep / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
