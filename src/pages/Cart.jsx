import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  toggleSelectItem,
} from "../redux/cartSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const dispatch = useDispatch();
  const { items, selectedIds } = useSelector((state) => state?.cart);
  const allSelected = items.length > 0 && selectedIds.length === items.length;

  const handleSelectAllToggle = () => {
    if (allSelected) {
      dispatch({ type: "cart/clearSelected" });
    } else {
      dispatch({ type: "cart/selectAll", payload: items.map((i) => i._id) });
    }
  };

  const handleQuantityChange = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }
    dispatch(updateQuantity({ id: item._id, quantity: newQty }));
    toast.success("Quantity updated");
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    toast.success("Item removed from cart");
  };

  const handleCheckboxToggle = (id) => {
    dispatch(toggleSelectItem(id));
  };

  const selectedItems = items.filter((item) => selectedIds.includes(item._id));
  const FREE_DELIVERY_THRESHOLD = 800;
  const BASE_DELIVERY_FEE = 34;
  const subtotal = selectedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryFee =
    subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : BASE_DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  // Group items by restaurantId
  const groupedItems = items.reduce((groups, item) => {
    const key = item.restaurantId || "unknown";
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        {items.length > 0 && (
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 accent-secondary"
              checked={allSelected}
              onChange={handleSelectAllToggle}
            />
            Select All
          </label>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="flex gap-x-5">
          <div className="space-y-6 w-9/12">
            {Object.entries(groupedItems).map(([restaurantId, group]) => (
              <div
                key={restaurantId}
                className="border border-gray-200 rounded-lg p-4 shadow-sm">
                {/* Show restaurant name from the first item in the group */}
                <h2 className="text-xl font-semibold mb-3 text-primary">
                  Restaurant: {group[0].restaurantName || "Unknown"}
                </h2>
                {group.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between gap-4 mb-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item._id)}
                      onChange={() => handleCheckboxToggle(item._id)}
                      className="w-5 h-5 accent-secondary cursor-pointer"
                    />
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex items-center w-8/12 justify-between">
                      <h2 className="font-semibold text-lg w-1/2">
                        {item.name}
                      </h2>
                      <p className="text-gray-500 w-1/4">
                        ৳{Number(item.price).toFixed(2)}
                      </p>
                      <div className="flex items-center space-x-2 w-1/4">
                        <button
                          onClick={() => handleQuantityChange(item, -1)}
                          className="px-2 py-1 bg-gray-200 rounded cursor-pointer">
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item, 1)}
                          className="px-2 py-1 bg-gray-200 rounded cursor-pointer">
                          +
                        </button>
                      </div>
                      <p className="px-2 py-1">
                        ৳{(item.quantity * Number(item.price)).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="text-red-500 hover:underline text-sm cursor-pointer">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="p-4 w-3/12 border border-gray-200 rounded-md shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Checkout Summary</h3>
            <p className="mb-1">Selected Items: {selectedItems.length}</p>
            <p className="mb-1">Subtotal: ৳{subtotal.toFixed(2)}</p>
            <p className="mb-1">
              Delivery:{" "}
              {deliveryFee === 0 ? (
                <span className="text-green-600 font-medium">Free</span>
              ) : (
                `৳${deliveryFee.toFixed(2)}`
              )}
            </p>
            <p className="font-bold text-lg">Total: ৳{total.toFixed(2)}</p>
            <button
              disabled={selectedItems.length === 0}
              onClick={() => navigate("/checkout")}
              className={`mt-4 w-full px-6 py-3 rounded-lg text-white transition ${
                selectedItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-secondary hover:bg-secondary/80 cursor-pointer"
              }`}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
