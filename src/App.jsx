// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RestaurantDetails from "./pages/RestaurantDetails";
import Cart from "./pages/Cart";
import { Toaster } from "react-hot-toast";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import AddressForm from "./pages/DeliveryAddressForm";
import OrderDetails from "./pages/OrderDetails";
import AdminOrders from "./pages/AdminOrders";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import useAutoLogout from "./hooks/useAutoLogout";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurantSetupForm from "./pages/RestaurantSetupForm";
import Dashboard from "./pages/restaurant/Dashboard";
import { useGetAllRestaurantQuery } from "./redux/apiSlice";
import NewMenuAdd from "./components/Restaurant/NewMenuAdd";

import { useSelector, useDispatch } from "react-redux";
import { initCartFromLocalStorage, logoutCart } from "./redux/cartSlice"; // ✅ logoutCart import করা হয়েছে

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  useAutoLogout();
  const [getAllRestaurant, setGetAllRestaurant] = useState([]);
  const { data: allRestaurant, isLoading } = useGetAllRestaurantQuery();

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (allRestaurant) setGetAllRestaurant(allRestaurant);
  }, [allRestaurant]);

  useEffect(() => {
    if (user && user._id) {
      // ব্যবহারকারী লগইন করলে তার আইডি ব্যবহার করে কার্ট লোড করা হবে
      dispatch(initCartFromLocalStorage(user._id));
    } else {
      // ব্যবহারকারী লগআউট করলে কার্ট স্টেট ক্লিয়ার করা হবে
      // ✅ initCartFromLocalStorage(null) এর বদলে logoutCart ব্যবহার করা হয়েছে
      dispatch(logoutCart());
    }
  }, [user, dispatch]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen flex flex-col bg-backgroundLight dark:bg-backgroundDark text-black dark:text-white transition-colors duration-300">
        <Header />
        <main className="flex-1">
          <Routes>
            {/* your routes here unchanged */}
            <Route
              path="/"
              element={
                <Home
                  getAllRestaurant={getAllRestaurant}
                  isLoading={isLoading}
                />
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/deliveryaddress"
              element={
                <ProtectedRoute>
                  <AddressForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurantOwner/dashboard"
              element={
                <ProtectedRoute restaurantOwner={true}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurantOwner/addmenu"
              element={
                <ProtectedRoute restaurantOwner={true}>
                  <NewMenuAdd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurant/setup"
              element={
                <ProtectedRoute>
                  <RestaurantSetupForm />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}
