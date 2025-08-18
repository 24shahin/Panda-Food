// src/pages/restaurant/RestaurantSettings.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";

export default function RestaurantSettings() {
  const [form, setForm] = useState({
    name: "My Restaurant",
    location: "Dhaka, Bangladesh",
    phone: "+880 1234-567890",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Saved settings:", form);
    // later we’ll send to backend
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSave}
      className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">Restaurant Settings</h1>

      <div>
        <label className="block text-sm mb-1">Restaurant Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Location</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Phone Number</label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
        />
      </div>

      <button
        type="submit"
        className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 transition">
        <Save className="w-5 h-5" /> Save Changes
      </button>
    </motion.form>
  );
}
