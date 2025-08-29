// MenuItemForm.js
import React, { useEffect, useRef, useState } from "react";
import {
  useAddMenuItemMutation,
  useEditMenuItemMutation,
  useUploadImagesMutation,
} from "../../redux/apiSlice";
import dataURLtoBlob from "../../functions/imagesConvertor";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { Watch } from "react-loader-spinner";

export default function MenuItemForm({
  initial = {},
  setShowForm,
  setEditItem,
  editItem,
  onItemUpdated = () => {},
}) {
  const userInfo = useSelector((state) => state.auth.user);
  const [imageError, setImageError] = useState("");
  const [menuImage, setMenuImage] = useState("");
  const [form, setForm] = useState({
    name: initial.name || "",
    description: initial.description || "",
    price: initial.price || "",
    image: null,
    category: initial.category || "",
    available: initial.available ?? true,
  });
  const path = `${userInfo._id}/menu_images/${initial._id}`;
  const navigate = useNavigate();
  const [addMenuItem, { isLoading }] = useAddMenuItemMutation();
  const [editMenuItem] = useEditMenuItemMutation();
  const [uploadImages] = useUploadImagesMutation();

  useEffect(() => {
    if (initial.image) {
      setMenuImage(initial.image);
    }
  }, [initial.image]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      const allowedTypes = [
        "image/webp",
        "image/jpeg",
        "image/png",
        "image/gif",
      ];

      if (!allowedTypes.includes(file.type)) {
        setImageError("Only JPG, PNG, WEBP, or GIF images are allowed.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setImageError("File too large. Maximum size is 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => setMenuImage(event.target.result);
      reader.readAsDataURL(file);

      setForm((prev) => ({ ...prev, image: file }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price) {
      return alert("Name and Price are required.");
    }

    try {
      const added = await addMenuItem(form).unwrap();

      if (form.image && form.image instanceof File) {
        const blob = await dataURLtoBlob(menuImage);
        const path = `${userInfo._id}/menu_images/${added._id}`;
        const formData = new FormData();
        formData.append("file", blob);
        formData.append("path", path);

        const uploaded = await uploadImages({ formData, path }).unwrap();

        await editMenuItem({
          id: added._id,
          data: { image: uploaded[0].url },
          addedImage: true,
        }).unwrap();
      }

      toast.success("Menu item added successfully");
      setTimeout(() => navigate(`/restaurant/${userInfo._id}`), 2000);
    } catch (err) {
      console.error("Error:", err);
      toast.error(`${err?.data?.message}`);
    }
  };

  const handleEditUpdate = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price) {
      return alert("Name and Price are required.");
    }

    try {
      if (form.image && form.image instanceof File) {
        const blob = await dataURLtoBlob(menuImage);
        const formData = new FormData();
        formData.append("file", blob);
        formData.append("path", path);

        const uploaded = await uploadImages({ formData, path }).unwrap();

        await editMenuItem({
          id: initial._id,
          data: { ...form, image: uploaded[0].url },
          addedImage: false,
          path,
        }).unwrap();
      } else {
        const { image, ...restForm } = form;
        const updatedForm = {
          ...restForm,
          image: menuImage || initial.image,
        };

        await editMenuItem({
          id: initial._id,
          data: updatedForm,
          addedImage: false,
          path,
        }).unwrap();
      }

      toast.success("Menu item updated successfully");
      setEditItem(null);
      onItemUpdated();
      setShowForm(false);
    } catch (err) {
      toast.error(`Update failed. ${err}`);
      console.error("Update error:", err);
    }
  };

  const handleImageClear = async () => {
    setMenuImage("");
    setForm((prev) => ({ ...prev, image: null }));
    const deleteImage = await deleteImagesFolder({ path }).unwrap();
    console.log(deleteImage);
  };

  return (
    <form
      onSubmit={editItem ? handleEditUpdate : handleSubmit}
      className="space-y-4 max-w-md mx-auto">
      <input
        type="text"
        name="name"
        placeholder="Item Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        rows={2}
        className="w-full border p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white resize-none"
      />

      <input
        type="text"
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        className="w-full border p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
      />

      <div>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full border cursor-pointer p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
        />

        {imageError && <p className="text-red-500 text-sm">{imageError}</p>}

        {menuImage && (
          <div className="relative">
            <img
              src={menuImage}
              alt="Preview"
              className="w-28 h-28 object-cover rounded mt-3"
            />
            {editItem && (
              <div className="absolute top-0 left-0 w-28">
                <div
                  className="bg-white/70 inline-block p-1 rounded cursor-pointer ml-1 mt-1"
                  onClick={handleImageClear}>
                  <RxCross1 />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="available"
          checked={form.available}
          onChange={handleChange}
        />
        Available
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-700 flex">
          {isLoading ? (
            <div className="mx-auto">
              <Watch
                visible={true}
                height="30"
                width="30"
                radius="48"
                color="#0ee3bc"
                ariaLabel="watch-loading"
              />
            </div>
          ) : editItem ? (
            "Update Item"
          ) : (
            "Add Item"
          )}
        </button>
        {editItem && (
          <button
            className="px-4 py-2 text-white bg-red-600 cursor-pointer rounded"
            onClick={() => {
              setEditItem("");
              setShowForm(false);
            }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
