import React from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import toast from "react-hot-toast";

export default function MenuItemCard({ item, restaurantId, restaurantName }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...item,
        restaurantId,
        restaurantName,
      })
    );
    toast.success("Item added to cart");
  };

  return (
    <div className="flex justify-between items-center bg-white dark:bg-gray-800 border border-gray-300 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      {/* Left Side: Info */}
      <div className="flex-1 pr-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {item.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ${item.price}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          ⭐ {item.rating} | {item.sold}+ sold
        </p>
        <div className="mt-3 flex gap-2">
          <button
            className="bg-primary text-white px-3 py-1 cursor-pointer rounded text-xs hover:bg-primary/90 transition"
            onClick={handleAddToCart}>
            <ShoppingCart size={14} className="inline-block mr-1" />
            Add to Cart
          </button>
          <button className="bg-secondary/10 text-secondary cursor-pointer px-3 py-1 rounded text-xs hover:bg-secondary/20 transition">
            <Heart size={14} className="inline-block mr-1" />
            Wishlist
          </button>
        </div>
      </div>

      {/* Right Side: Image */}
      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
