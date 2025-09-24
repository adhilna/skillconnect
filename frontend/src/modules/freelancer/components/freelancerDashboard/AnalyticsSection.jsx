import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Briefcase,
  CreditCard,
  TrendingUp,
  Clock,
  Star,
  Calendar,
  Filter,
  Download,
  Eye,
  ChevronRight,
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

// Mock Data - Replace with actual API calls
const mockPayments = [
  {
    id: "pay_001",
    amount: 45000,
    client: "TechCorp Solutions",
    project: "E-commerce Website",
    status: "completed",
    date: "2025-09-20T10:30:00Z",
    paymentMethod: "Stripe",
    platformFee: 4500,
    netEarning: 40500,
    rating: 5
  },
  {
    id: "pay_002",
    amount: 28000,
    client: "StartupXYZ",
    project: "Mobile App UI/UX",
    status: "completed",
    date: "2025-09-15T14:20:00Z",
    paymentMethod: "PayPal",
    platformFee: 2800,
    netEarning: 25200,
    rating: 4.8
  },
  {
    id: "pay_003",
    amount: 35000,
    client: "Digital Agency Pro",
    project: "Brand Identity Design",
    status: "pending",
    date: "2025-09-22T09:15:00Z",
    paymentMethod: "Razorpay",
    platformFee: 3500,
    netEarning: 31500,
    rating: null
  },
  {
    id: "pay_004",
    amount: 52000,
    client: "Enterprise Corp",
    project: "Full Stack Development",
    status: "completed",
    date: "2025-08-28T16:45:00Z",
    paymentMethod: "Stripe",
    platformFee: 5200,
    netEarning: 46800,
    rating: 4.9
  },
  {
    id: "pay_005",
    amount: 22000,
    client: "Local Business Inc",
    project: "WordPress Website",
    status: "completed",
    date: "2025-08-20T11:30:00Z",
    paymentMethod: "PayPal",
    platformFee: 2200,
    netEarning: 19800,
    rating: 4.7
  },
  {
    id: "pay_006",
    amount: 38000,
    client: "Creative Studios",
    project: "Logo & Branding",
    status: "in-progress",
    date: "2025-09-25T08:00:00Z",
    paymentMethod: "Stripe",
    platformFee: 3800,
    netEarning: 34200,
    rating: null
  }
];

const mockProjects = [
  {
    id: "proj_001",
    title: "E-commerce Website",
    client: "TechCorp Solutions",
    status: "completed",
    startDate: "2025-08-15",
    endDate: "2025-09-20",
    value: 45000,
    rating: 5,
    category: "Web Development"
  },
  {
    id: "proj_002",
    title: "Mobile App UI/UX",
    client: "StartupXYZ",
    status: "completed",
    startDate: "2025-08-01",
    endDate: "2025-09-15",
    value: 28000,
    rating: 4.8,
    category: "UI/UX Design"
  },
  {
    id: "proj_003",
    title: "Brand Identity Design",
    client: "Digital Agency Pro",
    status: "in-progress",
    startDate: "2025-09-10",
    endDate: "2025-10-05",
    value: 35000,
    rating: null,
    category: "Graphic Design"
  },
  {
    id: "proj_004",
    title: "Full Stack Development",
    client: "Enterprise Corp",
    status: "completed",
    startDate: "2025-07-15",
    endDate: "2025-08-28",
    value: 52000,
    rating: 4.9,
    category: "Web Development"
  },
  {
    id: "proj_005",
    title: "Social Media Management",
    client: "Retail Brand Co",
    status: "canceled",
    startDate: "2025-08-05",
    endDate: null,
    value: 15000,
    rating: null,
    category: "Digital Marketing"
  }
];

