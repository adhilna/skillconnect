import React from 'react';
import { ArrowLeft, Check, Clock, Lock, Shield, Star, X } from 'lucide-react';

const PaymentFlow = ({
    selectedPayment,
    setCurrentView,
    selectedMethod,
    setSelectedMethod,
    showConfirmModal,
    setShowConfirmModal,
    handlePay,
    isProcessing,
    paymentMethods
}) => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-3 sm:p-4 lg:p-6">
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center mb-6 sm:mb-8">
                <button
                    onClick={() => setCurrentView('dashboard')}
                    className="text-white/60 hover:text-white transition-colors mr-3 sm:mr-4"
                >
                    <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
                </button>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Complete Payment</h1>
            </div>

            {/* Payment Summary Card */}
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-3 sm:p-4 lg:p-6 mb-6 sm:mb-8">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-white">Payment Summary</h2>
                    <div className="flex items-center text-green-400">
                        <Shield size={14} className="mr-1 sm:w-4 sm:h-4" />
                        <span className="text-xs">Secure</span>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2.5 sm:mb-3 gap-1.5 sm:gap-2">
                        <div className="min-w-0 flex-1">
                            <p className="text-white font-medium text-sm sm:text-base break-words">
                                {selectedPayment?.description}
                            </p>
                            <p className="text-white/60 text-xs sm:text-sm">
                                To: {selectedPayment?.freelancer_name}
                            </p>
                        </div>
                        <div className="text-left sm:text-right">
                            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                                ₹{selectedPayment?.amount}
                            </p>
                            <p className="text-white/60 text-xs">Payment Request</p>
                        </div>
                    </div>

                    {/* Processing Fee Row */}
                    <div className="border-t border-white/10 pt-2.5 sm:pt-3 flex justify-between items-center">
                        <span className="text-white/70 text-xs sm:text-sm">Processing Fee</span>
                        <span className="text-base sm:text-lg lg:text-xl font-semibold text-yellow-400">
                            ₹150
                        </span>
                    </div>

                    {/* Total Row */}
                    <div className="border-t border-white/10 pt-2.5 sm:pt-3 flex justify-between items-center">
                        <span className="text-white/70 text-xs sm:text-sm">Total Amount</span>
                        <span className="text-base sm:text-lg lg:text-xl font-bold text-green-400">
                            ₹{Number(selectedPayment?.amount) + 150}
                        </span>
                    </div>

                </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-3 sm:p-4 lg:p-6 mb-6 sm:mb-8">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-4 sm:mb-6">Choose Payment Method</h2>

                <div className="space-y-2.5 sm:space-y-3">
                    {paymentMethods.map((method) => {
                        const IconComponent = method.icon;
                        return (
                            <div
                                key={method.id}
                                onClick={() => setSelectedMethod(method.id)}
                                className={`relative cursor-pointer transition-all duration-300 ${selectedMethod === method.id
                                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/40'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    } border rounded-xl p-3 sm:p-4`}
                            >
                                {method.popular && (
                                    <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center">
                                        <Star size={8} className="mr-0.5 sm:mr-1 sm:w-2.5 sm:h-2.5" />
                                        Popular
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedMethod === method.id
                                            ? 'bg-green-500/20'
                                            : 'bg-white/10'
                                            }`}>
                                            <IconComponent size={18} className={`sm:w-5 sm:h-5 ${selectedMethod === method.id ? 'text-green-400' : 'text-white/70'
                                                }`} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-white font-medium text-sm sm:text-base truncate">{method.name}</h4>
                                            <p className="text-white/60 text-xs sm:text-sm truncate">{method.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                                        <div className="text-right hidden xs:block">
                                            <div className="flex items-center text-white/60 text-xs">
                                                <Clock size={10} className="mr-0.5 sm:mr-1 sm:w-3 sm:h-3" />
                                                <span className="hidden sm:inline">{method.processingTime}</span>
                                                <span className="sm:hidden">Instant</span>
                                            </div>
                                        </div>
                                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id
                                            ? 'border-green-500 bg-green-500'
                                            : 'border-white/30'
                                            }`}>
                                            {selectedMethod === method.id && (
                                                <Check size={12} className="text-white sm:w-3.5 sm:h-3.5" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Payment Button */}
            <div className="sticky bottom-3 sm:bottom-4">
                <button
                    onClick={() => setShowConfirmModal(true)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 sm:py-4 rounded-2xl text-sm sm:text-base lg:text-lg font-bold hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-[1.02] shadow-lg shadow-green-500/25"
                >
                    <div className="flex items-center justify-center space-x-2">
                        <Lock size={16} className="sm:w-5 sm:h-5" />
                        <span>Pay ₹{Number(selectedPayment?.amount) + 150} Securely</span>
                    </div>
                </button>

                <p className="text-center text-white/50 text-xs mt-2 sm:mt-3 px-2">
                    By proceeding, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
                <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 max-w-lg w-full">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white">Confirm Payment</h3>
                        <button
                            onClick={() => setShowConfirmModal(false)}
                            className="text-white/60 hover:text-white transition-colors p-1"
                        >
                            <X size={20} className="sm:w-6 sm:h-6" />
                        </button>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 space-y-2.5 sm:space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-white/70 text-xs sm:text-sm">Amount</span>
                            <span className="text-base sm:text-lg lg:text-2xl font-bold text-white">₹{Number(selectedPayment?.amount) + 150}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                            <span className="text-white/70 text-xs sm:text-sm">Description</span>
                            <span className="text-white text-xs sm:text-sm break-words text-left sm:text-right sm:max-w-[200px]">{selectedPayment?.description}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/70 text-xs sm:text-sm">Payment Method</span>
                            <span className="text-white capitalize text-xs sm:text-sm">{paymentMethods.find(m => m.id === selectedMethod)?.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/70 text-xs sm:text-sm">To</span>
                            <span className="text-white text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[150px]">{selectedPayment?.freelancer_name}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <button
                            onClick={() => setShowConfirmModal(false)}
                            className="flex-1 bg-white/10 text-white py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium hover:bg-white/20 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePay}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center space-x-2"
                        >
                            <Lock size={14} className="sm:w-4 sm:h-4" />
                            <span>Pay Now</span>
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Processing Modal */}
        {isProcessing && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
                <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-5 sm:p-6 lg:p-8 max-w-md w-full text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 border-4 border-white/20 border-t-green-500 rounded-full animate-spin mx-auto mb-4 sm:mb-6"></div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1.5 sm:mb-2">Processing Payment</h3>
                    <p className="text-white/70 mb-3 sm:mb-4 text-xs sm:text-sm lg:text-base">Please don&apos;t close this window</p>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-white/60 text-xs sm:text-sm">Amount</span>
                            <span className="text-white font-semibold text-sm sm:text-base">${selectedPayment?.amount}</span>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
);

export default PaymentFlow;