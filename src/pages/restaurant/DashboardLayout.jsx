import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Utensils, ShoppingBag, Settings } from "lucide-react";
import { useSelector } from "react-redux";

export default function DashboardLayout() {
  const location = useLocation();
  const userInfo = useSelector((state) => state?.auth?.user);
  const navigate = useNavigate();
  const links = [
    {
      to: "/restaurant/dashboard/overview",
      label: "Overview",
      icon: LayoutDashboard,
    },
    { to: "/restaurant/dashboard/menu", label: "Menu", icon: Utensils },
    { to: "/restaurant/dashboard/orders", label: "Orders", icon: ShoppingBag },
    { to: "/restaurant/dashboard/settings", label: "Settings", icon: Settings },
  ];
  const handleRedirect = () => {
    navigate(`/restaurant/${userInfo?._id}`);
  };
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="w-64 bg-white dark:bg-gray-800 shadow-lg p-4 flex flex-col">
        <h1
          className="text-2xl font-bold mb-6 text-orange-500 cursor-pointer"
          onClick={() => handleRedirect()}>
          Restaurant
        </h1>
        <nav className="space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                location.pathname === to
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}>
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet /> {/* This will render child routes like Orders, Menu, etc. */}
      </main>
    </div>
  );
}
