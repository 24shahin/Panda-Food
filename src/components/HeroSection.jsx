// src/components/HeroSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/70 to-secondary text-white py-20">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092')] bg-cover bg-center opacity-10"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow-md">
          Your Favorite Food, Delivered Fast
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-lg sm:text-xl max-w-2xl mx-auto mb-6 drop-shadow">
          Explore delicious meals from top-rated restaurants near you. Order now
          and enjoy exclusive deals!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}>
          <Link
            to="/menu"
            className="inline-block bg-white text-primary font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition">
            Browse Menu
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-6xl px-4">
        <img
          src="https://cdn.pixabay.com/photo/2017/05/07/08/56/food-2290877_960_720.jpg"
          alt="hero food"
          className="rounded-xl shadow-lg w-full object-cover h-64 md:h-80 lg:h-96"
        />
      </motion.div>
    </section>
  );
}
