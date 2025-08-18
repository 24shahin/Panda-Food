import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, ShoppingBag, Utensils } from "lucide-react";
import { useRestaurantOverViewQuery } from "../../redux/apiSlice";

export default function RestaurantOverview() {
  const purpuse = "overview";
  const { data, isLoading, isError, error } =
    useRestaurantOverViewQuery(purpuse);
  const purpuse2 = "menuitems";
  const { data: menu } = useRestaurantOverViewQuery(purpuse2);
  const [overView, setOverView] = useState();
  useEffect(() => {
    if (data) {
      setOverView(data);
    }
  }, [data]);
  console.log(overView);
  if (isLoading) {
    return (
      <p className="text-center py-6 text-primary">
        Loading Over View details...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 py-6">
        Failed to load your Restaurant Over View:{" "}
        {error?.data?.message || error?.error || "Unknown error"}
      </p>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Welcome to your restaurant dashboard. Here you’ll see stats and recent
        activity.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-orange-500" />
          <div>
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-xl font-bold">{overView?.totalOrders}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex items-center gap-3">
          <Utensils className="w-8 h-8 text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Menu Items</p>
            <p className="text-xl font-bold">{menu?.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="text-xl font-bold">$3,200</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
