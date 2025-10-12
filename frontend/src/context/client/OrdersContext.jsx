// OrdersContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../api/api";
import { AuthContext } from "../AuthContext";

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      setLoadingOrders(true);
      setOrdersError(null);
      try {
        const response = await api.get("/api/v1/gigs/proposal-orders/", {
          headers: { Authorization: `Bearer ${token}` },
          params: { ordering: "-created_at", page: currentPage },
        });
        setOrders(response.data.results || []);
        setTotalOrdersCount(response.data.count || 0);
      } catch (err) {
        console.error("Failed to fetch proposal orders:", err);
        setOrdersError("Failed to load proposal orders.");
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [token, currentPage]);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loadingOrders,
        ordersError,
        currentPage,
        setCurrentPage,
        totalOrdersCount,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
