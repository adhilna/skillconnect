import React, { useState, useEffect, useContext, useRef } from 'react';
import { ShoppingCart, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../../../api/api'; // adjust this path as needed
import { AuthContext } from '../../../../context/AuthContext';
import OrderItem from './OrderItem';


const OrderSection = ({ selectedOrderId, onSelectOrder, onStartChat }) => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(totalOrdersCount / itemsPerPage);

  const orderRefs = useRef({});

  useEffect(() => {
    if (!token) return;

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
        // console.log('Fetched Orders:', response.data);
        setOrders(
          Array.isArray(response.data)
            ? response.data
            : response.data.results || []
        );
        setTotalOrdersCount(response.data.count || 0);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, currentPage]);

  const handleStatusChange = async (orderId, newStatus) => {
    if (!token) return;
    try {
      await api.patch(
        `/api/v1/gigs/service-orders/${orderId}/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert('Failed to update order status.', err);
    }
  };

  // New cancellation handler
  const handleCancel = async (orderId) => {
    if (!token) return;
    try {
      await api.patch(
        `/api/v1/gigs/service-orders/${orderId}/`,
        { status: 'cancelled' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o))
      );
    } catch (err) {
      alert('Failed to cancel the order.', err);
    }
  };

  const handleMessageClick = async (orderType, orderId) => {
    if (!token) {
      alert("You need to login to chat.");
      return;
    }

    try {
      const response = await api.post(
        '/api/v1/messaging/conversations/',
        { order_type: orderType, order_id: orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const conversationId = response.data.id;
      if (onStartChat) {
        onStartChat(conversationId);  // Tell dashboard to open chat UI in messages section
      } else {
        alert('Chat handler not found.');
      }
    } catch (error) {
      console.error("Failed to open chat:", error.response?.data || error.message);
      alert("Failed to open chat. Please try again later.");
    }
  };

  useEffect(() => {
    if (selectedOrderId && orderRefs.current[selectedOrderId]) {
      orderRefs.current[selectedOrderId].scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Optionally: you can highlight visually by adding a CSS class
    }
  }, [selectedOrderId]);

  // Sort orders: pending first, then accepted, then cancelled, then rejected
  const sortedOrders = [...orders].sort((a, b) => {
    const statusOrder = { pending: 0, accepted: 1, cancelled: 2, rejected: 3 };
    return (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
  });

  // Filter orders based on active filter
  const filteredOrders =
    activeFilter === 'all'
      ? sortedOrders
      : sortedOrders.filter((order) => order.status === activeFilter);

  const filterOptions = [
    { value: 'all', label: 'All Orders', count: orders.length },
    {
      value: 'pending',
      label: 'Pending',
      count: orders.filter((o) => o.status === 'pending').length,
    },
    {
      value: 'accepted',
      label: 'Accepted',
      count: orders.filter((o) => o.status === 'accepted').length,
    },
    {
      value: 'cancelled',
      label: 'Cancelled',
      count: orders.filter((o) => o.status === 'cancelled').length,
    },
    {
      value: 'rejected',
      label: 'Rejected',
      count: orders.filter((o) => o.status === 'rejected').length,
    },
  ];

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Orders</h3>
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center space-x-2"
          >
            <Filter size={16} />
            <span>Filter</span>
          </button>

          {/* Filter Dropdown */}
          {showFilters && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-lg rounded-xl border border-white/10 shadow-xl z-10">
              <div className="p-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setActiveFilter(option.value);
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${activeFilter === option.value
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    <span>{option.label}</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      {option.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Display */}
      {activeFilter !== 'all' && (
        <div className="flex items-center space-x-2">
          <span className="text-white/60 text-sm">Showing:</span>
          <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full">
            <span className="text-white text-sm capitalize">
              {activeFilter} Orders
            </span>
            <button
              onClick={() => setActiveFilter('all')}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Loading/Error */}
      {loading ? (
        <div className="py-10 text-center text-white">Loading orders...</div>
      ) : error ? (
        <div className="py-10 text-center text-red-500">{error}</div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              ref={(el) => { orderRefs.current[order.id] = el; }}
              className={`${order.id === selectedOrderId ? 'ring-2 ring-purple-500 rounded-lg' : ''}`}
              onClick={() => onSelectOrder && onSelectOrder(order.id)}
            >
              <OrderItem
                key={order.id}
                title={order.service?.title ?? 'No Title'}
                client={order.client?.name ?? 'Unknown Client'}
                status={order.status}
                amount={order.service?.price ? `$${order.service.price}` : 'N/A'}
                deadline={
                  order.service?.delivery_time
                    ? `${order.service.delivery_time} days`
                    : 'N/A'
                }
                message={order.message}
                createdAt={order.created_at}
                onAccept={() => handleStatusChange(order.id, 'accepted')}
                onReject={() => handleStatusChange(order.id, 'rejected')}
                onCancel={() => handleCancel(order.id)}
                orderType="serviceorder"
                orderId={order.id}
                onMessageClick={handleMessageClick}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
          <ShoppingCart
            size={48}
            className="text-white/30 mx-auto mb-4"
          />
          <h4 className="text-xl font-semibold text-white mb-2">
            Order Management
          </h4>
          <p className="text-white/70 mb-6">Track and manage all your client orders</p>
          <div className="text-white/50 text-sm">
            {activeFilter === 'all'
              ? 'No orders found.'
              : `No ${activeFilter} orders found.`}
          </div>
        </div>
      )}

      {/* Click outside to close filter */}
      {showFilters && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowFilters(false)}
        />
      )}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-8 flex-wrap">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50 hover:bg-white/20 transition-all"
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
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
                onClick={() => handlePageChange(pageNum)}
                className={`px-4 py-2 rounded-lg transition-all ${pageNum === currentPage
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-white bg-white/10 hover:bg-white/20'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50 hover:bg-white/20 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSection;
