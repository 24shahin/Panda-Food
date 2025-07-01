import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateOrderStatus } from "../redux/ordersSlice";
import moment from "moment";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.list);

  const handleMarkDelivered = (orderId) => {
    dispatch(updateOrderStatus({ orderId, newStatus: "Delivered" }));
    toast.success(`Order #${orderId} marked as Delivered`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Admin - All Orders
      </h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border p-4 rounded-md shadow bg-white dark:bg-gray-800">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">
                  {moment(order.createdAt).format("MMMM D, YYYY h:mm A")}
                </p>
                <p className="font-semibold text-secondary">
                  Order #{order.id}
                </p>
              </div>

              <div className="text-sm mb-2">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center border-b py-2">
                    <div>
                      <p>
                        {item.name} x {item.quantity}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.restaurantName}
                      </p>
                    </div>
                    <p>${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
                <p>Delivery Fee: ${order.deliveryFee.toFixed(2)}</p>
                <p className="font-bold text-black dark:text-white">
                  Total: ${order.total.toFixed(2)}
                </p>
              </div>

              {/* Delivery Address */}
              {order.address && (
                <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-3 rounded">
                  <p className="font-semibold underline mb-1">
                    Delivery Address
                  </p>
                  <p>
                    {order.address.street}, {order.address.city},{" "}
                    {order.address.state} {order.address.zipCode}
                  </p>
                  <p>Mobile: {order.address.mobileNumber}</p>
                  <p>Instructions: {order.address.deliveryInstructions}</p>
                </div>
              )}

              {/* Admin Action */}
              <div className="mt-4">
                {order.status !== "Delivered" ? (
                  <button
                    onClick={() => handleMarkDelivered(order.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Mark as Delivered
                  </button>
                ) : (
                  <p className="text-green-600 font-semibold">Delivered</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
