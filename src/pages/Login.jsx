import React, { useState } from "react";
import { useDispatch } from "react-redux";
// import { useLoginMutation } from "../redux/authApiSlice";
// import { setUser } from "../redux/authSlice";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //   const userData = await login({ email, password }).unwrap();
      //   dispatch(setUser(userData.user));
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-backgroundLight dark:bg-backgroundDark px-4 -mt-16"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 space-y-6"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}>
        <h2 className="text-3xl font-bold text-center text-primary dark:text-white">
          Welcome Back 👋
        </h2>
        <p className="text-center text-sm text-gray-500 dark:text-gray-300">
          Please enter your credentials to login
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              className="mt-1 block w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              className="mt-1 block w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          //   disabled={isLoading}
          className="w-full bg-primary hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-300">
          {/* {isLoading ? "Logging in..." : "Login"} */} login
        </button>

        {/* {error && (
          <p className="text-red-500 text-sm text-center mt-2">
            {error.data?.message || "Login failed"}
          </p>
        )} */}

        <p className="text-center text-sm mt-4 text-gray-500 dark:text-gray-400">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-primary hover:underline font-semibold">
            Register
          </a>
        </p>
      </motion.form>
    </motion.div>
  );
}
