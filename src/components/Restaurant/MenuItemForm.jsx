import React, { useState } from "react";
import { useUploadImagesMutation } from "../../redux/apiSlice";
import dataURLtoBlob from "../../functions/imagesConvertor";
import { useSelector } from "react-redux";
import { Watch } from "react-loader-spinner";
import toast from "react-hot-toast";

export default function MenuItemForm({
  onSubmit,
  initial = {},
  setShowForm,
  setEditItem,
}) {
  const userInfo = useSelector((state) => state.auth.user);
  const [imageError, setImageError] = useState("");
  const [menuImage, setMenuImage] = useState();
  const [form, setForm] = useState({
    name: initial.name || "",
    description: initial.description || "",
    price: initial.price || "",
    image: null,
    category: initial.category || "",
    available: initial.available ?? true,
  });

  const [uploadImages, { isLoading }] = useUploadImagesMutation();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (
        file.type !== "image/webp" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/png" &&
        file.type !== "image/gif"
      ) {
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

    if (!form.image || !(form.image instanceof File)) {
      return alert("Please select a valid image file.");
    }

    try {
      const blob = dataURLtoBlob(menuImage);
      const path = `${userInfo._id}/menu_images`;

      const formData = new FormData();
      formData.append("file", blob);
      formData.append("path", path);

      const uploaded = await uploadImages({ formData, path }).unwrap();

      const finalData = {
        ...form,
        image: uploaded[0].url,
      };

      onSubmit(finalData);
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error(`${err?.data?.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      {/* Name */}
      <input
        type="text"
        name="name"
        placeholder="Item Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
      />

      {/* Description */}
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        rows={2}
        className="w-full border p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
      />

      {/* Price */}
      <input
        type="text"
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
      />

      {/* Category */}
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        className="w-full border p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
      />

      <div className={`${initial.name ? "hidden" : "block"}`}>
        {/* Image Upload */}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full border p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
        />

        {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
        {menuImage && (
          <div>
            <img
              src={menuImage}
              alt="Preview"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}
      </div>

      {/* Available */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="available"
          checked={form.available}
          onChange={handleChange}
        />
        Available
      </label>

      {/* Submit */}
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
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          ) : initial.name ? (
            "Update Item"
          ) : (
            "Add Item"
          )}
        </button>
        {initial.name && (
          <button
            className="px-4 py-2 text-white bg-red-400 cursor-pointer rounded"
            onClick={() => {
              setEditItem("");
              setShowForm(false);
            }}>
            Cancle
          </button>
        )}
      </div>
    </form>
  );
}
