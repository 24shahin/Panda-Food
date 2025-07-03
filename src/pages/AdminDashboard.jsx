// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, PackageCheck, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    // Simulate API call
    const timeout = setTimeout(() => {
      setStats({
        users: 152,
        orders: 298,
        revenue: 12840,
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: <User className="h-8 w-8 text-blue-500" />,
      bg: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "Total Orders",
      value: stats.orders,
      icon: <PackageCheck className="h-8 w-8 text-green-500" />,
      bg: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "Total Revenue",
      value: `$${stats.revenue}`,
      icon: <DollarSign className="h-8 w-8 text-yellow-500" />,
      bg: "bg-yellow-100 dark:bg-yellow-900",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center">
        📊 Admin Dashboard
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className={`rounded-xl shadow-md p-6 ${card.bg} text-black dark:text-white`}>
            <div className="flex items-center gap-4">
              {card.icon}
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  {card.title}
                </p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
