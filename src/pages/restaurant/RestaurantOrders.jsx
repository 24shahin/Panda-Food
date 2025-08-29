// src/pages/restaurant/RestaurantOrders.jsx
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Loader2, Clock, CheckCircle, Truck } from "lucide-react";
import moment from "moment";
import toast from "react-hot-toast";
import {
  useRestaurantOverViewQuery,
  useOrderStatusMutation,
  useDeleteOrderItemMutation,
} from "../../redux/apiSlice";

export default function RestaurantOrders() {
  const purpuse = "orders";
  const { data, isLoading, isError, error, refetch } =
    useRestaurantOverViewQuery(purpuse, {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
      pollingInterval: 0, // remove old polling
    });

  const [restaurantOrder, setRestaurantOrder] = useState([]);
  const [updateOrderStatus, { isLoading: updating }] = useOrderStatusMutation();
  const [deleteOrderItem] = useDeleteOrderItemMutation();

  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  useEffect(() => {
    if (data) {
      setRestaurantOrder(Array.isArray(data) ? data : []);
    }
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3000); // lightweight refresh
    return () => clearInterval(interval);
  }, [refetch]);

  const filteredOrders = useMemo(() => {
    let result = [...restaurantOrder];

    if (filter !== "All") {
      result = result.filter((o) => o.status === filter);
    }

    switch (sortBy) {
      case "Newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "Oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "Price High":
        result.sort((a, b) => b.totalPrice - a.totalPrice);
        break;
      case "Price Low":
        result.sort((a, b) => a.totalPrice - b.totalPrice);
        break;
      default:
        break;
    }
    return result;
  }, [restaurantOrder, filter, sortBy]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 py-6">
        Failed to load your Restaurant Orders:{" "}
        {error?.data?.message || error?.error || "Unknown error"}
      </p>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "Preparing":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case "Out for Delivery":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "Delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ orderId, newStatus }).unwrap();
      toast.success(`Order updated to "${newStatus}"`);
      refetch();
    } catch (e) {
      toast.error(
        e?.data?.message || e?.error || "Failed to update order status"
      );
    }
  };

  const handleDeleteOrder = async (id) => {
    await deleteOrderItem({ id });
    toast.success(`Order successfully Deleted #Id:"${id}"`);
    refetch();
  };

  const STATUS_OPTIONS = [
    "Pending",
    "Preparing",
    "Prepared for Delivery",
    "Cancelled",
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Orders</h1>

      {/* Filter + Sort Controls */}
      <div className="flex items-center gap-4 mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg shadow-sm bg-white dark:bg-gray-800">
          <option value="All">All</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-2 rounded-lg shadow-sm bg-white dark:bg-gray-800">
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
          <option value="Price High">Price High → Low</option>
          <option value="Price Low">Price Low → High</option>
        </select>
      </div>

      {filteredOrders.map((order) => (
        <motion.div
          key={order._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl shadow-md bg-white dark:bg-gray-800">
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">Order #{order._id}</div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(order.status)}
              <span className="text-sm">{order.status}</span>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {moment(order.createdAt).format("MMM D, YYYY h:mm A")}
          </div>

          <ul className="space-y-1 mb-2">
            {order.items.map((item) => (
              <li
                key={item._id}
                className="flex justify-between text-sm border-b last:border-none py-1 items-center">
                <div className="w-32 overflow-hidden rounded-sm">
                  <img
                    src={item?.menuItem?.image}
                    alt={item?.menuItem?.name}
                    className="w-full hover:scale-125 transition-all duration-200 ease-linear"
                  />
                </div>
                <span>
                  {item.menuItem?.name} || <strong>quantity:</strong>{" "}
                  {item.quantity}
                </span>
                <span>Per Unit: ${item.menuItem?.price}</span>
                <span>${item.menuItem?.price * item.quantity}</span>
              </li>
            ))}
          </ul>

          <div className="flex justify-between font-semibold mt-2">
            <span>Total</span>
            <span>${order.totalPrice}</span>
          </div>

          <div className="text-sm mt-2">
            <span className="font-medium">Customer:</span>{" "}
            <strong>{order.user?.name}</strong>
          </div>

          {/* Delivery Address */}
          {order?.deliveryAddress && (
            <div className="mt-3">
              <h2 className="font-semibold text-lg mb-2 border-b pb-2 border-gray-300">
                Delivery Address
              </h2>
              <p>
                <strong>Street:</strong> {order?.deliveryAddress?.street}
              </p>
              <p>
                <strong>Apartment:</strong> {order?.deliveryAddress?.apartment}
              </p>
              <p>
                <strong>City:</strong> {order?.deliveryAddress?.city}
              </p>
              <p>
                <strong>State:</strong> {order?.deliveryAddress?.state}
              </p>
              <p>
                <strong>Zip Code:</strong> {order?.deliveryAddress?.zipCode}
              </p>
              <p>
                <strong>Country:</strong>{" "}
                {order?.deliveryAddress?.country || "Bangladesh"}
              </p>
              <p>
                <strong>Instructions:</strong>{" "}
                {order?.deliveryAddress?.deliveryInstructions}
              </p>
              <p>
                <strong>Mobile:</strong> {order?.deliveryAddress?.mobileNumber}
              </p>
            </div>
          )}

          {/* Status Control + Accept Button */}
          <div className="mt-4 flex items-center justify-between">
            {order.status === "Out for Delivery" ? (
              <p className="font-bold">Order is Out for Delivery</p>
            ) : order.status === "Delivered" ? (
              <p className="font-bold">Order is Deliveried</p>
            ) : (
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Update Status:</label>
                <select
                  className="border px-2 py-1 rounded text-sm bg-white dark:bg-gray-700 cursor-pointer"
                  value={order.status}
                  disabled={updating}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} className="!cursor-pointer">
                      {s}
                    </option>
                  ))}
                </select>

                {updating && (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                )}

                {order.status === "Pending" && (
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm cursor-pointer"
                    onClick={() => handleStatusChange(order._id, "Preparing")}>
                    Accept
                  </button>
                )}
              </div>
            )}

            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 cursor-pointer"
              onClick={() => handleDeleteOrder(order._id)}>
              Delete Order
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
