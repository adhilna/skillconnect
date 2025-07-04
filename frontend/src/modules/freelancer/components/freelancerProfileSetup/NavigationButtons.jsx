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
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 gap-4 sm:gap-0">
            <button
                onClick={prevStep}
                disabled={formStep === 0}
                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all w-full sm:w-auto order-2 sm:order-1 ${formStep === 0
                    ? 'text-white/30 cursor-not-allowed'
                    : 'text-white border border-white/20 hover:bg-white/10'
                    }`}
            >
                <ChevronLeft size={18} className="sm:hidden" />
                <ChevronLeft size={20} className="hidden sm:block" />
                <span className="text-sm sm:text-base">Previous</span>
            </button>

            <div className="text-white/50 text-xs sm:text-sm order-1 sm:order-2">
                Step {formStep + 1} of {stepsLength}
            </div>

            <button
                onClick={handleNext}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto order-3"
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="text-sm sm:text-base">Processing...</span>
                    </>
                ) : formStep === stepsLength - 1 ? (
                    <>
                        <span className="text-sm sm:text-base">Complete Setup</span>
                        <CheckCircle size={18} className="sm:hidden" />
                        <CheckCircle size={20} className="hidden sm:block" />
                    </>
                ) : (
                    <>
                        <span className="text-sm sm:text-base">Next</span>
                        <ChevronRight size={18} className="sm:hidden" />
                        <ChevronRight size={20} className="hidden sm:block" />
                    </>
                )}
            </button>
        </div>
    )
}