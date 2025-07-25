import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRegisterMutation } from "../redux/apiSlice";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [register, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userData = await register(form).unwrap();
      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-backgroundLight dark:bg-backgroundDark px-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <motion.form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 space-y-6"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}>
        <h2 className="text-3xl font-bold text-center text-green-600 dark:text-white">
          Create Account 🎉
        </h2>
        <p className="text-center text-sm text-gray-500 dark:text-gray-300">
          Join and explore the best food near you!
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              className="mt-1 block w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              className="mt-1 block w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-300">
          {isLoading ? "Registering..." : "Register"}
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center mt-2">
            {error.data?.message || "Registration failed"}
          </p>
        )}

        <p className="text-center text-sm mt-4 text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-green-600 hover:underline font-semibold">
            Login
          </a>
        </p>
      </motion.form>
    </motion.div>
  );
}
