import React, { useEffect, useState } from "react";
import {
  useUpdateOrderStatusMutation,
  usePickedOrdersMutation,
  useGetAvailableOrdersQuery,
} from "../redux/apiSlice";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function DeliveryManAvailableOrders() {
  const {
    data: orderData,
    isLoading,
    isError,
    refetch,
  } = useGetAvailableOrdersQuery();
  const [updateStatus] = useUpdateOrderStatusMutation();
  const [pickedOrders] = usePickedOrdersMutation();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (orderData) {
      setOrders(orderData);
    }
  }, [orderData]);

  const handlePickUp = async (orderId) => {
    try {
      const pick = await pickedOrders({ orderId: orderId });
      const updATED = await updateStatus({
        orderId: orderId,
        status: "Out for Delivery",
      }).unwrap();
      toast.success("Order picked successfully!");
      refetch();
    } catch (err) {
      toast.error("Failed to pick order!");
    }
  };

  if (isLoading) {
    return (
      <div className=" flex items-center justify-center">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <p className="text-center text-red-500 mt-10">Error loading orders</p>
    );
  }
  if (!orders?.length) {
    return (
      <p className="text-center text-gray-400 mt-10">No available orders</p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Available Orders</h2>
        <Link
          to={`/deliveryman/dashboard`}
          className="bg-primary text-white px-4 py-2 rounded">
          Go Dashboard
        </Link>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 border border-gray-300 rounded-2xl shadow-md bg-white">
            <div className="flex">
              <div className="w-1/2 pr-5">
                <div className="pb-3 border-b border-gray-300">
                  <h3 className="text-lg font-semibold">Order #{order._id}</h3>
                  <p className="font-bold">
                    Restaurant:{" "}
                    {order.restaurant?.name ? (
                      <span className="font-normal">
                        {order.restaurant?.name}
                      </span>
                    ) : (
                      ""
                    )}
                  </p>
                  <p className="font-bold">
                    User:{" "}
                    {order.user?.name ? (
                      <span className="font-normal">{order.user?.name}</span>
                    ) : (
                      ""
                    )}
                  </p>
                  <p className="font-bold">
                    Items:{" "}
                    {order.items?.length ? (
                      <span className="font-normal">{order.items?.length}</span>
                    ) : (
                      ""
                    )}
                  </p>
                </div>
                <div className="mt-5">
                  <div className="border-b border-gray-300 flex gap-x-2 flex-wrap">
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
              {order?.deliveryAddress && (
                <div className="w-1/2 pl-5 border-l border-gray-300">
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
            </div>

            <button
              onClick={() => handlePickUp(order._id)}
              className="mt-3 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition cursor-pointer">
              Mark as Picked
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
