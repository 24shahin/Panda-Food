// src/pages/RestaurantSetupForm.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, ImagePlus } from "lucide-react";

export default function RestaurantSetupForm() {
  const [form, setForm] = useState({
    name: "",
    location: "",
    contact: "",
    email: "",
    images: [],
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let key in form) {
      if (key === "images") {
        form.images.forEach((img) => formData.append("images", img));
      } else {
        formData.append(key, form[key]);
      }
    }

    // Replace with your backend API
    await fetch("/api/restaurants/setup", {
      method: "POST",
      body: formData,
    });

    alert("Restaurant setup complete!");
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}>
      <h2 className="text-3xl font-bold mb-6 text-center">
        🍽️ Setup Your Restaurant
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <div>
          <label className="block font-semibold mb-1">Restaurant Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 rounded border"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-2 rounded border"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Contact Number</label>
          <input
            type="tel"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            className="w-full p-2 rounded border"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 rounded border"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Upload Images</label>
          <label className="flex items-center gap-2 cursor-pointer text-blue-600 hover:underline">
            <ImagePlus className="w-5 h-5" />
            Choose Images
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          {form.images.length > 0 && (
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {form.images.map((img, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="rounded shadow border object-cover h-24"
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 transition">
          <UploadCloud className="w-5 h-5" />
          Submit Restaurant
        </button>
      </form>
    </motion.div>
  );
}
