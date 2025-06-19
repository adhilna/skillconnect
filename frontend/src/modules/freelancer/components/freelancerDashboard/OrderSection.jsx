import React from 'react';
import { ShoppingCart, Filter } from 'lucide-react';
import OrderItem from './OrderItem';

const OrderSection = ({ orders }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-bold text-white">Orders</h3>
      <div className="flex items-center space-x-2">
        <button className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center space-x-2">
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>
    </div>
    {orders && orders.length > 0 ? (
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
        <div className="space-y-4">
          {orders.map((order, index) => (
            <OrderItem
              key={index}
              title={order.title}
              client={order.client}
              status={order.status}
              amount={order.amount}
              deadline={order.deadline}
            />
          ))}
        </div>
      </div>
    ) : (
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
        <ShoppingCart size={48} className="text-white/30 mx-auto mb-4" />
        <h4 className="text-xl font-semibold text-white mb-2">Order Management</h4>
        <p className="text-white/70 mb-6">Track and manage all your client orders</p>
        <div className="text-white/50 text-sm">No orders found. Enhanced order management coming soon...</div>
      </div>
    )}
  </div>
);

export default OrderSection;
