// RestaurantCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function RestaurantCard({ restaurantDetails }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl overflow-hidden shadow-md dark:shadow-lg dark:bg-surfaceDark hover:shadow-xl transition">
      <img
        src={
          restaurantDetails.images[0] ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV0Rlx-5354Vf5J0ejVBQPNjte0dYccIZeGw&s"
        }
        alt="Restaurant"
        className="w-full h-40 object-cover"
      />
      <div className="p-4 bg-backgroundLight dark:bg-backgroundDark">
        <h3 className="text-lg font-bold text-black dark:text-white">
          {restaurantDetails.name}
        </h3>
        <p className="text-sm text-mutedForeground mb-2">
          {restaurantDetails.rating}⭐
        </p>
        <div className="flex flex-wrap gap-1 mb-4">
          {/* {restaurantDetails.items.map((item, idx) => (
            <span
              key={idx}
              className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
              {item}
            </span>
          ))} */}
        </div>
        <Link
          to={`/restaurant/${restaurantDetails?.user}`}
          className="inline-block bg-primary hover:bg-primary/90 text-white text-sm px-4 py-2 rounded-xl cursor-pointer">
          View Menu
        </Link>
      </div>
    </motion.div>
  );
}
