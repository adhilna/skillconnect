import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles, HelpCircle,
  X,
  Lightbulb,
  AlertCircle,
  DollarSign,
  Briefcase,
  CreditCard,
  TrendingUp,
  Clock,
  Star,
  CheckCircle,
  Calendar,
  Filter,
  Download,
  Eye,
  Search,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ArrowUpDown,
  Award,
  Target,
  Users,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
  Legend
} from 'recharts';
import { FaSpinner } from 'react-icons/fa';

const generateSmartInsights = ({
  monthlyEarningsData,
  activeProjects,
  paymentMethodData
}) => {
  const insights = [];

  // Earnings trend: recent 3-month vs previous 3-month average.
  const recentMonths = monthlyEarningsData.slice(-3);
  const avgRecent = recentMonths.reduce((sum, m) => sum + m.earnings, 0) / 3;
  const prevMonths = monthlyEarningsData.slice(-6, -3);
  const avgPrev = prevMonths.reduce((sum, m) => sum + m.earnings, 0) / 3;

  if (avgPrev > 0) {
    if (avgRecent > avgPrev * 1.15) {
      insights.push({
        type: 'success',
        icon: '🎉',
        title: 'Earnings Growth',
        message: `Great! Your earnings increased ${(((avgRecent - avgPrev) / avgPrev) * 100).toFixed(0)}% recently`
      });
    } else if (avgRecent < avgPrev * 0.85) {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Earnings Decline',
        message: `Earnings dropped ${(((avgPrev - avgRecent) / avgPrev) * 100).toFixed(0)}%. Check pending projects.`
      });
    }
  }

  // Urgent deadlines: less than 50% progress, deadline within next 7 days
  const inAWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const behindSchedule = activeProjects.filter(p =>
    (typeof p.progress === 'number' && p.progress < 50) &&
    new Date(p.deadline) < inAWeek
  );
  if (behindSchedule.length > 0) {
    insights.push({
      type: 'urgent',
      icon: '🚨',
      title: 'Urgent Deadlines',
      message: `${behindSchedule.length} project(s) due within 7 days need attention`
    });
  }

  // Payment method insight
  if (paymentMethodData && paymentMethodData.length) {
    const mostUsedMethod = paymentMethodData.slice().sort((a, b) => b.value - a.value)[0];
    insights.push({
      type: 'info',
      icon: '💡',
      title: 'Payment Preference',
      message: `${mostUsedMethod.value} payments via ${mostUsedMethod.name}`
    });
  }
  return insights.slice(0, 3); // Show top 3
};


const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// const paymentMethodData = [
//   { name: 'Stripe', value: 45, color: '#8B5CF6' },
//   { name: 'PayPal', value: 35, color: '#06B6D4' },
//   { name: 'Razorpay', value: 20, color: '#10B981' }
// ];

// const ratingsOverTimeData = [
//   { month: 'Jan', rating: 4.2 },
//   { month: 'Feb', rating: 4.5 },
//   { month: 'Mar', rating: 4.3 },
//   { month: 'Apr', rating: 4.7 },
//   { month: 'May', rating: 4.6 },
//   { month: 'Jun', rating: 4.8 },
//   { month: 'Jul', rating: 4.9 },
//   { month: 'Aug', rating: 4.8 },
//   { month: 'Sep', rating: 4.9 },
//   { month: 'Oct', rating: 4.9 },
// ];

