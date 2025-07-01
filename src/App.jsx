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

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen flex flex-col bg-backgroundLight dark:bg-backgroundDark text-black dark:text-white transition-colors duration-300">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/" element={<Home />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/deliveryaddress" element={<AddressForm />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            {/* Add more routes here */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
