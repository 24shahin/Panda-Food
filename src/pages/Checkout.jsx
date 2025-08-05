import React, { useState, useEffect, useRef } from "react"; // 🆕 useState/useEffect added
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { clearSelected } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { addOrder } from "../redux/ordersSlice";

export default function Checkout() {
  const hasRedirected = useRef(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, selectedIds } = useSelector((state) => state.cart);
  const address = useSelector((state) => state?.orders?.deliveryAddress);

  useEffect(() => {
    if (!address || address == null) {
      navigate("/deliveryaddress");
    }
  }, [address]);

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

  const FREE_DELIVERY_THRESHOLD = 50;
  const BASE_DELIVERY_FEE = 3.99;
  const subtotal = selectedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryFee =
    subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : BASE_DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  // 🆕 Address State

  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (!hasSubmitted && selectedItems.length === 0 && !hasRedirected.current) {
      hasRedirected.current = true;
      toast.error("No items selected. Redirecting to cart...");
      navigate("/cart");
    }
  }, [selectedItems, navigate, hasSubmitted]);

  const handleConfirm = () => {
    if (!address || !address.street || !address.city) {
      toast.error("Please enter a valid delivery address.");
      return;
    }

    const newOrder = {
      id: Date.now(),
      items: selectedItems,
      subtotal,
      deliveryFee,
      total,
      createdAt: new Date().toISOString(),
      status: "Pending",
      address,
    };

    dispatch(addOrder(newOrder));
    setHasSubmitted(true);
    dispatch(clearSelected()); // ✅ Clear selected cart items after order
    toast.success("Order Confirmed!");

    setTimeout(() => {
      navigate("/orders");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* 🆕 Delivery Address */}
      <div className="mb-6">
        <label className="block text-xl underline font-bold mb-2">
          Delivery Address
        </label>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-5 w-9/12">
            <input type="checkbox" defaultChecked />
            {address && (
              <p className="text-base text-black dark:text-white">
                <span className="font-bold">Street:</span> {address.street},{" "}
                <span className="font-bold">City:</span> {address.city},{" "}
                <span className="font-bold">State:</span> {address.state},{" "}
                <span className="font-bold">Zip Code:</span> {address.zipCode},{" "}
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

      {selectedItems.length === 0 ? (
        <p className="text-gray-500">No items selected for checkout.</p>
      ) : (
        <div className="space-y-6">
          {/* Grouped Items */}
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
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ))}

          {/* Summary */}
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <p className="mb-1">Subtotal: ${subtotal.toFixed(2)}</p>
            <p className="mb-1">
              Delivery Fee:{" "}
              {deliveryFee === 0 ? (
                <span className="text-green-600 font-semibold">Free</span>
              ) : (
                `$${deliveryFee.toFixed(2)}`
              )}
            </p>
            <p className="text-lg font-bold mt-2">Total: ${total.toFixed(2)}</p>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            className="bg-secondary text-white cursor-pointer py-3 w-full rounded-lg font-semibold hover:bg-secondary/80 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
            Confirm Order
          </button>
        </div>
      )}
    </div>
  );
}
