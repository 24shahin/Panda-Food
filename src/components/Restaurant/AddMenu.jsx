import React, { useRef, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import toast from "react-hot-toast";
import MenuItemForm from "./MenuItemForm";
import OutSideClick from "../../functions/click";
import { useDeleteMenuItemMutation } from "../../redux/apiSlice";

export default function MenuItem({
  item,
  visitor,
  restaurantId,
  restaurantName,
  onItemUpdated = () => {},
}) {
  const dispatch = useDispatch();
  const [editItem, setEditItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteMenuItem, { isLoading }] = useDeleteMenuItemMutation();
  const editRef = useRef(null);
  OutSideClick(editRef, () => {
    setEditItem("");
    setShowForm(false);
  });

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

  const handleDelete = async (item) => {
    const deletemenu = await deleteMenuItem({ id: item._id });
    toast.success("Menu item deleted successfully");
    onItemUpdated();
  };

  return (
    <div className="bg-white relative dark:bg-gray-800 border border-gray-300 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      {/* FORM SECTION (Admin only) */}
      {showForm && (
        <div
          className="mb-6 absolute right-96 -bottom-1/2 translate-y-1/2 w-1/2 bg-gray-200 p-6 dark:bg-gray-600 rounded-md z-50"
          ref={editRef}>
          <MenuItemForm
            initial={editItem || {}}
            setEditItem={setEditItem}
            setShowForm={setShowForm}
            editItem={editItem}
            onItemUpdated={onItemUpdated}
          />
        </div>
      )}

      {/* MENU ITEM DISPLAY */}
      <div className="flex justify-between items-center">
        {/* Left: Info */}
        <div className="pr-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {item.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ৳ {item.price}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            ⭐ {item.rating} | {item.sold}+ sold
          </p>

          {/* Actions based on role */}
          {!visitor ? (
            <div className="mt-3 flex gap-2">
              <button
                className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary/90 transition cursor-pointer"
                disabled={!item.available}
                onClick={handleAddToCart}>
                <ShoppingCart size={14} className="inline-block mr-1" />
                Add to Cart
              </button>
              <button
                className="bg-secondary/10 text-secondary px-3 py-1 rounded text-xs hover:bg-secondary/20 transition cursor-pointer"
                disabled={item.available}>
                <Heart size={14} className="inline-block mr-1" />
                Wishlist
              </button>
            </div>
          ) : (
            <div className="mt-3 flex gap-4 text-sm">
              <button
                onClick={() => {
                  setEditItem(item);
                  setShowForm(true);
                }}
                className="text-white hover:underline cursor-pointer bg-primary px-5 py-2 rounded">
                Edit
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="text-white hover:underline cursor-pointer bg-primary px-5 py-2 rounded">
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Middle: Description */}
        <div className="w-1/2 text-center">
          <h3 className="text-base">{item.description}</h3>
        </div>

        {/* Right: Image */}
        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={item.image}
            alt={`Image of ${item.name}`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
