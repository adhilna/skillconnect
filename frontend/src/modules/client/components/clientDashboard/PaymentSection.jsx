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

const PaymentDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'payment'
  const [selectedPayment, setSelectedPayment] = useState(null);
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


  // Mock payment history data
  // const [paymentHistory, setPaymentHistory] = useState([
  //   {
  //     id: 1,
  //     orderId: "#ORD-2025-001",
  //     description: "Premium subscription - Monthly plan",
  //     amount: 299.99,
  //     status: "paid",
  //     date: "2025-08-20",
  //     method: "Razorpay (UPI)",
  //     transactionId: "TXN123456789"
  //   },
  //   {
  //     id: 2,
  //     orderId: "#ORD-2025-002",
  //     description: "Additional storage - 100GB",
  //     amount: 49.99,
  //     status: "pending",
  //     date: "2025-08-25",
  //     method: null,
  //     transactionId: null
  //   },
  //   {
  //     id: 3,
  //     orderId: "#ORD-2025-003",
  //     description: "Pro features upgrade",
  //     amount: 199.99,
  //     status: "failed",
  //     date: "2025-08-24",
  //     method: "Credit Card",
  //     transactionId: null
  //   },
  //   {
  //     id: 4,
  //     orderId: "#ORD-2025-004",
  //     description: "Annual subscription renewal",
  //     amount: 2999.99,
  //     status: "pending",
  //     date: "2025-08-26",
  //     method: null,
  //     transactionId: null
  //   },
  //   {
  //     id: 5,
  //     orderId: "#ORD-2025-005",
  //     description: "Custom domain setup",
  //     amount: 99.99,
  //     status: "paid",
  //     date: "2025-08-18",
  //     method: "Net Banking",
  //     transactionId: "TXN987654321"
  //   }
  // ]);

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
        // Axios or similar clients resolve data directly (no .json() needed)
        // So just access response.data directly.
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
  }, [currentPage]);



  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
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
      case 'paid':
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
    if (payment.status === 'paid') {
      setSelectedPayment(payment);
      setShowPaidModal(true);
    } else if (payment.status === 'pending' || payment.status === 'failed') {
      setSelectedPayment(payment);
      setCurrentView('payment');
    }
  };

  const filteredHistory = paymentHistory.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const processPayment = () => {
    setIsProcessing(true);
    setShowConfirmModal(false);

    setTimeout(() => {
      setIsProcessing(false);
      // Update the payment status to paid
      const updatedHistory = paymentHistory.map(payment =>
        payment.id === selectedPayment.id
          ? {
            ...payment,
            status: 'paid',
            method: paymentMethods.find(m => m.id === selectedMethod)?.name || selectedMethod,
            transactionId: `TXN${Date.now()}`
          }
          : payment
      );
      setPaymentHistory(updatedHistory);
      setCurrentView('dashboard');
      setSelectedPayment(null);
    }, 3000);
  };

  // Calculate stats
  const totalPaid = paymentHistory.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = paymentHistory
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const thisMonth = paymentHistory.reduce(
    (sum, p) => sum + (isNaN(Number(p.amount)) ? 0 : Number(p.amount)),
    0
  );


  // Payment Success Modal for completed payments
  const PaidDetailsModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Payment Details</h3>
          <button
            onClick={() => setShowPaidModal(false)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={24} className="text-white" />
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">Payment Successful</h4>
          <p className="text-white/70 text-sm">Transaction completed successfully</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-white/70">Amount</span>
            <span className="text-white font-semibold">${selectedPayment?.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Order ID</span>
            <span className="text-white/80 text-sm">{selectedPayment?.orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Transaction ID</span>
            <span className="text-white/80 text-sm">{selectedPayment?.transactionId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Payment Method</span>
            <span className="text-white/80 text-sm">{selectedPayment?.method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Date</span>
            <span className="text-white/80 text-sm">{selectedPayment?.date}</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setShowPaidModal(false)}
            className="flex-1 bg-white/10 text-white py-3 rounded-xl font-medium hover:bg-white/20 transition-all flex items-center justify-center space-x-2"
          >
            <Download size={16} />
            <span>Download Receipt</span>
          </button>
          <button
            onClick={() => setShowPaidModal(false)}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Dashboard View
  const DashboardView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button className="text-white/60 hover:text-white transition-colors mr-4">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-white">Payments & Billing</h1>
          </div>
          <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all">
            Add Payment Method
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Paid</p>
                <p className="text-2xl font-bold text-green-400">${totalPaid.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle size={24} className="text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">${totalPending.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <AlertCircle size={24} className="text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">This Month</p>
                <p className="text-2xl font-bold text-white">${thisMonth.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Calendar size={24} className="text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-green-500/50"
              />
            </div>

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <button className="bg-white/10 text-white px-4 py-3 rounded-xl hover:bg-white/20 transition-colors flex items-center space-x-2">
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Payment History</h2>
            <button className="text-white/60 hover:text-white transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>

          <div className="space-y-3">
            {filteredHistory.map((payment) => (
              <div
                key={payment.id}
                onClick={() => handlePaymentClick(payment)}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      {getStatusIcon(payment.status)}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{payment.description}</h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <p className="text-white/60 text-sm">{payment.freelancer_name}</p>
                        <span className="text-white/40">•</span>
                        <p className="text-white/60 text-sm">{payment.created_at.split('T')[0]}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">${payment.amount}</p>
                      {payment.method && (
                        <p className="text-white/60 text-xs">{payment.payment_method}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-12">
              <CreditCard size={48} className="text-white/30 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">No payments found</h4>
              <p className="text-white/60">Try adjusting your search or filter criteria</p>
            </div>
          )}
          <div className="flex justify-center gap-2 pt-6">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg ${i + 1 === currentPage
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'text-white bg-white/10 hover:bg-white/20'
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>


        </div>
      </div>

      {/* Paid Payment Details Modal */}
      {showPaidModal && selectedPayment && <PaidDetailsModal />}
    </div>
  );

  // Payment Flow
  const PaymentFlow = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-white/60 hover:text-white transition-colors mr-4"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-white">Complete Payment</h1>
        </div>

        {/* Payment Summary Card */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Payment Summary</h2>
            <div className="flex items-center text-green-400">
              <Shield size={16} className="mr-1" />
              <span className="text-xs">Secure</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-white font-medium">{selectedPayment?.description}</p>
                <p className="text-white/60 text-sm">YourApp Premium</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">${selectedPayment?.amount}</p>
                <p className="text-white/60 text-xs">Order {selectedPayment?.orderId}</p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-3 flex justify-between items-center">
              <span className="text-white/70">Total Amount</span>
              <span className="text-xl font-bold text-green-400">${selectedPayment?.amount}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Choose Payment Method</h2>

          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`relative cursor-pointer transition-all duration-300 ${selectedMethod === method.id
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/40'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                    } border rounded-xl p-4`}
                >
                  {method.popular && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <Star size={10} className="mr-1" />
                      Popular
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedMethod === method.id
                        ? 'bg-green-500/20'
                        : 'bg-white/10'
                        }`}>
                        <IconComponent size={20} className={
                          selectedMethod === method.id ? 'text-green-400' : 'text-white/70'
                        } />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{method.name}</h4>
                        <p className="text-white/60 text-sm">{method.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="flex items-center text-white/60 text-xs">
                          <Clock size={12} className="mr-1" />
                          {method.processingTime}
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id
                        ? 'border-green-500 bg-green-500'
                        : 'border-white/30'
                        }`}>
                        {selectedMethod === method.id && (
                          <Check size={14} className="text-white" />
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
        <div className="sticky bottom-4">
          <button
            onClick={() => setShowConfirmModal(true)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl text-lg font-bold hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-[1.02] shadow-lg shadow-green-500/25"
          >
            <div className="flex items-center justify-center space-x-2">
              <Lock size={20} />
              <span>Pay ${selectedPayment?.amount} Securely</span>
            </div>
          </button>

          <p className="text-center text-white/50 text-xs mt-3">
            By proceeding, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Confirm Payment</h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white/70">Amount</span>
                <span className="text-2xl font-bold text-white">${selectedPayment?.amount}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-white/70">Description</span>
                <span className="text-white text-sm">{selectedPayment?.description}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-white/70">Payment Method</span>
                <span className="text-white capitalize">{paymentMethods.find(m => m.id === selectedMethod)?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Order ID</span>
                <span className="text-white text-sm">{selectedPayment?.orderId}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-white/10 text-white py-3 rounded-xl font-medium hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={processPayment}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center space-x-2"
              >
                <Lock size={16} />
                <span>Pay Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Modal */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 border-4 border-white/20 border-t-green-500 rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-white mb-2">Processing Payment</h3>
            <p className="text-white/70 mb-4">Please don&apos;t close this window</p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Amount</span>
                <span className="text-white font-semibold">${selectedPayment?.amount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Main render logic
  if (currentView === 'payment') {
    return <PaymentFlow />;
  }

  return <DashboardView />;
};

export default PaymentDashboard;