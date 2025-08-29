import React from "react";
import moment from "moment";
import { useGetUserOrdersQuery } from "../redux/apiSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function UserAllOrders() {
  const { data: ordersSummary, isLoading, isError } = useGetUserOrdersQuery();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-4 text-center text-primary">
        Loading orders...
      </div>
    );
  }

  if (isError || !ordersSummary) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-4 text-center text-red-500">
        Failed to load orders.
      </div>
    );
  }

  const sortedOrders = [...ordersSummary].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>

      {sortedOrders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {sortedOrders.map((order, index) => (
            <motion.div
              key={order._id}
              className="border border-gray-400 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}>
              {/* Order Header */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">
                  {moment(order.createdAt).format("MMMM D, YYYY h:mm A")}
                </p>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-secondary">
                    Order ID: #{order._id}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-600"
                        : order.status === "Expired"
                        ? "bg-gray-200 text-gray-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center border-gray-400 border-b pb-2">
                    <div className="flex gap-3 items-center">
                      <img
                        src={item.menuItem?.image}
                        alt={item.menuItem?.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item?.name}</p>
                        <p className="text-xs text-gray-500">
                          {order?.restaurant?.name} • Qty: {item?.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold">
                      Unite per price: $
                      {Number(item?.menuItem?.price).toFixed(2)}
                    </p>
                    <p>
                      Subtotal: $
                      {(
                        Number(item?.quantity) * Number(item?.menuItem?.price)
                      ).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  Delivery Fee:{" "}
                  {order.deliveryFee === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    `$${Number(order?.deliveryFee).toFixed(2)}`
                  )}
                </p>
                <p className="text-lg font-bold text-black dark:text-white mt-1">
                  Total: ${Number(order?.totalPrice).toFixed(2)}
                </p>
              </div>

              <Link
                to={`/orders/${order._id}`}
                className="text-blue-600 underline text-sm mt-3 inline-block">
                View Details
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserAllOrders;
