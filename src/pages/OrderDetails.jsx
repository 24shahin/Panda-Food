import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetSelectedOrdersQuery } from "../redux/apiSlice";

const OrderDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useGetSelectedOrdersQuery({ id });
  const [order, setOrder] = useState();
  useEffect(() => {
    if (data) {
      setOrder(data[0]);
    }
  }, [data]);

  if (isLoading) {
    return (
      <p className="text-center py-6 text-primary">Loading order details...</p>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 py-6">
        Failed to load order:{" "}
        {error?.data?.message || error?.error || "Unknown error"}
      </p>
    );
  }

  if (!order) {
    return <p className="text-center py-6">No order found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>

      {/* Order Info */}
      <div className="bg-white dark:bg-gray-700 shadow rounded p-4 mb-6">
        <p>
          <strong>Order ID:</strong> {order?._id}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`${
              order.status == "Cancelled"
                ? "text-red-400"
                : order.status == "Delivered"
                ? "text-green-400"
                : ""
            }`}>
            {order.status}
          </span>
        </p>
        <p>
          <strong>Total Price:</strong> ৳ {order.totalPrice}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>
      {/* Items */}
      <div className="bg-white dark:bg-gray-700 shadow rounded p-4 mb-6">
        <h2 className="font-semibold text-lg mb-2 border-b border-gray-300 pb-2">
          Items
        </h2>
        {order?.items?.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {order.items.map((item) => (
              <li
                key={item._id}
                className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {item.menuItem.image && (
                    <img
                      src={item?.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium">{item.menuItem.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × ৳ {item.menuItem.price}
                    </p>
                  </div>
                </div>
                <p className="font-semibold">
                  ৳ {(item.menuItem.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No items in this order.</p>
        )}
      </div>
      {/* Address */}
      <div className="bg-white dark:bg-gray-700 shadow rounded p-5  flex justify-between">
        {order?.deliveryAddress && (
          <div className="w-1/2 pr-5 border-r border-gray-300">
            <div>
              <h2 className="font-semibold text-lg mb-2 border-b pb-2 border-gray-300">
                Delivery Address
              </h2>
              <p className="font-bold">
                Street:{" "}
                {order.deliveryAddress?.street ? (
                  <span className="font-normal">
                    {order.deliveryAddress?.street}
                  </span>
                ) : (
                  ""
                )}
              </p>
              <p className="font-bold">
                Apartment:{" "}
                {order.deliveryAddress?.apartment ? (
                  <span className="font-normal">
                    {order.deliveryAddress?.apartment}
                  </span>
                ) : (
                  ""
                )}
              </p>
              <p className="font-bold">
                city:{" "}
                {order.deliveryAddress?.city ? (
                  <span className="font-normal">
                    {order.deliveryAddress?.city}
                  </span>
                ) : (
                  ""
                )}
              </p>
              <p className="font-bold">
                state:{" "}
                {order.deliveryAddress?.state ? (
                  <span className="font-normal">
                    {order.deliveryAddress?.state}
                  </span>
                ) : (
                  ""
                )}
              </p>
              <p className="font-bold">
                zip Code:{" "}
                {order.deliveryAddress?.zipCode ? (
                  <span className="font-normal">
                    {order.deliveryAddress?.zipCode}
                  </span>
                ) : (
                  ""
                )}
              </p>
              <p className="font-bold">
                country:{" "}
                {order.deliveryAddress?.country ? (
                  <span className="font-normal">
                    {order.deliveryAddress?.country}
                  </span>
                ) : (
                  <span className="font-normal">Bangladesh</span>
                )}
              </p>
              <p className="font-bold">
                Delivery Instructions:{" "}
                {order.deliveryAddress?.deliveryInstructions ? (
                  <span className="font-normal">
                    {order.deliveryAddress?.deliveryInstructions}
                  </span>
                ) : (
                  <span className="font-normal">{""}</span>
                )}
              </p>
              <p className="font-bold">
                Mobile Number:{" "}
                {order.deliveryAddress?.mobileNumber ? (
                  <span className="font-normal">
                    {order.deliveryAddress?.mobileNumber}
                  </span>
                ) : (
                  <span className="font-normal">{""}</span>
                )}
              </p>
            </div>
          </div>
        )}
        {order?.restaurant && (
          <div className="w-1/2 pl-5">
            <div>
              <h2 className="font-semibold text-lg mb-2 border-b pb-2 border-gray-300">
                Restaurant Details
              </h2>
              <p className="font-bold">
                Restaurant Name:{" "}
                {order?.restaurant.name ? (
                  <span className="font-normal">{order?.restaurant.name}</span>
                ) : (
                  ""
                )}
              </p>
              <p className="font-bold">
                Restaurant Location:{" "}
                {order?.restaurant.location ? (
                  <span className="font-normal">
                    {order?.restaurant.location}
                  </span>
                ) : (
                  ""
                )}
              </p>
              <p className="font-bold">
                Restaurant Email:{" "}
                {order?.restaurant.email ? (
                  <span className="font-normal">{order?.restaurant.email}</span>
                ) : (
                  ""
                )}
              </p>
              <p className="font-bold">
                Restaurant Contact Number:{" "}
                {order?.restaurant.contactNumber ? (
                  <span className="font-normal">
                    {order?.restaurant.contactNumber}
                  </span>
                ) : (
                  ""
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
