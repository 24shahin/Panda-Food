import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { LuRefreshCcwDot } from "react-icons/lu";
import {
  useGetDeliveryManOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../redux/apiSlice";
import { Link } from "react-router-dom";
import moment from "moment";

export default function DeliveryManDashboard() {
  const deliveryManInfo = useSelector(
    (state) => state?.deliveryManAuth?.deliveryman
  );

  const {
    data: orders,
    isLoading,
    refetch,
  } = useGetDeliveryManOrdersQuery(deliveryManInfo?._id);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [pickedOrders, setPickedOrders] = useState([]);
  useEffect(() => {
    if (orders) {
      setPickedOrders(orders);
    }
  }, [orders]);
  if (!deliveryManInfo) {
    return (
      <p className="text-center text-red-500">Please login as delivery man.</p>
    );
  }

  if (isLoading) {
    return <p className="text-center">Loading orders...</p>;
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      toast.success(`Order marked as ${newStatus}`);
      refetch();
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">📦 My Assigned Orders</h1>

      <div className="flex gap-x-4">
        <button
          onClick={refetch}
          className="flex gap-x-2 items-center mb-4 px-4 py-2 bg-orange-300 text-black rounded hover:bg-orange-200 cursor-pointer">
          <LuRefreshCcwDot /> Refresh Orders
        </button>
        <Link
          to={"/deliveryman/available"}
          className="mb-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/70 cursor-pointer">
          See available Orders
        </Link>
      </div>

      {pickedOrders?.length === 0 ? (
        <p>No assigned orders yet.</p>
      ) : (
        <div className="space-y-4">
          {pickedOrders?.map((order) => (
            <div
              key={order._id}
              className="border border-gray-300 rounded-md p-4 shadow ">
              <div className="flex w-full">
                <div className="w-1/4">
                  <h2 className="font-semibold text-lg mb-2 border-b pb-2 border-gray-300 mr-5">
                    Order Details
                  </h2>
                  <p className="font-semibold">Order ID: {order._id}</p>
                  <p className="font-bold">
                    Customer:{" "}
                    <span className="font-normal">{order.user?.name}</span>
                  </p>
                  <p className="font-bold mt-2">
                    Time:{" "}
                    <span className="font-normal">
                      {moment(order.createdAt).format("MMMM D, YYYY h:mm A")}
                    </span>
                  </p>
                  <p className="font-bold mt-2">
                    Status:{" "}
                    <span className="font-normal border-gray-400 border rounded p-1">
                      {order.status}
                    </span>
                  </p>
                </div>
                <div className="w-1/4 px-5 border-x border-gray-300">
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
                <div className="w-2/4  pl-5">
                  <h2 className="font-semibold text-lg mb-2 border-b pb-2 border-gray-300 mr-5">
                    Product Details
                  </h2>
                  <div className="flex gap-x-2 flex-wrap">
                    {order?.items.length &&
                      order?.items.map((item) => (
                        <div key={item?.menuItem?._id}>
                          <div className="w-28 rounded overflow-hidden ">
                            <img
                              src={item?.menuItem?.image}
                              alt=""
                              className="w-full h-20 object-cover hover:scale-125 transition-all ease-linear"
                            />
                          </div>
                          <p className="font-bold mt-2">
                            Price:{" "}
                            {item?.menuItem?.price ? (
                              <span className="font-normal">
                                {item?.menuItem?.price}
                              </span>
                            ) : (
                              ""
                            )}
                          </p>
                          <p className="font-bold mb-2">
                            Quantity:{" "}
                            {item?.quantity ? (
                              <span className="font-normal">
                                {item?.quantity}
                              </span>
                            ) : (
                              ""
                            )}
                          </p>
                        </div>
                      ))}
                  </div>
                  <div>
                    <p className="font-bold">
                      Delivery Fee:{" "}
                      <span className="font-normal">{order.deliveryFee}</span>
                    </p>
                    <p className="font-bold">
                      Total:{" "}
                      {order?.totalPrice ? (
                        <span className="font-normal">{order?.totalPrice}</span>
                      ) : (
                        ""
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="">
                {order.status === "Out for Delivery" && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, "Delivered")}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
