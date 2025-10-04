import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { clearSelected } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { addOrder } from "../redux/ordersSlice";
import {
  useGetuserdeliveryaddressQuery,
  useUserOrderMutation,
} from "../redux/apiSlice";
import { Watch } from "react-loader-spinner";

export default function Checkout() {
  const hasRedirected = useRef(false);
  const { data: userAddress, isLoading } = useGetuserdeliveryaddressQuery();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userOrder] = useUserOrderMutation();
  const { items, selectedIds } = useSelector((state) => state.cart);
  const userAddressFromSlice = useSelector(
    (state) => state?.orders?.deliveryAddress
  );

  const [address, setAddress] = useState();

  useEffect(() => {
    if (!isLoading) {
      if (userAddress && Object.keys(userAddress).length > 0) {
        setAddress(userAddress);
      } else if (userAddressFromSlice) {
        setAddress(userAddressFromSlice);
      } else {
        navigate("/deliveryaddress");
        setTimeout(() => {
          if (!hasRedirected.current) {
            toast.error("Before Order you have to add address");
            hasRedirected.current = true;
          }
        }, 300);
      }
    }
  }, [userAddress, userAddressFromSlice, isLoading, navigate]);

  const handleNewAddress = () => {
    navigate("/deliveryaddress");
  };

  const selectedItems = items.filter((item) => selectedIds.includes(item._id));

  const groupedItems = selectedItems.reduce((groups, item) => {
    const key = item.restaurantId || "unknown";
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});

  const FREE_DELIVERY_THRESHOLD = 800;
  const BASE_DELIVERY_FEE = 34;
  const subtotal = selectedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryFee =
    subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : BASE_DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (
      !hasSubmitted &&
      items.length > 0 &&
      selectedIds.length > 0 &&
      selectedItems.length === 0 &&
      !hasRedirected.current
    ) {
      hasRedirected.current = true;
      toast.error("No items selected. Redirecting to cart...");
      navigate("/cart");
    }
  }, [items, selectedIds, selectedItems, hasSubmitted, navigate]);

  const handleConfirm = async () => {
    if (!address?.street?.trim() || !address?.city?.trim()) {
      toast.error("Please enter a valid delivery address.");
      return;
    }

    const orderItems = selectedItems.map((item) => ({
      _id: item._id,
      name: item.name,
      price: item.price,
      deliveryFee: deliveryFee,
      quantity: item.quantity,
      image: item.image,
      restaurant: item.restaurant,
    }));

    const createOrder = await userOrder({
      items: orderItems,
      total,
      deliveryFee,
      subtotal,
      address,
      restaurant: selectedItems[0].restaurant,
    }).unwrap();

    const newOrder = {
      id: createOrder.order._id,
      restaurantId: selectedItems[0].restaurant,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      createdAt: new Date().toISOString(),
      status: "Pending",
      address,
    };

    dispatch(addOrder(newOrder));
    setHasSubmitted(true);
    dispatch(clearSelected());
    toast.success("Order Confirmed!");

    setTimeout(() => {
      navigate("/orders");
    }, 1500);
  };

  return (
    <>
      {isLoading ? (
        <h1 className="text-2xl text-primary font-extrabold w-full h-screen flex items-center justify-center">
          Loading . . .
        </h1>
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>

          <div className="mb-6">
            <label className="block text-xl underline font-bold mb-2">
              Delivery Address
            </label>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-5 w-9/12">
                {address && (
                  <p className="text-base text-black dark:text-white">
                    <span className="font-bold">Street:</span> {address.street},{" "}
                    <span className="font-bold">City:</span> {address.city},{" "}
                    <span className="font-bold">State:</span> {address.state},{" "}
                    <span className="font-bold">Zip Code:</span>{" "}
                    {address.zipCode},{" "}
                    <span className="font-bold">Mobile Number:</span>{" "}
                    {address.mobileNumber},{" "}
                    <span className="font-bold">Apartment:</span>{" "}
                    {address.apartment},{" "}
                    <span className="font-bold">Delivery Instructions:</span>{" "}
                    {address.deliveryInstructions}
                  </p>
                )}
              </div>
              <button
                className="text-white cursor-pointer bg-primary px-3 py-1 rounded-md hover:bg-primary/90 flex items-center justify-end"
                onClick={() => handleNewAddress()}>
                Add a New Address
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center text-primary mt-5">
              <h1>Loading ...</h1>
            </div>
          ) : selectedItems.length === 0 ? (
            <div className="text-center text-primary mt-5">
              <h1>Loading ...</h1>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([restaurantId, group]) => (
                <div
                  key={restaurantId}
                  className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
                  <h2 className="text-xl font-semibold text-primary mb-3">
                    {group[0].restaurantName || "Unknown Restaurant"}
                  </h2>
                  {group.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center border-b py-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold">
                        ৳ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              ))}

              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                <p className="mb-1">Subtotal: ৳ {subtotal.toFixed(2)}</p>
                <p className="mb-1">
                  Delivery Fee:{" "}
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-semibold">Free</span>
                  ) : (
                    `৳ ${deliveryFee.toFixed(2)}`
                  )}
                </p>
                <p className="text-lg font-bold mt-2">
                  Total: ৳ {total.toFixed(2)}
                </p>
              </div>

              {isLoading ? (
                <div className="mx-auto">
                  <Watch
                    visible={true}
                    height="25"
                    width="25"
                    radius="48"
                    color="#0ee3bc"
                    ariaLabel="watch-loading"
                  />
                </div>
              ) : (
                <button
                  onClick={handleConfirm}
                  className="bg-secondary text-white cursor-pointer py-3 w-full rounded-lg font-semibold hover:bg-secondary/80 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                  Confirm Order
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
