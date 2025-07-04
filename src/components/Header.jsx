// import React, { useEffect, useState } from "react";
// import { Search, User, ShoppingCart, Sun, Moon } from "lucide-react";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";

// export default function Header() {
//   const [darkMode, setDarkMode] = useState(
//     localStorage.getItem("theme") === "dark"
//   );

//   useEffect(() => {
//     const root = document.documentElement;
//     if (darkMode) {
//       root.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     } else {
//       root.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
//   }, [darkMode]);

//   return (
//     <motion.header
//       initial={{ y: -80, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.6, ease: "easeOut" }}
//       className="sticky top-0 z-50 w-full bg-primary shadow-md text-white dark:bg-gray-900 dark:text-white">
//       <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//         {/* Logo */}
//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           className="text-2xl font-extrabold tracking-tight">
//           <Link to="/">PandaFood</Link>
//         </motion.div>

//         {/* Search Bar */}
//         <div className="flex-1 mx-8 max-w-xl">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search for dishes or restaurants..."
//               className="w-full py-2 pl-4 pr-10 rounded-full placeholder-[#d8cfcf] focus:outline-none border border-white text-white bg-transparent dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
//             />
//             <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-300" />
//           </div>
//         </div>

//         {/* Icons */}
//         <div className="flex items-center space-x-4">
//           {/* Dark mode toggle */}
//           <button
//             onClick={() => setDarkMode(!darkMode)}
//             className="p-1 rounded-full transition hover:scale-110"
//             title="Toggle Dark Mode">
//             {darkMode ? (
//               <Sun className="w-5 h-5 text-yellow-300" />
//             ) : (
//               <Moon className="w-5 h-5 text-gray-200" />
//             )}
//           </button>

//           <button className="hover:text-secondary transition">
//             <User className="h-6 w-6" />
//           </button>
//           <Link
//             className="relative hover:text-secondary transition"
//             to={"/cart"}>
//             <ShoppingCart className="h-6 w-6" />
//             <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full px-1">
//               3
//             </span>
//           </Link>
//         </div>
//       </div>
//     </motion.header>
//   );
// }

import React, { useEffect, useState } from "react";
import { Search, User, ShoppingCart, Sun, Moon, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

// ✅ Add these imports for redux auth
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

export default function Header() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Redux auth
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Logout handler
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full bg-primary shadow-md text-white dark:bg-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-extrabold tracking-tight">
          <Link to="/">PandaFood</Link>
        </motion.div>

        {/* Search Bar */}
        <div className="flex-1 mx-8 max-w-xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for dishes or restaurants..."
              className="w-full py-2 pl-4 pr-10 rounded-full placeholder-[#d8cfcf] focus:outline-none border border-white text-white bg-transparent dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-300" />
          </div>
        </div>

        {/* Icons and User Links */}
        <div className="flex items-center space-x-4">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1 rounded-full transition hover:scale-110"
            title="Toggle Dark Mode">
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-200" />
            )}
          </button>

          {/* User section */}
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="hidden sm:inline">Hi, {user.name}</span>
              {/* Logout button */}
              <button
                onClick={handleLogout}
                title="Logout"
                className="hover:text-secondary transition p-1">
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          ) : (
            <>
              {/* Show Login/Register links if NOT logged in */}
              <Link
                to="/login"
                className="hover:text-secondary transition font-medium">
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-secondary transition font-medium">
                Register
              </Link>
            </>
          )}

          {/* Cart icon with badge */}
          <Link
            className="relative hover:text-secondary transition"
            to={"/cart"}
            title="Cart">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full px-1">
              3
            </span>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
