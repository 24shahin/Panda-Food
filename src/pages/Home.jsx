// src/pages/Home.jsx
import React, { useState } from "react";
import HeroSection from "../components/HeroSection";
import RestaurantCard from "../components/RestaurantCard";

const restaurantData = [
  {
    _id: 1,
    name: "Pizza Palace",
    image: "https://source.unsplash.com/featured/?pizza",
    rating: 4.5,
    cuisine: "Italian",
    items: ["Pepperoni", "Margherita", "BBQ Chicken"],
  },
  {
    _id: 2,
    name: "Sushi Spot",
    image: "https://source.unsplash.com/featured/?sushi",
    rating: 4.7,
    cuisine: "Japanese",
    items: ["Salmon Roll", "Tuna Sashimi", "Avocado Maki"],
  },
  {
    _id: 3,
    name: "Burger House",
    image: "https://source.unsplash.com/featured/?burger",
    rating: 4.3,
    cuisine: "American",
    items: ["Cheeseburger", "Veggie Burger", "Double Patty"],
  },
  {
    _id: 4,
    name: "Taco Town",
    image: "https://source.unsplash.com/featured/?taco",
    rating: 4.6,
    cuisine: "Mexican",
    items: ["Beef Taco", "Chicken Taco", "Fish Taco"],
  },
  {
    _id: 5,
    name: "Pasta Place",
    image: "https://source.unsplash.com/featured/?pasta",
    rating: 4.4,
    cuisine: "Italian",
    items: ["Spaghetti Bolognese", "Carbonara", "Pesto Penne"],
  },
  {
    _id: 6,
    name: "Curry Kingdom",
    image: "https://source.unsplash.com/featured/?curry",
    rating: 4.8,
    cuisine: "Indian",
    items: ["Chicken Tikka", "Butter Naan", "Paneer Masala"],
  },
  {
    _id: 7,
    name: "Dragon Wok",
    image: "https://source.unsplash.com/featured/?chinese-food",
    rating: 4.5,
    cuisine: "Chinese",
    items: ["Fried Rice", "Chow Mein", "Kung Pao Chicken"],
  },
  {
    _id: 8,
    name: "Vegan Delight",
    image: "https://source.unsplash.com/featured/?vegan",
    rating: 4.6,
    cuisine: "Healthy",
    items: ["Tofu Bowl", "Vegan Wrap", "Smoothie"],
  },
];

export default function Home({ getAllRestaurant, isLoading }) {
  return (
    <div className="min-h-screen bg-backgroundLight dark:bg-backgroundDark transition-colors duration-300">
      <HeroSection />

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">
          Popular Restaurants
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {isLoading == false ? (
            getAllRestaurant.map((restaurant) => (
              <RestaurantCard
                key={restaurant._id}
                restaurantDetails={restaurant}
              />
            ))
          ) : (
            <h2 className="flex justify-center items-center">Loading . . .</h2>
          )}
        </div>
      </section>
    </div>
  );
}
