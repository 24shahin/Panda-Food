import React, { useEffect, useState } from "react";
import MenuItemForm from "./MenuItemForm";
import { useAddMenuItemMutation } from "../../redux/apiSlice";
import toast from "react-hot-toast";

export default function NewMenuAdd() {
  const [editItem, setEditItem] = useState(null);
  const [addMenuItem, { isLoading }] = useAddMenuItemMutation();
  const handleAdd = async (data) => {
    const addmenu = await addMenuItem(data);
    toast.success("Successfully Add a Menu items");
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {editItem ? "✏️ Edit Menu Item" : "➕ Add New Menu Item"}
      </h2>

      <MenuItemForm onSubmit={handleAdd} initial={editItem || {}} />
    </div>
  );
}
