import React, { useState, useEffect, useContext } from 'react';
import {
  CreditCard,
  Smartphone,
  Building2,
  Shield,
  Check,
  ArrowLeft,
  Lock,
  Star,
  Clock,
  X,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Download,
  Filter,
  Search,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import api from '../../../../api/api';
import { AuthContext } from '../../../../context/AuthContext';
import PaymentFlow from './paymentSection/PaymentFlow';

const PaymentDashboard = ({
  currentView,
  setCurrentView,
  selectedPayment,
  setSelectedPayment,
}) => {
  console.log("📄 PaymentSection mounted with selectedPayment:", selectedPayment);
  const [selectedMethod, setSelectedMethod] = useState('razorpay');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaidModal, setShowPaidModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const paymentMethods = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      description: 'UPI, Cards, NetBanking & More',
      icon: CreditCard,
      popular: true,
      processingTime: 'Instant'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, RuPay',
      icon: CreditCard,
      popular: false,
      processingTime: 'Instant'
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      description: 'GPay, PhonePe, Paytm & More',
      icon: Smartphone,
      popular: false,
      processingTime: 'Instant'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'All major banks supported',
      icon: Building2,
      popular: false,
      processingTime: '2-5 minutes'
    }
  ];

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/v1/messaging/payment-requests/?page=${currentPage}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = response.data;
        setPaymentHistory(data.results);
        setTotalPages(Math.ceil(data.count / 5));
      } catch (error) {
        console.error('Failed to fetch payment requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [currentPage, token]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/v1/messaging/payment-requests/?page=${currentPage}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = response.data;
      setPaymentHistory(data.results);
      setTotalPages(Math.ceil(data.count / 5));
    } catch (error) {
      console.error('Failed to fetch payment requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'pending':
        return <AlertCircle size={16} className="text-yellow-400" />;
      case 'failed':
        return <XCircle size={16} className="text-red-400" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const handlePaymentClick = (payment) => {
    if (payment.status === 'completed') {
      setSelectedPayment(payment);
      setShowPaidModal(true);
    } else if (payment.status === 'pending' || payment.status === 'failed') {
      setSelectedPayment(payment);
      setCurrentView('payment');
    }
  };

  // Fixed filteredHistory to properly handle undefined/null values and work with backend data structure
  const filteredHistory = paymentHistory.filter(payment => {
    const description = (payment.description || '').toLowerCase();
    const freelancerName = (payment.freelancer_name || '').toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch = description.includes(search) || freelancerName.includes(search);
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayNow = async () => {
    if (selectedMethod !== "razorpay") {
      alert("Only Razorpay is supported right now");
      return;
    }
    setIsProcessing(true);
    console.log(selectedPayment)

    try {
      const createOrderRes = await api.post(
        `/api/v1/messaging/payments/${selectedPayment.id}/create-razorpay-order/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const { order_id, razorpay_key, amount, currency, description } = createOrderRes.data;

      await loadRazorpayScript();

      if (!selectedPayment?.id) {
        console.error("No valid payment selected for processing");
        return;
      }

      const options = {
        key: razorpay_key,
        order_id,
        amount: amount + 150 * 100,
        currency,
        name: 'Skill+Connect',
        description,
        handler: async (response) => {
          try {
            await api.post(
              `/api/v1/messaging/payments/${selectedPayment.id}/verify-razorpay-payment/`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );
            setIsProcessing(false);
            setShowPaidModal(true);
            fetchPayments();
            setCurrentView('dashboard');
          } catch (error) {
            console.error("Payment verification failed", error);
            setIsProcessing(false);
            alert("Payment verification failed. Please check your payment status.");
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setShowConfirmModal(false);
            setCurrentView('dashboard');
            alert("Payment cancelled.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setIsProcessing(false);
      console.error("Error creating order:", error);
      alert("Failed to create payment order.");
    }
  };

  // Calculate stats with proper null/undefined handling
  const totalPaid = paymentHistory
    .filter(p => p && p.status === 'completed')
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  const totalPending = paymentHistory
    .filter(p => p && p.status === 'pending')
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  const thisMonth = paymentHistory
    .filter(p => p && p.amount)
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);



  // Payment Success Modal for completed payments
  const PaidDetailsModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-white">Payment Details</h3>
          <button
            onClick={() => setShowPaidModal(false)}
            className="text-white/60 hover:text-white transition-colors p-1"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="text-center mb-4 sm:mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Check size={20} className="text-white sm:w-6 sm:h-6" />
          </div>
          <h4 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Payment Successful</h4>
          <p className="text-white/70 text-xs sm:text-sm">Transaction completed successfully</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 space-y-2 sm:space-y-3">
          <div className="flex justify-between">
            <span className="text-white/70 text-xs sm:text-sm">Amount</span>
            <span className="text-white font-semibold text-sm sm:text-base">₹{Number(selectedPayment?.amount) + 150}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70 text-xs sm:text-sm">Freelancer</span>
            <span className="text-white/80 text-xs sm:text-sm truncate ml-2 max-w-[150px]">{selectedPayment?.freelancer_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70 text-xs sm:text-sm">Transaction ID</span>
            <span className="text-white/80 text-xs sm:text-sm truncate ml-2 max-w-[120px]">{selectedPayment?.razorpay_payment_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70 text-xs sm:text-sm">Payment Method</span>
            <span className="text-white/80 text-xs sm:text-sm">{selectedPayment?.payment_method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70 text-xs sm:text-sm">Date</span>
            <span className="text-white/80 text-xs sm:text-sm">{selectedPayment?.created_at?.split('T')[0]}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => setShowPaidModal(false)}
            className="flex-1 bg-white/10 text-white py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium hover:bg-white/20 transition-all flex items-center justify-center space-x-2"
          >
            <Download size={14} className="sm:w-4 sm:h-4" />
            <span>Download Receipt</span>
          </button>
          <button
            onClick={() => setShowPaidModal(false)}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Dashboard View - Fixed responsive issues
  const DashboardView = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-3 sm:p-4 lg:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Payments & Billing</h1>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-white/70 text-xs sm:text-sm">Total Paid</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400 truncate">${totalPaid.toFixed(2)}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-500/20 rounded-xl flex items-center justify-center ml-2 sm:ml-3 flex-shrink-0">
                  <CheckCircle size={16} className="text-green-400 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-white/70 text-xs sm:text-sm">Pending</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-400 truncate">${totalPending.toFixed(2)}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center ml-2 sm:ml-3 flex-shrink-0">
                  <AlertCircle size={16} className="text-yellow-400 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 lg:p-6 col-span-1 xs:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-white/70 text-xs sm:text-sm">This Month</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">${thisMonth.toFixed(2)}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-500/20 rounded-xl flex items-center justify-center ml-2 sm:ml-3 flex-shrink-0">
                  <Calendar size={16} className="text-blue-400 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 lg:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/40 focus:outline-none focus:border-green-500/50"
                />
              </div>

              <div className="flex flex-row gap-2 sm:gap-3 lg:gap-4">
                {/* Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm lg:text-base text-white focus:outline-none focus:border-green-500/50 flex-1 sm:flex-initial min-w-[100px] sm:min-w-[120px]"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>

                <button className="bg-white/10 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center space-x-1 sm:space-x-2">
                  <Download size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline text-sm lg:text-base">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-white">Payment History</h2>
              <button className="text-white/60 hover:text-white transition-colors p-1">
                <MoreVertical size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {loading ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 border-3 border-white/20 border-t-green-500 rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
                  <p className="text-white/60 text-sm sm:text-base">Loading payments...</p>
                </div>
              ) : filteredHistory.length > 0 ? (
                filteredHistory.map((payment) => (
                  <div
                    key={payment.id}
                    onClick={() => handlePaymentClick(payment)}
                    className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    {/* Mobile Layout */}
                    <div className="sm:hidden">
                      <div className="flex items-start space-x-2.5 mb-2.5">
                        <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0 mt-0.5">
                          {getStatusIcon(payment.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm leading-tight truncate">{payment.description}</h4>
                          <p className="text-white/60 text-xs truncate mt-0.5">{payment.freelancer_name}</p>
                          <p className="text-white/60 text-xs mt-0.5">{payment.created_at?.split('T')[0]}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-base font-bold text-white">${payment.amount}</p>
                          {payment.payment_method && (
                            <p className="text-white/60 text-xs truncate max-w-[100px]">{payment.payment_method}</p>
                          )}
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center justify-between">
                      <div className="flex items-center space-x-3 lg:space-x-4 flex-1 min-w-0">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                          {getStatusIcon(payment.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm lg:text-base truncate">{payment.description}</h4>
                          <div className="flex items-center space-x-2 lg:space-x-3 mt-0.5 lg:mt-1">
                            <p className="text-white/60 text-xs lg:text-sm truncate">{payment.freelancer_name}</p>
                            <span className="text-white/40 text-xs lg:text-sm">•</span>
                            <p className="text-white/60 text-xs lg:text-sm">{payment.created_at?.split('T')[0]}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 lg:space-x-4 flex-shrink-0">
                        <div className="text-right min-w-0">
                          <p className="text-lg lg:text-xl font-bold text-white">${payment.amount}</p>
                          {payment.payment_method && (
                            <p className="text-white/60 text-xs truncate max-w-[100px] lg:max-w-[120px]">{payment.payment_method}</p>
                          )}
                        </div>
                        <span
                          className={`px-2.5 lg:px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <CreditCard size={40} className="text-white/30 mx-auto mb-3 sm:mb-4 sm:w-12 sm:h-12" />
                  <h4 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">No payments found</h4>
                  <p className="text-white/60 text-xs sm:text-sm">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1.5 sm:gap-2 pt-4 sm:pt-6">
                <button
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 sm:p-2 bg-white/10 text-white rounded-lg disabled:opacity-50 hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft size={16} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                </button>

                <div className="flex gap-1 sm:gap-1.5">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm lg:text-base ${currentPage === pageNum
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                          : 'text-white bg-white/10 hover:bg-white/20'
                          } transition-colors`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 sm:p-2 bg-white/10 text-white rounded-lg disabled:opacity-50 hover:bg-white/20 transition-colors"
                >
                  <ChevronRight size={16} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Paid Payment Details Modal */}
        {showPaidModal && selectedPayment && <PaidDetailsModal />}
      </div>
    );
  };

  // Main render logic
  if (currentView === 'payment') {
    return <PaymentFlow
      selectedPayment={selectedPayment}
      setSelectedPayment={setSelectedPayment}
      currentView={currentView}
      setCurrentView={setCurrentView}
      selectedMethod={selectedMethod}
      setSelectedMethod={setSelectedMethod}
      showConfirmModal={showConfirmModal}
      setShowConfirmModal={setShowConfirmModal}
      handlePay={handlePayNow}
      isProcessing={isProcessing}
      paymentMethods={paymentMethods}
    />;
  }

  return <DashboardView />;
};

export default PaymentDashboard;
