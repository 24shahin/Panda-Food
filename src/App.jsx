import React from "react";
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

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// ✅ Separate component so hook can be used properly
function AppContent() {
  useAutoLogout(); // ✅ safe to use here

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen flex flex-col bg-backgroundLight dark:bg-backgroundDark text-black dark:text-white transition-colors duration-300">
        <Header />
        <main className="flex-1">
          <Routes>
            {/* ✅ Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />

            {/* ✅ Protected User Routes */}
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

            {/* ✅ Admin Route */}
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
