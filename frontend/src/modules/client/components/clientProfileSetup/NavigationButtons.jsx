import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

export default function NavigationButtons({
    formStep,
    stepsLength,
    loading,
    handleNext,
    prevStep
}) {
    return (
        <div className="flex justify-between items-center mt-8">
            <button
                onClick={prevStep}
                disabled={formStep === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${formStep === 0
                    ? 'text-white/30 cursor-not-allowed'
                    : 'text-white border border-white/20 hover:bg-white/10'
                    }`}
            >
                <ChevronLeft size={20} />
                Previous
            </button>

            <div className="text-white/50 text-sm">
                Step {formStep + 1} of {stepsLength}
            </div>

            <button
                onClick={handleNext}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                    </>
                ) : formStep === stepsLength - 1 ? (
                    <>
                        Complete Setup
                        <CheckCircle size={20} />
                    </>
                ) : (
                    <>
                        Next
                        <ChevronRight size={20} />
                    </>
                )}
            </button>
        </div>
    );
}