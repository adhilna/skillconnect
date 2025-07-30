import React, { useState, useEffect, useContext, useRef } from 'react';
import api from '../../../../api/api';
import { AuthContext } from '../../../../context/AuthContext';
import OrderItem from './OrderItem';

const ClientProposalOrdersSection = ({ selectedOrderId, onSelectOrder }) => {
    const { token } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');

    const orderRefs = useRef({});

    // Pagination vars
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // const itemsPerPage = 10;

    useEffect(() => {
        if (selectedOrderId && orderRefs.current[selectedOrderId]) {
            orderRefs.current[selectedOrderId].scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Optionally highlight with CSS
        }
    }, [selectedOrderId]);

    // Fetch proposal orders from backend
    useEffect(() => {
        if (!token) return;

        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get('/api/v1/gigs/proposal-orders/', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        ordering: '-created_at',
                        page: currentPage,
                    },
                });
                console.log('API response data:', response.data);
                console.log('orders state:', orders);
                console.log('filteredOrders:', filteredOrders);
                setOrders(response.data || []);
                // setTotalPages(Math.ceil(response.data.count / itemsPerPage));
            } catch (err) {
                console.error('Failed to fetch proposal orders:', err);
                setError('Failed to load proposal orders.');
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
                `/api/v1/gigs/proposal-orders/${orderId}/`,
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

    const handleCancel = async (orderId) => {
        if (!token) return;
        try {
            await api.patch(
                `/api/v1/gigs/proposal-orders/${orderId}/`,
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

    const handleMessage = (order) => {
        // Implement message functionality or navigation to chat etc.
        console.log('Message freelancer:', order.freelancer);
    };

    // Sort orders pending > accepted > cancelled > rejected
    const sortedOrders = [...orders].sort((a, b) => {
        const statusOrder = { pending: 0, accepted: 1, cancelled: 2, rejected: 3 };
        return (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
    });

    // Filter Orders
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

    return (
        <div className="space-y-6">
            {/* Header and Filter */}
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Proposal Orders</h3>
                <div className="relative">
                    <button
                        onClick={() => setActiveFilter(activeFilter === 'all' ? 'pending' : 'all')}
                        className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors"
                    >
                        Filter: {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
                    </button>
                </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-2">
                {filterOptions.map(({ value, label, count }) => (
                    <button
                        key={value}
                        onClick={() => setActiveFilter(value)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${activeFilter === value ? 'bg-blue-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                    >
                        {label} ({count})
                    </button>
                ))}
            </div>

            {/* Loading / Error / No orders */}
            {loading ? (
                <div className="py-10 text-center text-white">Loading orders...</div>
            ) : error ? (
                <div className="py-10 text-center text-red-500">{error}</div>
            ) : filteredOrders.length > 0 ? (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            ref={el => orderRefs.current[order.id] = el}
                            className={`${order.id === selectedOrderId ? 'ring-2 ring-blue-500 rounded-lg' : ''}`} // example highlight
                            onClick={() => onSelectOrder && onSelectOrder(order.id)}
                        >
                            <OrderItem
                                key={order.id}
                                proposalTitle={order.proposal?.title ?? 'No Title'}
                                freelancerName={order.freelancer?.name ?? 'Unknown Freelancer'}
                                status={order.status}
                                amountRange={
                                    order.proposal
                                        ? `$${order.proposal.budget_min} - $${order.proposal.budget_max}`
                                        : 'N/A'
                                }
                                timelineDays={order.proposal?.timeline_days ?? 'N/A'}
                                message={order.message}
                                createdAt={order.created_at}
                                onAccept={() => handleStatusChange(order.id, 'accepted')}
                                onReject={() => handleStatusChange(order.id, 'rejected')}
                                onCancel={() => handleCancel(order.id)}
                                onMessage={() => handleMessage(order)}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
                    <p className="text-white/60">No proposal orders found.</p>
                </div>
            )}

            {/* TODO: Add Pagination Controls Here if needed */}
        </div>
    );
};

export default ClientProposalOrdersSection;
