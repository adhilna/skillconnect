import React, { useState, useMemo, useEffect } from 'react';
import {
    Search,
    Filter,
    Calendar,
    Download,
    TrendingUp,
    CreditCard,
    Users,
    DollarSign,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const paymentMethodData = [
    { name: 'Stripe', value: 45, color: '#8B5CF6' },
    { name: 'PayPal', value: 30, color: '#06B6D4' },
    { name: 'Razorpay', value: 25, color: '#10B981' }
];

const AnalyticsSection = ({paymentHistory, totalPages, setTotalPages, loadingPayments }) => {
    // const [paymentHistory, setPaymentHistory] = useState([]);
    // const [loading, setLoading] = useState(false);
    // const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');
    // const { token } = useContext(AuthContext);
    const itemsPerPage = 5;

    // useEffect(() => {
    //     const fetchPayments = async () => {
    //         setLoading(true);
    //         try {
    //             const response = await api.get(
    //                 `/api/v1/messaging/payment-requests-full/`,
    //                 {
    //                     headers: {
    //                         Authorization: `Bearer ${token}`,
    //                         "Content-Type": "application/json",
    //                     },
    //                 }
    //             );
    //             const data = response.data;
    //             console.log("API data:", data);
    //             if (Array.isArray(data)) {
    //                 setPaymentHistory(data);
    //                 setTotalPages(1);
    //             } else {
    //                 setPaymentHistory(data.results || []);
    //                 setTotalPages(data.total_pages || 1);
    //             }
    //         } catch (error) {
    //             console.error("Failed to fetch payment requests:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     if (token) fetchPayments();
    // }, [token]);

    useEffect(() => {
        console.log("paymentHistory updated:", paymentHistory);
        console.log(paymentHistory.map(t => t.status));
    }, [paymentHistory]);

    const monthlyData = useMemo(() => {
        if (!paymentHistory || paymentHistory.length === 0) return [];

        // Initialize object with all months set to 0
        const monthlyTotals = months.reduce((acc, m) => ({ ...acc, [m]: 0 }), {});

        paymentHistory.forEach(payment => {
            if (payment.status !== "completed") return; // Only count successful payments
            if (!payment.created_at || !payment.amount) return;

            const date = new Date(payment.created_at);
            const monthName = months[date.getMonth()];
            const amountNum = parseFloat(payment.amount);

            if (!isNaN(amountNum)) {
                monthlyTotals[monthName] += amountNum;
            }
        });

        // Convert object into array format for recharts
        return months.map(m => ({
            month: m,
            amount: monthlyTotals[m],
        }));
    }, [paymentHistory]);

    // Calculate summary metrics
    const summaryMetrics = useMemo(() => {
        console.log(paymentHistory.map(t => t.status));
        const successfulPayments = paymentHistory.filter(
            (t) => t.status?.toLowerCase() === "completed"
        );

        const commission = successfulPayments.length * 150;

        const totalAmount = successfulPayments.reduce(
            (sum, t) => sum + Number(t.amount),
            0
        );
        const totalCommission = successfulPayments.reduce(
            (sum, t) => sum + Number(t.platform_fee || 0),
            0
        );
        const successRate =
            paymentHistory.length > 0
                ? (successfulPayments.length / paymentHistory.length) * 100
                : 0;
        return {
            totalAmount,
            totalPayments: paymentHistory.length,
            totalCommission,
            successRate,
            commission
        };
    }, [paymentHistory]);

    // Filter and sort transactions
    const filteredTransactions = useMemo(() => {
        let filtered = paymentHistory.filter(transaction => {
            const freelancer = String(transaction.freelancer_name ?? "").toLowerCase();
            const service = String(transaction.description ?? "").toLowerCase();
            const id = String(transaction.id ?? "").toLowerCase();

            const lowerSearch = searchTerm.toLowerCase();

            const matchesSearch =
                freelancer.includes(lowerSearch) ||
                service.includes(lowerSearch) ||
                id.includes(lowerSearch);
            const matchesStatus = statusFilter === 'all' || transaction.status?.toLowerCase() === statusFilter.toLowerCase();
            return matchesSearch && matchesStatus;
        });
        console.log("filtering paymentHistory:", paymentHistory);
        console.log("filtered by search/status:", filtered.length);


        // Sort
        filtered.sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];

            if (sortField === 'date') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            }

            if (sortDirection === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return filtered;
    }, [searchTerm, statusFilter, sortField, sortDirection, paymentHistory]);

    // Pagination
    useEffect(() => {
        setTotalPages(Math.ceil(filteredTransactions.length / itemsPerPage));
    }, [filteredTransactions]);
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const getStatusBadge = (status) => {
        const statusStyles = {
            completed: "bg-green-500/20 text-green-400 border-green-500/30",
            pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
            failed: "bg-red-500/20 text-red-400 border-red-500/30",
        };
        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || ""
                    }`}
            >
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : ""}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const PaymentDashboardSkeleton = () => {
        return (
            <div className="min-h-screen bg-gradient-to-br from-grey-900 via-blue-900 to-blue-900 p-4 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header Skeleton */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <div className="h-8 bg-white/10 rounded-lg w-64 animate-pulse mb-2"></div>
                            <div className="h-4 bg-white/5 rounded w-96 animate-pulse"></div>
                        </div>
                        <div className="flex gap-3">
                            <div className="h-10 bg-white/10 rounded-lg w-32 animate-pulse"></div>
                            <div className="h-10 bg-blue-600/20 rounded-lg w-24 animate-pulse"></div>
                        </div>
                    </div>

                    {/* Summary Cards Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="h-4 bg-white/10 rounded w-24 animate-pulse mb-3"></div>
                                        <div className="h-8 bg-white/20 rounded w-20 animate-pulse"></div>
                                    </div>
                                    <div className="bg-white/10 p-3 rounded-xl animate-pulse">
                                        <div className="w-6 h-6 bg-white/20 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Skeleton */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <div className="xl:col-span-2 bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                            <div className="h-6 bg-white/10 rounded w-32 animate-pulse mb-6"></div>
                            <div className="h-80 bg-white/5 rounded-lg animate-pulse"></div>
                        </div>
                        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                            <div className="h-6 bg-white/10 rounded w-28 animate-pulse mb-6"></div>
                            <div className="h-64 bg-white/5 rounded-lg animate-pulse mb-4"></div>
                            <div className="space-y-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex justify-between">
                                        <div className="h-4 bg-white/10 rounded w-16 animate-pulse"></div>
                                        <div className="h-4 bg-white/10 rounded w-8 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Table Skeleton */}
                    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                        <div className="flex justify-between mb-6">
                            <div className="h-6 bg-white/10 rounded w-40 animate-pulse"></div>
                            <div className="flex gap-3">
                                <div className="h-10 bg-white/10 rounded-lg w-64 animate-pulse"></div>
                                <div className="h-10 bg-white/10 rounded-lg w-32 animate-pulse"></div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex space-x-4 p-4 bg-white/5 rounded-lg">
                                    <div className="h-4 bg-white/10 rounded flex-1 animate-pulse"></div>
                                    <div className="h-4 bg-white/10 rounded w-24 animate-pulse"></div>
                                    <div className="h-4 bg-white/10 rounded w-20 animate-pulse"></div>
                                    <div className="h-4 bg-white/10 rounded w-16 animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loadingPayments) {
        return <PaymentDashboardSkeleton />;
    }

    const formatCurrency = (amount, currency = "INR") => {
        if (!amount || isNaN(amount)) return "0";
        return amount.toLocaleString("en-IN", {
            style: "currency",
            currency,
            minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 2,
        });
    };

    const renderPageNumbers = () => {
        const maxPagesToShow = 6;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = startPage + maxPagesToShow - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${currentPage === i
                        ? 'bg-blue-500 to-cyan-500 text-white'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                        }`}
                >
                    {i}
                </button>
            );
        }

        return pageNumbers;
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-grey-900 via-blue-900 to-indigo-900 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white">Payment Analytics</h1>
                        <p className="text-white/60 mt-2">Track and analyze client payments and commissions</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center space-x-2 backdrop-blur-lg border border-white/10">
                            <Calendar size={16} />
                            <span>Date Range</span>
                        </button>
                        <button className="bg-blue-600/80 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700/80 transition-colors flex items-center space-x-2 backdrop-blur-lg">
                            <Download size={16} />
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:bg-black/30 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/60 text-sm font-medium">Total Amount Paid</p>
                                <p className="text-2xl lg:text-2xl font-bold text-white mt-2">
                                    {formatCurrency(summaryMetrics.totalAmount)}
                                </p>
                            </div>
                            <div className="bg-green-500/20 p-3 rounded-xl">
                                <DollarSign className="text-green-400" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:bg-black/30 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/60 text-sm font-medium">Total Payments</p>
                                <p className="text-2xl lg:text-3xl font-bold text-white mt-2">{summaryMetrics.totalPayments}</p>
                            </div>
                            <div className="bg-blue-500/20 p-3 rounded-xl">
                                <CreditCard className="text-blue-400" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:bg-black/30 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/60 text-sm font-medium">Total Commission</p>
                                <p className="text-2xl lg:text-3xl font-bold text-white mt-2">
                                    {formatCurrency(summaryMetrics.commission)}
                                </p>
                            </div>
                            <div className="bg-purple-500/20 p-3 rounded-xl">
                                <TrendingUp className="text-purple-400" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:bg-black/30 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/60 text-sm font-medium">Success Rate</p>
                                <p className="text-2xl lg:text-3xl font-bold text-white mt-2">
                                    {summaryMetrics.successRate.toFixed(1)}%
                                </p>
                            </div>
                            <div className="bg-cyan-500/20 p-3 rounded-xl">
                                <Users className="text-cyan-400" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Monthly Payouts Bar Chart */}
                    <div className="xl:col-span-2 bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                        <h3 className="text-xl font-bold text-white mb-6">Monthly Payouts</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                                    <XAxis dataKey="month" stroke="#ffffff60" />
                                    <YAxis stroke="#ffffff60" />
                                    <Bar dataKey="amount" fill="url(#gradient)" radius={[4, 4, 0, 0]} />
                                    <defs>
                                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#8B5CF6" />
                                            <stop offset="100%" stopColor="#06B6D4" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Payment Methods Donut Chart */}
                    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                        <h3 className="text-xl font-bold text-white mb-6">Payment Methods</h3>
                        <div className="h-64 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={paymentMethodData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        dataKey="value"
                                    >
                                        {paymentMethodData.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            {paymentMethodData.map((method, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: method.color }}
                                        />
                                        <span className="text-white/80 text-sm">{method.name}</span>
                                    </div>
                                    <span className="text-white/60 text-sm">{method.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                        <h3 className="text-xl font-bold text-white">Transaction History</h3>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search transactions..."
                                    className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 w-full sm:w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <select
                                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 appearance-none pr-8"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all" className="bg-gray-900">All Status</option>
                                    <option value="completed" className="bg-gray-900">Completed</option>
                                    <option value="pending" className="bg-gray-900">Pending</option>
                                    <option value="failed" className="bg-gray-900">Failed</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/40" size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Transaction Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-white/60 font-medium">
                                        <button
                                            onClick={() => handleSort('id')}
                                            className="flex items-center space-x-1 hover:text-white/80"
                                        >
                                            <span>Transaction ID</span>
                                            <ArrowUpDown size={14} />
                                        </button>
                                    </th>
                                    <th className="text-left py-3 px-4 text-white/60 font-medium">Freelancer</th>
                                    <th className="text-left py-3 px-4 text-white/60 font-medium">Service</th>
                                    <th className="text-left py-3 px-4 text-white/60 font-medium">
                                        <button
                                            onClick={() => handleSort('amount')}
                                            className="flex items-center space-x-1 hover:text-white/80"
                                        >
                                            <span>Amount</span>
                                            <ArrowUpDown size={14} />
                                        </button>
                                    </th>
                                    <th className="text-left py-3 px-4 text-white/60 font-medium">Commission</th>
                                    <th className="text-left py-3 px-4 text-white/60 font-medium">Method</th>
                                    <th className="text-left py-3 px-4 text-white/60 font-medium">Status</th>
                                    <th className="text-left py-3 px-4 text-white/60 font-medium">
                                        <button
                                            onClick={() => handleSort('date')}
                                            className="flex items-center space-x-1 hover:text-white/80"
                                        >
                                            <span>Date</span>
                                            <ArrowUpDown size={14} />
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedTransactions.map((transaction) => {
                                    const amountWithExtra = Number(transaction.amount) + 150;
                                    return (
                                        <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-4 text-white/80 font-mono text-sm">txn_{transaction.id}</td>
                                            <td className="py-4 px-4 text-white/80">{transaction.freelancer_name}</td>
                                            <td className="py-4 px-4 text-white/60 text-sm">{transaction.description}</td>
                                            <td className="py-4 px-4 text-white font-medium">{formatCurrency(amountWithExtra)}</td>
                                            <td className="py-4 px-4 text-white/60">{formatCurrency(150)}</td>
                                            <td className="py-4 px-4 text-white/60">{transaction.payment_method}</td>
                                            <td className="py-4 px-4">{getStatusBadge(transaction.status)}</td>
                                            <td className="py-4 px-4 text-white/60 text-sm">{formatDate(transaction.created_at)}</td>
                                        </tr>
                                    );
                                })}

                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                        <div className="text-white/60 text-sm">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <div className="flex space-x-1">{renderPageNumbers()}</div>

                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsSection;