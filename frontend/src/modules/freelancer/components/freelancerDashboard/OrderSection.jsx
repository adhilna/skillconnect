import React, { useState, useEffect, useContext } from 'react';
import { ShoppingCart, Filter, Search, RefreshCw, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../../../api/api';
import { AuthContext } from '../../../../context/AuthContext';
import OrderItem from './OrderItem';

const OrderSection = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/v1/gigs/service-orders/', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          ordering: '-created_at',
        },
      });
      console.log('Fetched Orders:', response.data);
      setOrders(Array.isArray(response.data) ? response.data : response.data.results || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!token) return;
    try {
      await api.patch(`/api/v1/gigs/service-orders/${orderId}/`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
      );
    } catch (err) {
      console.error('Failed to update order status:', err);
      setError('Failed to update order status. Please try again.');
    }
  };

  // Filter orders based on search and filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === '' ||
      order.service?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.client?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const acceptedOrders = filteredOrders.filter(o => o.status === 'accepted');
  const pendingOrders = filteredOrders.filter(o => o.status === 'pending');
  const rejectedOrders = filteredOrders.filter(o => o.status === 'rejected');

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      accepted: orders.filter(o => o.status === 'accepted').length,
      rejected: orders.filter(o => o.status === 'rejected').length
    };
  };

  const stats = getOrderStats();

  const renderOrderSection = (sectionOrders, title, titleColor, icon) => {
    if (sectionOrders.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex items-center mb-6">
          {icon}
          <h4 className={`${titleColor} text-xl font-bold ml-3`}>{title}</h4>
          <span className="ml-3 bg-white/10 text-white/70 px-2 py-1 rounded-full text-sm font-medium">
            {sectionOrders.length}
          </span>
        </div>
        <div className="grid gap-6">
          {sectionOrders.map(order => (
            <OrderItem
              key={order.id}
              title={order.service?.title ?? 'No Title'}
              client={order.client?.name ?? 'Unknown Client'}
              status={order.status}
              amount={order.service?.price ? `$${order.service.price}` : 'N/A'}
              deadline={order.service?.delivery_time ? `${order.service.delivery_time} days` : 'N/A'}
              message={order.message}
              createdAt={order.created_at}
              onAccept={order.status === 'pending' ? () => handleStatusChange(order.id, 'accepted') : null}
              onReject={order.status === 'pending' ? () => handleStatusChange(order.id, 'rejected') : null}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h3 className="text-3xl font-bold text-white mb-2">Order Management</h3>
            <p className="text-white/70">Track and manage all your client orders efficiently</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-xs text-white/60 uppercase tracking-wide">Total</div>
            </div>
            <div className="bg-amber-500/10 rounded-lg p-3 text-center border border-amber-400/20">
              <div className="text-2xl font-bold text-amber-400">{stats.pending}</div>
              <div className="text-xs text-amber-300/80 uppercase tracking-wide">Pending</div>
            </div>
            <div className="bg-emerald-500/10 rounded-lg p-3 text-center border border-emerald-400/20">
              <div className="text-2xl font-bold text-emerald-400">{stats.accepted}</div>
              <div className="text-xs text-emerald-300/80 uppercase tracking-wide">Accepted</div>
            </div>
            <div className="bg-red-500/10 rounded-lg p-3 text-center border border-red-400/20">
              <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
              <div className="text-xs text-red-300/80 uppercase tracking-wide">Rejected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search orders by title or client name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
          />
        </div>

        {/* Filter Dropdown */}
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all cursor-pointer"
        >
          <option value="all" className="bg-gray-800">All Orders</option>
          <option value="pending" className="bg-gray-800">Pending</option>
          <option value="accepted" className="bg-gray-800">Accepted</option>
          <option value="rejected" className="bg-gray-800">Rejected</option>
        </select>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-4">
          <div className="flex items-center">
            <AlertCircle size={20} className="text-red-400 mr-3" />
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white/70">Loading your orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
          <ShoppingCart size={64} className="text-white/20 mx-auto mb-6" />
          <h4 className="text-2xl font-bold text-white mb-3">
            {searchQuery || selectedFilter !== 'all' ? 'No matching orders found' : 'No orders yet'}
          </h4>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            {searchQuery || selectedFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Once clients start placing orders, they will appear here for you to manage'
            }
          </p>
          {(searchQuery || selectedFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pending Orders */}
          {renderOrderSection(
            pendingOrders,
            'Pending Orders',
            'text-amber-400',
            <Clock size={24} className="text-amber-400" />
          )}

          {/* Accepted Orders */}
          {renderOrderSection(
            acceptedOrders,
            'Accepted Orders',
            'text-emerald-400',
            <CheckCircle size={24} className="text-emerald-400" />
          )}

          {/* Rejected Orders */}
          {renderOrderSection(
            rejectedOrders,
            'Rejected Orders',
            'text-red-400',
            <AlertCircle size={24} className="text-red-400" />
          )}
        </div>
      )}
    </div>
  );
};

export default OrderSection;