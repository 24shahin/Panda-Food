// src/pages/restaurant/RestaurantMenu.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useRestaurantOverViewQuery } from "../../redux/apiSlice";
import MenuItem from "../../components/Restaurant/AddMenu";
import { useSelector } from "react-redux";

export default function RestaurantMenu() {
  const userInfo = useSelector((state) => state?.auth);

  // fetch menu items
  const purpuse = "menuitems";
  const { data, isLoading, isError, error, refetch } =
    useRestaurantOverViewQuery(purpuse);

  // fetch something owner-related (your existing usage)
  const purpuse2 = "orders";
  const { data: restaurantOwners } = useRestaurantOverViewQuery(purpuse2);

  const [restaurantOwner, setRestaurantOwner] = useState([]);

  useEffect(() => {
    if (Array.isArray(restaurantOwners)) {
      setRestaurantOwner(restaurantOwners);
    } else if (
      restaurantOwners?.orders &&
      Array.isArray(restaurantOwners.orders)
    ) {
      setRestaurantOwner(restaurantOwners.orders);
    } else if (restaurantOwners) {
      setRestaurantOwner([restaurantOwners]);
    }
  }, [restaurantOwners]);

  // compute visitor reliably; avoid flicker if there are no orders yet
  const visitor = useMemo(() => {
    // wait for auth to be ready
    if (!userInfo?.user?._id) return null;

    // if user is a restaurant owner, treat as owner for this dashboard page
    if (userInfo?.user?.role === "restaurant") return true;

    // otherwise compare against fetched restaurant owner (if available)
    if (restaurantOwner.length > 0) {
      return userInfo.user._id === restaurantOwner[0]?.restaurant?.user;
    }

    // default non-owner if nothing to compare (not loading auth anymore)
    return false;
  }, [userInfo, restaurantOwner]);

  if (visitor === null) {
    return <p>Loading...</p>;
  }

  const [menu, setMenu] = useState([]);
  useEffect(() => {
    if (data) {
      setMenu(Array.isArray(data) ? data : []);
    }
  }, [data]);

  if (isLoading) {
    return <p className="text-center py-6 text-primary">Loading Menu ...</p>;
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 py-6">
        Failed to load your Restaurant Menu:{" "}
        {error?.data?.message || error?.error || "Unknown error"}
      </p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Menu</h1>
        <Link
          to="/restaurantOwner/addmenu"
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 transition">
          <Plus className="w-5 h-5" /> Add New
        </Link>
      </div>

      <div className="space-y-3">
        {menu
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}>
              <MenuItem
                item={item}
                visitor={visitor}
                // restaurantId={restaurants?.user}
                // restaurantName={restaurants.name}
                onItemUpdated={() => {
                  if (visitor) {
                    refetch();
                  }
                }}
              />
            </motion.div>
          ))}
      </div>
    </motion.div>
  );
}
