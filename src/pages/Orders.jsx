import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { updateOrderStatus } from "../redux/ordersSlice";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useOrderStatusMutation } from "../redux/apiSlice";

export default function Orders() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.list);
  const [OrderStatus] = useOrderStatusMutation();
  const handleCancelOrder = async (orderId) => {
    const status = await OrderStatus({
      orderId: orderId,
      newStatus: "Cancelled",
    });
    dispatch(updateOrderStatus({ orderId, newStatus: "Cancelled" }));
    toast.success("Order cancelled");
  };

  const [expiredIds, setExpiredIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRemainingTime = (createdAt) => {
    const maxCancelMinutes = 10;
    const diff = moment(createdAt)
      .add(maxCancelMinutes, "minutes")
      .diff(moment(), "seconds");
    return diff > 0 ? diff : 0;
  };

  const [timers, setTimers] = useState({});
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = {};
      orders.forEach((order) => {
        if (order.status === "Pending") {
          const remaining = getRemainingTime(order.createdAt);
          newTimers[order.id] = remaining;

          if (remaining <= 0 && !expiredIds.includes(order.id)) {
            dispatch(
              updateOrderStatus({
                orderId: order.id,
                newStatus: "Expired for order cancel",
              })
            );
            setExpiredIds((prev) => [...prev, order.id]);
            toast.error(`Order #${order?.id} can no longer be cancelled.`);
          }
        }
      });
      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [orders, expiredIds, dispatch]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <Link
          className="bg-primary/70 px-3 py-2 rounded cursor-pointer hover:bg-primary/40"
          to={"/userallorders"}>
          See All Orders
        </Link>
      </div>

      {loading ? (
        <div className="mt-4 text-center">
          <h1 className="text-primary text-base">Loading . . .</h1>
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders
            .slice()
            .sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt))
            .slice(0, 2)
            .map((order) => (
              <div
                key={order.id}
                className="border border-gray-400 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500">
                    {moment(order.createdAt).format("MMMM D, YYYY h:mm A")}
                  </p>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-secondary">
                      Order ID: #{order.id}
                    </p>
                    <div className="flex items-center gap-2">
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

                      {order.status === "Pending" && timers[order.id] > 0 && (
                        <span className="text-xs text-gray-500">
                          {Math.floor(timers[order.id] / 60)
                            .toString()
                            .padStart(2, "0")}
                          :{(timers[order.id] % 60).toString().padStart(2, "0")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center border-b pb-2">
                      <div className="flex gap-3 items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">
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

                {/* Summary */}
                <div className="flex items-center gap-x-10">
                  <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
                    <p>
                      Delivery Fee:{" "}
                      {order.deliveryFee === 0 ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        `$${order.deliveryFee.toFixed(2)}`
                      )}
                    </p>
                    <p className="text-lg font-bold text-black dark:text-white mt-1">
                      Total: ${order.total.toFixed(2)}
                    </p>
                  </div>
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-blue-600 underline text-sm">
                    View Details
                  </Link>
                </div>

                {/* ✅ Delivery Address */}
                {order.address && (
                  <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-4 rounded">
                    <p className="font-semibold mb-1 underline text-base">
                      Delivery Address
                    </p>
                    <p>
                      <strong>Street:</strong> {order.address.street}
                    </p>
                    <p>
                      <strong>City:</strong> {order.address.city} |{" "}
                      <strong>State:</strong> {order.address.state}
                    </p>
                    <p>
                      <strong>Zip Code:</strong> {order.address.zipCode}
                    </p>
                    <p>
                      <strong>Apartment:</strong> {order.address.apartment}
                    </p>
                    <p>
                      <strong>Mobile:</strong> {order.address.mobileNumber}
                    </p>
                    <p>
                      <strong>Instructions:</strong>{" "}
                      {order.address.deliveryInstructions}
                    </p>
                  </div>
                )}

                {/* Cancel Button */}
                {order.status === "Pending" && (
                  <>
                    {timers[order.id] > 0 ? (
                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-4 py-2 cursor-pointer text-sm text-white bg-red-500 rounded hover:bg-red-600 transition">
                          Cancel Order
                        </button>
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-red-500">
                        You can't cancel your orders after 10 minute
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
