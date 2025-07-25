// pages/restaurant/Orders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await axios.get("/api/orders/restaurant");
    setOrders(res.data);
  };

  const handleStatusChange = async (id, status) => {
    await axios.put(`/api/orders/${id}/status`, { status });
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">📦 Restaurant Orders</h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h4 className="font-semibold">Order #{order._id}</h4>
            <p className="text-sm text-gray-600 mb-2">Status: {order.status}</p>

            <div className="flex gap-2 flex-wrap mb-2">
              {["Pending", "Preparing", "Out for Delivery", "Delivered"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(order._id, status)}
                    className={`px-3 py-1 rounded text-sm ${
                      order.status === status
                        ? "bg-green-600 text-white"
                        : "bg-gray-200"
                    }`}>
                    {status}
                  </button>
                )
              )}
            </div>

            <ul className="text-sm text-gray-500">
              {order.items.map((item) => (
                <li key={item._id}>
                  🍽 {item.menuItem?.name || "Unknown"} x {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