// Chart Data
const monthlyEarningsData = [
  { month: 'Jan', earnings: 85000, projects: 3 },
  { month: 'Feb', earnings: 125000, projects: 5 },
  { month: 'Mar', earnings: 98000, projects: 4 },
  { month: 'Apr', earnings: 156000, projects: 6 },
  { month: 'May', earnings: 112000, projects: 4 },
  { month: 'Jun', earnings: 189000, projects: 7 },
  { month: 'Jul', earnings: 145000, projects: 5 },
  { month: 'Aug', earnings: 168000, projects: 6 },
  { month: 'Sep', earnings: 142000, projects: 5 }
];

const projectStatusData = [
  { name: 'Completed', value: 65, count: 13, color: '#10B981' },
  { name: 'In Progress', value: 25, count: 5, color: '#F59E0B' },
  { name: 'Canceled', value: 10, count: 2, color: '#EF4444' }
];

const paymentMethodData = [
  { name: 'Stripe', value: 45, color: '#8B5CF6' },
  { name: 'PayPal', value: 35, color: '#06B6D4' },
  { name: 'Razorpay', value: 20, color: '#10B981' }
];

const ratingsOverTimeData = [
  { month: 'Jan', rating: 4.2 },
  { month: 'Feb', rating: 4.5 },
  { month: 'Mar', rating: 4.3 },
  { month: 'Apr', rating: 4.7 },
  { month: 'May', rating: 4.6 },
  { month: 'Jun', rating: 4.8 },
  { month: 'Jul', rating: 4.9 },
  { month: 'Aug', rating: 4.8 },
  { month: 'Sep', rating: 4.9 }
];