const AnalyticsSection = ({ paymentHistory, totalPages, setTotalPages, loadingPayments, activeProjects }) => {
  // const [timeRange, setTimeRange] = useState('3months');
  const [selectedMetric, setSelectedMetric] = useState('earnings');
  const [showGuide, setShowGuide] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const [projectSearch, setProjectSearch] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState("all");
  const [projectSortField, setProjectSortField] = useState("title");
  const [projectSortOrder, setProjectSortOrder] = useState("asc");
  const [projectPage, setProjectPage] = useState(1);
  const projectItemsPerPage = 5;

  const filteredTransactions = useMemo(() => {
    let filtered = Array.isArray(paymentHistory)
      ? paymentHistory.filter(transaction => {
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
      }) : [];;
    console.log("filtering paymentHistory:", paymentHistory);
    // console.log("filtered by search/status:", filtered.length);

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      if (sortKey === 'date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, sortKey, sortOrder, paymentHistory]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredTransactions.length / itemsPerPage));
  }, [filteredTransactions]);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredProjects = useMemo(() => {
    return Array.isArray(activeProjects)
      ? activeProjects.filter((project) => {
        const matchesSearch =
          project.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
          project.client.toLowerCase().includes(projectSearch.toLowerCase()) ||
          project.category.toLowerCase().includes(projectSearch.toLowerCase());

        const matchesStatus =
          projectStatusFilter === "all" ? true : project.status === projectStatusFilter;

        return matchesSearch && matchesStatus;
      })
      : [];
  }, [activeProjects, projectSearch, projectStatusFilter]);


  const monthlyEarningsData = useMemo(() => {
    if (!Array.isArray(paymentHistory) || paymentHistory.length === 0) return [];

    // Initialize totals for every month
    const monthlyTotals = months.reduce((acc, m) => ({ ...acc, [m]: { earnings: 0, projects: 0 } }), {});

    paymentHistory.forEach(payment => {
      const status = payment.status?.toLowerCase();
      if (status !== "completed" && status !== "paid") return; // ✅ accept both
      if (!payment.created_at || !payment.amount) return;

      const date = new Date(payment.created_at);
      const monthName = months[date.getMonth()];
      const amountNum = parseFloat(payment.amount);

      if (!isNaN(amountNum)) {
        monthlyTotals[monthName].earnings += amountNum;
        monthlyTotals[monthName].projects += 1;
      }
    });

    // Convert object into array
    return months.map(m => ({
      month: m,
      earnings: monthlyTotals[m].earnings,
      projects: monthlyTotals[m].projects,
    }));
  }, [paymentHistory]);

  const paymentMethodData = useMemo(() => {
    if (!Array.isArray(paymentHistory) || paymentHistory.length === 0) return [];
    const counts = paymentHistory.reduce((acc, curr) => {
      const method = (curr.payment_method || "Other").toLowerCase();
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {});
    const colors = { razorpay: "#10B981", upi: "#06B6D4", stripe: "#8B5CF6", paypal: "#3B82F6", other: "#6366F1" };
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: colors[name] || "#6366F1",
    }));
  }, [paymentHistory]);


  const avgProgressByDeadlineMonth = useMemo(() => {
    if (!Array.isArray(activeProjects) || activeProjects.length === 0) return [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const progressByMonth = {};
    activeProjects.forEach(project => {
      if (!project.deadline || typeof project.progress !== 'number') return;
      const monthIdx = new Date(project.deadline).getMonth();
      const monthStr = months[monthIdx];
      if (!progressByMonth[monthStr]) progressByMonth[monthStr] = [];
      progressByMonth[monthStr].push(project.progress);
    });
    return months.map(month => ({
      month,
      progress: progressByMonth[month] && progressByMonth[month].length > 0
        ? progressByMonth[month].reduce((a, b) => a + b, 0) / progressByMonth[month].length
        : null
    }));
  }, [activeProjects]);
  console.log("avgProgressByDeadlineMonth:", avgProgressByDeadlineMonth);


  const handleProjectSort = (field) => {
    if (projectSortField === field) {
      setProjectSortOrder(projectSortOrder === "asc" ? "desc" : "asc");
    } else {
      setProjectSortField(field);
      setProjectSortOrder("asc");
    }
  };

  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      let aVal = a[projectSortField];
      let bVal = b[projectSortField];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return projectSortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return projectSortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredProjects, projectSortField, projectSortOrder]);

  const totalProjectPages = Math.ceil(sortedProjects.length / projectItemsPerPage);
  const paginatedProjects = sortedProjects.slice(
    (projectPage - 1) * projectItemsPerPage,
    projectPage * projectItemsPerPage
  );

  const renderPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        className={`px-3 py-1 rounded-lg ${currentPage === i + 1
          ? "bg-purple-500 text-white"
          : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
      >
        {i + 1}
      </button>
    ));
  };

  const renderProjectPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalProjectPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setProjectPage(i)}
          className={`px-3 py-1 rounded-lg ${projectPage === i
            ? "bg-purple-500 text-white"
            : "bg-white/10 text-white hover:bg-white/20"
            }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  const projectStatusData = useMemo(() => {
    if (!Array.isArray(activeProjects) || activeProjects.length === 0) return [];

    const total = activeProjects.length;

    const statusCounts = activeProjects.reduce((acc, project) => {
      const status = project.status?.toLowerCase() || "unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statusColors = {
      completed: { hex: "#10B981", class: "bg-green-500/20 text-green-400 border-green-500/30" },
      planning: { hex: "#A855F7", class: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
      advance: { hex: "#34D399", class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
      draft: { hex: "#9CA3AF", class: "bg-gray-500/20 text-gray-400 border-white-500/30" },
      submitted: { hex: "#6366F1", class: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" },
      "in-progress": { hex: "#3B82F6", class: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      "milestone-1": { hex: "#F97316", class: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
      revision: { hex: "#EC4899", class: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
      "final-review": { hex: "#FBBF24", class: "bg-yellow-300/20 text-yellow-400 border-yellow-200/20" },
      pending: { hex: "#F59E0B", class: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
      paid: { hex: "#22C55E", class: "bg-green-500/20 text-green-400 border-green-500/30" },
      unknown: { hex: "#6B7280", class: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
    };

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: Math.round((count / total) * 100),
      count,
      color: statusColors[status]?.hex || "#6B7280", // ✅ use HEX for PieChart
      className: statusColors[status]?.class || statusColors.unknown.class, // ✅ use class for list
    }));
  }, [activeProjects]);

  // Dynamic Calculations
  const analytics = useMemo(() => {
    const successfulPayments = paymentHistory.filter(
      (t) => t.status?.toLowerCase() === "completed"
    );
    const completedProjects = (Array.isArray(activeProjects) ? activeProjects : []).filter(
      (p) => ["completed", "paid"].includes(p.status?.toLowerCase())
    );

    const pendingPayments = (Array.isArray(paymentHistory) ? paymentHistory : []).filter(
      (p) => p.status?.toLowerCase() === "pending"
    );

    const inProgressProjects = Array.isArray(activeProjects)
      ? activeProjects.filter(p => p.status === 'in-progress')
      : [];

    const totalAmount = successfulPayments.reduce(
      (sum, t) => sum + Number(t.amount),
      0
    );
    const commission = successfulPayments.length * 150;
    const totalCommission = successfulPayments.reduce(
      (sum, t) => sum + Number(t.platform_fee || 0),
      0
    );
    const pendingAmount = pendingPayments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

    const ratingsAverage = successfulPayments
      .filter(p => p.rating)
      .reduce((sum, p, _, arr) => sum + p.rating / arr.length, 0);

    const averageProjectValue = successfulPayments.length > 0
      ? totalAmount / successfulPayments.length
      : 0;

    return {
      totalAmount,
      completedProjectsCount: completedProjects.length,
      commission,
      totalCommission,
      averageProjectValue,
      pendingAmount,
      pendingPaymentsLength: pendingPayments.length,
      ratingsAverage,
      inProgressCount: inProgressProjects.length,
      totalProjects: activeProjects.length
    };
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      completed: "bg-green-500/20 text-green-400 border-green-500/30",
      planning: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      advance: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      draft: "bg-gray-500/20 text-gray-400 border-white-500/30",
      submitted: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
      "in-progress": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "milestone-1": "bg-orange-500/20 text-orange-400 border-orange-500/30",
      revision: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      "final-review": "bg-yellow-300/20 text-yellow-400 border-yellow-200/20",
      pending: "bg-red-500/20 text-red-400 border-red-500/30",
      paid: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
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

  const CustomTooltip = ({ active, payload, label, selectedMetric }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      // Determine display values based on the chart type
      const name = data.name ?? label ?? "Unknown"; // Pie: name, Bar/Line: label
      const value = data.value ?? data[selectedMetric] ?? payload[0].value ?? 0;
      const count = data.count ?? data.projects ?? "—";
      const color = data.color ?? "#fff";

      return (
        <div className="bg-gray-900/95 backdrop-blur-lg p-3 rounded-lg border border-white/20 shadow-xl">
          <p className="text-white font-medium">{name}</p>
          <p className="text-sm" style={{ color }}>
            {selectedMetric === "earnings"
              ? `₹${value.toLocaleString()}`
              : selectedMetric === "projects"
                ? `${count} projects`
                : data.value !== undefined
                  ? `${count} projects (${value}%)`
                  : `${value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const PaymentDashboardSkeleton = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-grey-900 via-purple-900 to-purple-900 p-4 lg:p-8">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-1000 via-purple-900 to-purple-900 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">Performance Analytics</h1>
            <p className="text-white/60 mt-2">Track your freelancing journey and optimize your earnings</p>
          </div>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center gap-2"
          >
            <HelpCircle size={16} />
            Dashboard Guide
          </button>
        </div>

        {/* --- COLLAPSIBLE GUIDE --- */}
        {showGuide && (
          <div className="mb-6 bg-black/40 backdrop-blur-2xl rounded-2xl border border-purple-500/30 p-6 animate-in slide-in-from-top">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Target className="text-purple-400" size={20} />
                Quick Guide
              </h3>
              <button
                onClick={() => setShowGuide(false)}
                className="text-white/60 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                <h4 className="text-purple-300 font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp size={16} />
                  Monthly Earnings
                </h4>
                <p className="text-white/70 text-sm">
                  Track monthly patterns to identify peak seasons and optimize project scheduling.
                </p>
              </div>
              <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/20">
                <h4 className="text-orange-300 font-semibold mb-2 flex items-center gap-2">
                  <Activity size={16} />
                  Project Status
                </h4>
                <p className="text-white/70 text-sm">
                  Move projects from &quot;in-progress&quot; to &quot;completed&quot; to unlock payments faster.
                </p>
              </div>
              <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                <h4 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
                  <CreditCard size={16} />
                  Payment Methods
                </h4>
                <p className="text-white/70 text-sm">
                  Optimize checkout by promoting your clients&apos; preferred payment option.
                </p>
              </div>
              <div className="bg-cyan-500/10 rounded-xl p-4 border border-cyan-500/20">
                <h4 className="text-cyan-300 font-semibold mb-2 flex items-center gap-2">
                  <Clock size={16} />
                  Progress Tracking
                </h4>
                <p className="text-white/70 text-sm">
                  Low progress this month? Prioritize projects with upcoming deadlines.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6">
          {/* Total Earnings */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:bg-black/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500/20 p-3 rounded-xl">
                <DollarSign className="text-green-400" size={24} />
              </div>
              <div className="text-green-400 text-sm font-medium">+12.5%</div>
            </div>
            <div>
              <p className="text-white/60 text-sm font-medium">Total Earnings</p>
              <p className="text-2xl font-bold text-white mt-1">
                {formatCurrency(analytics.totalAmount)}
              </p>
            </div>
          </div>

          {/* Completed Projects */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:bg-black/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <Briefcase className="text-blue-400" size={24} />
              </div>
              <div className="text-blue-400 text-sm font-medium">+8.3%</div>
            </div>
            <div>
              <p className="text-white/60 text-sm font-medium">Projects Completed</p>
              <p className="text-2xl font-bold text-white mt-1">{analytics.completedProjectsCount}</p>
            </div>
          </div>

          {/* Commission Paid */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:bg-black/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <CreditCard className="text-purple-400" size={24} />
              </div>
              <div className="text-purple-400 text-sm font-medium">10%</div>
            </div>
            <div>
              <p className="text-white/60 text-sm font-medium">Commission Paid</p>
              <p className="text-2xl font-bold text-white mt-1">
                {formatCurrency(analytics.commission)}
              </p>
            </div>
          </div>

          {/* Average Project Value */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:bg-black/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-cyan-500/20 p-3 rounded-xl">
                <TrendingUp className="text-cyan-400" size={24} />
              </div>
              <div className="text-cyan-400 text-sm font-medium">+15.2%</div>
            </div>
            <div>
              <p className="text-white/60 text-sm font-medium">Avg Project Value</p>
              <p className="text-2xl font-bold text-white mt-1">
                {formatCurrency(analytics.averageProjectValue)}
              </p>
            </div>
          </div>

          {/* Pending Payments */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:bg-black/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-500/20 p-3 rounded-xl">
                <Clock className="text-yellow-400" size={24} />
              </div>
              <div className="text-yellow-400 text-sm font-medium">{analytics.pendingPaymentsLength}</div>
            </div>
            <div>
              <p className="text-white/60 text-sm font-medium">Pending Payments</p>
              <p className="text-2xl font-bold text-white mt-1">
                {formatCurrency(analytics.pendingAmount)}
              </p>
            </div>
          </div>

          {/* Client Ratings */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:bg-black/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-500/20 p-3 rounded-xl">
                <Star className="text-orange-400" size={24} />
              </div>
              <div className="text-orange-400 text-sm font-medium">Excellent</div>
            </div>
            <div>
              <p className="text-white/60 text-sm font-medium">Avg Rating</p>
              <p className="text-2xl font-bold text-white mt-1">
                {analytics.ratingsAverage.toFixed(1)} ⭐
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="text-purple-400" size={24} />
              Smart Insights
            </h3>
            <span className="text-xs text-white/60 flex items-center gap-1">
              <FaSpinner className="animate-spin h-3 w-3 mr-1" />
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {generateSmartInsights({ monthlyEarningsData, activeProjects, paymentMethodData }).map((insight, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${insight.type === 'success' ? 'bg-green-500/10 border-green-500/30' :
                  insight.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                    insight.type === 'urgent' ? 'bg-red-500/10 border-red-500/30' :
                      'bg-blue-500/10 border-blue-500/30'
                  }`}
              >
                <div className="text-2xl mb-2">{insight.icon}</div>
                <h4 className="text-white font-semibold mb-1">{insight.title}</h4>
                <p className="text-white/70 text-sm mb-3">{insight.message}</p>
              </div>
            ))}
          </div>
        </div>


        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Monthly Earnings Bar Chart */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Monthly Earnings Trend</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedMetric('earnings')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${selectedMetric === 'earnings'
                    ? 'bg-purple-600/80 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                >
                  Earnings
                </button>
                <button
                  onClick={() => setSelectedMetric('projects')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${selectedMetric === 'projects'
                    ? 'bg-purple-600/80 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                >
                  Projects
                </button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyEarningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="month" stroke="#ffffff60" interval={0} allowDuplicatedCategory={false} />
                  <YAxis stroke="#ffffff60" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey={selectedMetric}
                    fill="url(#earningsGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Project Status Distribution */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <h3 className="text-xl font-bold text-white mb-6">Project Status Distribution</h3>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="w-64 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-4">
                {projectStatusData.map((status, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between rounded-lg p-3 border ${status.className}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: status.color }} />
                      <span className="text-white/80">{status.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">{status.count} projects</div>
                      <div className="text-white/60 text-sm">{status.value}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* Payment Methods */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <h3 className="text-xl font-bold text-white mb-6">Payment Method Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {paymentMethodData.map((method, index) => (
                <div key={index} className="text-center">
                  <div
                    className="w-3 h-3 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: method.color }}
                  />
                  <div className="text-white/80 text-sm font-medium">{method.name}</div>
                  <div className="text-white/60 text-xs">{method.value}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Ratings Over Time */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <h3 className="text-xl font-bold text-white mb-6">Average Progress by Deadline Month</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={avgProgressByDeadlineMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="month" stroke="#ffffff60" />
                  <YAxis domain={[0, 100]} stroke="#ffffff60" />
                  <Tooltip content={<CustomTooltip selectedMetric="progress" />} />
                  <Line
                    type="monotone"
                    dataKey="progress"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                    connectNulls={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Tables Section */}
        <div className="flex flex-col gap-6">
          {/* Recent Payments */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            {/* Filters and Search */}
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
                      <button onClick={() => handleSort("id")} className="flex items-center space-x-1 hover:text-white/80">
                        <span>Transaction ID</span>
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium">Client</th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium">Method</th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium">
                      <button onClick={() => handleSort("amount")} className="flex items-center space-x-1 hover:text-white/80">
                        <span>Amount</span>
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium">
                      <button onClick={() => handleSort("date")} className="flex items-center space-x-1 hover:text-white/80">
                        <span>Date</span>
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map(payment => (
                    <tr key={payment.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-white/80 font-mono text-sm">txn_{payment.transaction_id}</td>
                      <td className="py-4 px-4 text-white/80">{payment.payee_name}</td>
                      <td className="py-4 px-4 text-white/60 text-sm">{payment.payment_method}</td>
                      <td className="py-4 px-4 text-white font-medium">{formatCurrency(payment.amount)}</td>
                      <td className="py-4 px-4">{getStatusBadge(payment.status)}</td>
                      <td className="py-4 px-4 text-white/60 text-sm">{formatDate(payment.updated_at)}</td>
                    </tr>
                  ))}
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

          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            {/* Filters + Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-bold text-white">Project Overview</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={16} />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 w-full sm:w-64"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <select
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 appearance-none pr-8"
                    value={projectStatusFilter}
                    onChange={(e) => setProjectStatusFilter(e.target.value)}
                  >
                    <option value="all" className="bg-gray-900">All Status</option>
                    <option value="completed" className="bg-gray-900">Completed</option>
                    <option value="planning" className="bg-gray-900">Planning</option>
                    <option value="advance" className="bg-gray-900">Advance</option>
                    <option value="draft" className="bg-gray-900">Draft</option>
                    <option value="submitted" className="bg-gray-900">Submitted</option>
                    <option value="in-progress" className="bg-gray-900">In Progress</option>
                    <option value="milestone-1" className="bg-gray-900">Milestone 1</option>
                    <option value="revision" className="bg-gray-900">Revision</option>
                    <option value="final-review" className="bg-gray-900">Final Review</option>
                    <option value="pending" className="bg-gray-900">Pending</option>
                    <option value="failed" className="bg-gray-900">Failed</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/40" size={16} />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/60 font-medium">
                      <button onClick={() => handleProjectSort("title")} className="flex items-center space-x-1 hover:text-white/80">
                        <span>Title</span>
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium">Client</th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium">Category</th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium">
                      <button onClick={() => handleProjectSort("value")} className="flex items-center space-x-1 hover:text-white/80">
                        <span>Value</span>
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProjects.map((project) => (
                    <tr key={project.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-white/80 flex items-center gap-2">
                        {project.title}
                      </td>
                      <td className="py-4 px-4 text-white/80">{project.client}</td>
                      <td className="py-4 px-4 text-white/60 text-sm">{project.category}</td>
                      <td className="py-4 px-4 text-white font-medium">{formatCurrency(project.amount)}</td>
                      <td className="py-4 px-4">{getStatusBadge(project.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
              <div className="text-white/60 text-sm">
                Showing {(projectPage - 1) * projectItemsPerPage + 1} to{" "}
                {Math.min(projectPage * projectItemsPerPage, filteredProjects.length)} of{" "}
                {filteredProjects.length} projects
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setProjectPage(Math.max(1, projectPage - 1))}
                  disabled={projectPage === 1}
                  className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex space-x-1">{renderProjectPageNumbers()}</div>

                <button
                  onClick={() => setProjectPage(Math.min(totalProjectPages, projectPage + 1))}
                  disabled={projectPage === totalProjectPages}
                  className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Performance Insights */}
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Lightbulb className="text-yellow-400" size={20} />
              Pro Tips
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-white/80">
                <span className="text-green-400 font-semibold">Boost earnings:</span> Focus on high-value projects and consistent delivery.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <AlertCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-white/80">
                <span className="text-yellow-400 font-semibold">Avoid delays:</span> Monitor progress weekly and update clients regularly.
              </p>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default AnalyticsSection;