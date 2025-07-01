// src/pages/OrderDetails.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const orders = useSelector((state) => state.orders.list);
  const order = orders.find((o) => o.id === Number(id));

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-500">Order Not Found</h1>
        <button
          onClick={() => navigate("/orders")}
          className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order #{order.id}</h1>

      <p className="text-gray-500 mb-2">
        Placed on: {moment(order.createdAt).format("MMMM D, YYYY h:mm A")}
      </p>

      <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
        <h2 className="text-lg font-semibold mb-2">Delivery Address</h2>
        <p>
          {order.address.street}, Apt {order.address.apartment}
        </p>
        <p>
          {order.address.city}, {order.address.state} - {order.address.zipCode}
        </p>
        <p>Mobile: {order.address.mobileNumber}</p>
        <p className="italic text-sm mt-1">
          {order.address.deliveryInstructions}
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {order.items.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center border-b pb-2">
            <div className="flex gap-3 items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 object-cover rounded"
              />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.restaurantName} • Qty: {item.quantity}
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold">
              ${(item.quantity * item.price).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded shadow-sm">
        <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
        <p>
          Delivery Fee:{" "}
          {order.deliveryFee === 0 ? (
            <span className="text-green-600 font-medium">Free</span>
          ) : (
            `$${order.deliveryFee.toFixed(2)}`
          )}
        </p>
        <p className="text-lg font-bold mt-2">
          Total: ${order.total.toFixed(2)}
        </p>
      </div>

      <div className="mt-6">
        <span
          className={`text-sm px-3 py-1 rounded-full font-medium ${
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
          Status: {order.status}
        </span>
      </div>
    </div>
  );
}
