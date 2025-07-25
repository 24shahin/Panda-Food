// pages/restaurant/Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <motion.div
      className="max-w-4xl mx-auto py-10 px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-bold mb-8 text-center">
        🍽️ Restaurant Dashboard
      </h1>

      <div className="grid sm:grid-cols-2 gap-6">
        <Link
          to="/restaurantOwner/add-menu"
          className="bg-green-600 text-white p-6 rounded-xl shadow-lg hover:bg-green-700 transition transform hover:scale-105">
          ➕ Add / Manage Menu Items
        </Link>

        <Link
          to="/restaurantOwner/orders"
          className="bg-blue-600 text-white p-6 rounded-xl shadow-lg hover:bg-blue-700 transition transform hover:scale-105">
          📦 View Restaurant Orders
        </Link>
      </div>
    </motion.div>
  );
}