const AnalyticsSection = () => {
  const [timeRange, setTimeRange] = useState('3months');
  const [selectedMetric, setSelectedMetric] = useState('earnings');

  // Dynamic Calculations
  const analytics = useMemo(() => {
    const completedPayments = mockPayments.filter(p => p.status === 'completed');
    const completedProjects = mockProjects.filter(p => p.status === 'completed');
    const pendingPayments = mockPayments.filter(p => p.status === 'pending');
    const inProgressProjects = mockProjects.filter(p => p.status === 'in-progress');

    const totalEarnings = completedPayments.reduce((sum, p) => sum + p.netEarning, 0);
    const totalCommissionPaid = completedPayments.reduce((sum, p) => sum + p.platformFee, 0);
    const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.netEarning, 0);

    const ratingsAverage = completedPayments
      .filter(p => p.rating)
      .reduce((sum, p, _, arr) => sum + p.rating / arr.length, 0);

    const averageProjectValue = completedPayments.length > 0
      ? totalEarnings / completedPayments.length
      : 0;

    return {
      totalEarnings,
      completedProjectsCount: completedProjects.length,
      totalCommissionPaid,
      averageProjectValue,
      pendingAmount,
      ratingsAverage,
      inProgressCount: inProgressProjects.length,
      totalProjects: mockProjects.length
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
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      canceled: 'bg-red-500/20 text-red-400 border-red-500/30'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-lg p-3 rounded-lg border border-white/20 shadow-xl">
          <p className="text-white font-medium">{`${label}`}</p>
          {payload.map((pld, index) => (
            <p key={index} className="text-sm" style={{ color: pld.color }}>
              {`${pld.dataKey}: ${typeof pld.value === 'number' && pld.dataKey.includes('earnings') ? formatCurrency(pld.value) : pld.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-1000 via-purple-900 to-purple-900 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">Performance Analytics</h1>
            <p className="text-white/60 mt-2">Track your freelancing journey and optimize your earnings</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50"
            >
              <option value="1month" className="bg-gray-900">Last Month</option>
              <option value="3months" className="bg-gray-900">Last 3 Months</option>
              <option value="6months" className="bg-gray-900">Last 6 Months</option>
              <option value="1year" className="bg-gray-900">Last Year</option>
            </select>
            <button className="bg-purple-600/80 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700/80 transition-colors flex items-center space-x-2">
              <Download size={16} />
              <span>Export Report</span>
            </button>
          </div>
        </div>

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
                {formatCurrency(analytics.totalEarnings)}
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
                {formatCurrency(analytics.totalCommissionPaid)}
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
              <div className="text-yellow-400 text-sm font-medium">2 pending</div>
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
                  <XAxis dataKey="month" stroke="#ffffff60" />
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
                  <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
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
            <h3 className="text-xl font-bold text-white mb-6">Client Ratings Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ratingsOverTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="month" stroke="#ffffff60" />
                  <YAxis domain={[4, 5]} stroke="#ffffff60" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Recent Payments */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Recent Payments</h3>
              <button className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center space-x-1">
                <span>View All</span>
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {mockPayments.slice(0, 5).map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-500/20 p-2 rounded-lg">
                      <DollarSign className="text-green-400" size={16} />
                    </div>
                    <div>
                      <div className="text-white font-medium">{payment.client}</div>
                      <div className="text-white/60 text-sm">{payment.project}</div>
                      <div className="text-white/40 text-xs">{formatDate(payment.date)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{formatCurrency(payment.netEarning)}</div>
                    <div className="mb-2">{getStatusBadge(payment.status)}</div>
                    {payment.rating && (
                      <div className="text-yellow-400 text-sm">★ {payment.rating}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Project Overview</h3>
              <button className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center space-x-1">
                <span>Manage Projects</span>
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {mockProjects.slice(0, 5).map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                      <Briefcase className="text-blue-400" size={16} />
                    </div>
                    <div>
                      <div className="text-white font-medium">{project.title}</div>
                      <div className="text-white/60 text-sm">{project.client}</div>
                      <div className="text-white/40 text-xs">{project.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{formatCurrency(project.value)}</div>
                    <div className="mb-2">{getStatusBadge(project.status)}</div>
                    {project.rating && (
                      <div className="text-yellow-400 text-sm">★ {project.rating}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          <h3 className="text-xl font-bold text-white mb-6">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="text-green-400" size={24} />
              </div>
              <h4 className="text-white font-medium mb-2">Top Performer</h4>
              <p className="text-white/60 text-sm">You&apos;re in the top 15% of freelancers this month!</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="text-blue-400" size={24} />
              </div>
              <h4 className="text-white font-medium mb-2">Goal Progress</h4>
              <p className="text-white/60 text-sm">85% towards your monthly ₹2L target</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="text-purple-400" size={24} />
              </div>
              <h4 className="text-white font-medium mb-2">Client Retention</h4>
              <p className="text-white/60 text-sm">78% of clients return for more projects</p>
            </div>
            <div className="text-center">
              <div className="bg-cyan-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="text-cyan-400" size={24} />
              </div>
              <h4 className="text-white font-medium mb-2">Productivity</h4>
              <p className="text-white/60 text-sm">Average 2.5 projects completed per month</p>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-4 border border-purple-500/30">
              <h4 className="text-white font-medium mb-2">💡 Optimization Tip</h4>
              <p className="text-white/80 text-sm mb-3">Your highest-rated projects are in Web Development. Consider focusing more on this category to maximize earnings.</p>
              <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                View Category Analysis →
              </button>
            </div>
            <div className="bg-gradient-to-r from-green-600/20 to-cyan-600/20 rounded-xl p-4 border border-green-500/30">
              <h4 className="text-white font-medium mb-2">🎯 Action Required</h4>
              <p className="text-white/80 text-sm mb-3">You have 2 pending invoices totaling ₹66,500. Follow up with clients for faster payments.</p>
              <button className="text-green-400 hover:text-green-300 text-sm font-medium">
                Manage Invoices →
              </button>
            </div>
            <div className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 rounded-xl p-4 border border-orange-500/30">
              <h4 className="text-white font-medium mb-2">⭐ Achievement</h4>
              <p className="text-white/80 text-sm mb-3">Congratulations! You&apos;ve maintained a 4.9+ rating for 3 consecutive months.</p>
              <button className="text-orange-400 hover:text-orange-300 text-sm font-medium">
                Share Achievement →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;