import React, { useState } from 'react';
import { X, DollarSign, Send, AlertCircle, Loader2 } from 'lucide-react';

const PaymentRequestModal = ({
  isVisible,
  onClose,
  onSubmit,
  supportedPaymentMethods = [
    { value: 'razorpay', label: 'Razorpay' },
    { value: 'upi', label: 'UPI' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'stripe', label: 'Stripe' }
  ]
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    paymentMethod: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (!isVisible) return null;

  const validateForm = () => {
    const newErrors = {};

    // Amount validation
    const amount = parseFloat(formData.amount);
    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (amount > 49999.99) {
      newErrors.amount = 'Amount cannot exceed 49999.99';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    // Payment method validation
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Clear submit error
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setSubmitError('');

    try {
      const paymentRequestData = {
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        payment_method: formData.paymentMethod
      };
      console.log("Submitting payment method:", paymentRequestData.payment_method);

      // If onSubmit is provided, call it (for real API integration)
      if (onSubmit) {
        await onSubmit(paymentRequestData);
      } else {
        // Demo mode - simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Payment Request Demo Data:', paymentRequestData);
      }

      // Reset form and close modal on success
      handleClose();
    } catch (error) {
      console.error('Error creating payment request:', error);

      // Handle different types of errors
      if (error.message === 'Network Error') {
        setSubmitError('Network error. Please check your connection and try again.');
      } else if (error.status === 400) {
        setSubmitError('Invalid request. Please check your input and try again.');
      } else if (error.status === 403) {
        setSubmitError('You are not authorized to make this request.');
      } else if (error.status === 404) {
        setSubmitError('Contract or client not found.');
      } else if (error.message && error.message.includes('pending')) {
        setSubmitError('There is already a pending payment request for this contract.');
      } else {
        setSubmitError('Failed to create payment request. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.amount.trim() &&
    !isNaN(parseFloat(formData.amount)) &&
    parseFloat(formData.amount) > 0 &&
    formData.description.trim().length >= 10 &&
    formData.paymentMethod;



  const handleClose = () => {
    if (isLoading) return; // Prevent closing while loading

    setFormData({
      amount: '',
      description: '',
      paymentMethod: ''
    });
    setErrors({});
    setSubmitError('');
    onClose();
  };

  const formatAmount = (value) => {
    // Remove any non-numeric characters except decimal point
    const cleaned = value.replace(/[^\d.]/g, '');

    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }

    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].slice(0, 2);
    }

    return cleaned;
  };


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto relative"
        style={{ zIndex: 10000 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-white">Request Payment</h3>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-white/60 hover:text-white transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={20} className="sm:hidden" />
            <X size={24} className="hidden sm:block" />
          </button>
        </div>

        {/* Icon and Description */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <DollarSign size={20} className="text-white sm:hidden" />
            <DollarSign size={24} className="text-white hidden sm:block" />
          </div>
          <h4 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Payment Request</h4>
          <p className="text-white/70 text-xs sm:text-sm">Request payment from your client</p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* Amount Field */}
          <div>
            <label className="block text-white/80 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              Amount *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', formatAmount(e.target.value))}
                disabled={isLoading}
                className={`w-full bg-white/5 border rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none transition-colors pr-8 sm:pr-10 ${errors.amount
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-white/10 focus:border-purple-500'
                  }`}
                placeholder="Enter amount (e.g., 250.00)"
              />
              <DollarSign size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 sm:hidden" />
              <DollarSign size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hidden sm:block" />
            </div>
            {errors.amount && (
              <div className="flex items-center mt-1 text-red-400 text-xs">
                <AlertCircle size={12} className="mr-1 flex-shrink-0" />
                <span>{errors.amount}</span>
              </div>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-white/80 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              Description * ({formData.description.length}/500)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={isLoading}
              rows={3}
              maxLength={500}
              className={`w-full bg-white/5 border rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none transition-colors resize-none ${errors.description
                ? 'border-red-500 focus:border-red-400'
                : 'border-white/10 focus:border-purple-500'
                }`}
              placeholder="Describe what this payment is for... (minimum 10 characters)"
            />
            {errors.description && (
              <div className="flex items-center mt-1 text-red-400 text-xs">
                <AlertCircle size={12} className="mr-1 flex-shrink-0" />
                <span>{errors.description}</span>
              </div>
            )}
          </div>

          {/* Payment Method Field */}
          <div>
            <label className="block text-white/80 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              Preferred Payment Method *
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              disabled={isLoading}
              className={`w-full bg-white/5 border rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none transition-colors ${errors.paymentMethod
                ? 'border-red-500 focus:border-red-400'
                : 'border-white/10 focus:border-purple-500'
                }`}
            >
              <option value="" className="bg-gray-800">Select payment method</option>
              {supportedPaymentMethods.map(method => (
                <option key={method.value} value={method.value} className="bg-gray-800">
                  {method.label}
                </option>
              ))}
            </select>
            {errors.paymentMethod && (
              <div className="flex items-center mt-1 text-red-400 text-xs">
                <AlertCircle size={12} className="mr-1 flex-shrink-0" />
                <span>{errors.paymentMethod}</span>
              </div>
            )}
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <div className="flex items-start text-red-400 text-xs sm:text-sm">
                <AlertCircle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 sm:space-x-3 pt-2 sm:pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading || !isFormValid}
              className="flex-1 bg-white/10 text-white py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || Object.keys(errors).length > 0}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 sm:space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin sm:hidden" />
                  <Loader2 size={16} className="animate-spin hidden sm:block" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send size={14} className="sm:hidden" />
                  <Send size={16} className="hidden sm:block" />
                  <span>Send Request</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentRequestModal;