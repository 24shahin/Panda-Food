// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import AuthRedirectRoute from "./components/AuthRedirectRoute";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurantSetupForm from "./pages/RestaurantSetupForm";
import { useGetAllRestaurantQuery } from "./redux/apiSlice";
import NewMenuAdd from "./components/Restaurant/NewMenuAdd";
import { useSelector, useDispatch } from "react-redux";
import { initCartFromLocalStorage, logoutCart } from "./redux/cartSlice";
import { initOrdersFromLocalStorage, logoutOrders } from "./redux/ordersSlice";
import UserAllOrdes from "./pages/UserAllOrdes";
import DashboardLayout from "./pages/restaurant/DashboardLayout";
import RestaurantOverview from "./pages/restaurant/RestaurantOverview";
import RestaurantMenu from "./pages/restaurant/RestaurantMenu";
import RestaurantOrders from "./pages/restaurant/RestaurantOrders";
import RestaurantSettings from "./pages/restaurant/RestaurantSettings";
import RegisterDeliveryMan from "./pages/Delivery-man/RegisterDeliveryMan";
import DeliveryManLogin from "./pages/Delivery-man/DeliveryManLogin";
import DeliveryManDashboard from "./pages/Delivery-man/DeliveryManDashboard";
import { initDeliveryManFromLocalStorage } from "./redux/deliveryManSlice";
import DeliveryManAvailableOrders from "./pages/AvailableOrders";

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [getAllRestaurant, setGetAllRestaurant] = useState([]);
  const { data: allRestaurant, isLoading } = useGetAllRestaurantQuery();

  const user = useSelector((state) => state.auth.user);
  const { deliveryman } = useSelector((state) => state.deliveryManAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (allRestaurant) setGetAllRestaurant(allRestaurant);
  }, [allRestaurant]);

  useEffect(() => {
    if (user && user._id) {
      dispatch(initCartFromLocalStorage(user._id));
      dispatch(initOrdersFromLocalStorage(user._id));
    } else {
      dispatch(logoutCart());
      dispatch(logoutOrders());
    }
  }, [user, dispatch]);

  useEffect(() => {
    dispatch(initDeliveryManFromLocalStorage());
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen flex flex-col bg-backgroundLight dark:bg-backgroundDark text-black dark:text-white transition-colors duration-300">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  getAllRestaurant={getAllRestaurant}
                  isLoading={isLoading}
                />
              }
            />

            {/* ✅ NEW: Wrap login and register routes with AuthRedirectRoute */}
            <Route
              path="/login"
              element={
                <AuthRedirectRoute>
                  <Login />
                </AuthRedirectRoute>
              }
            />
            <Route
              path="/register"
              element={
                <AuthRedirectRoute>
                  <Register />
                </AuthRedirectRoute>
              }
            />
            <Route
              path="/registerdeliveryman"
              element={
                <AuthRedirectRoute>
                  <RegisterDeliveryMan />
                </AuthRedirectRoute>
              }
            />
            <Route
              path="/deliverymanlogin"
              element={
                <AuthRedirectRoute>
                  <DeliveryManLogin />
                </AuthRedirectRoute>
              }
            />
            {/* ✅ Deliveryman Dashboard Protected */}
            <Route
              path="/deliveryman/dashboard"
              element={
                deliveryman ? (
                  <DeliveryManDashboard />
                ) : (
                  <Navigate to="/deliverymanlogin" replace />
                )
              }
            />
            <Route
              path="/deliveryman/available"
              element={
                deliveryman ? (
                  <DeliveryManAvailableOrders />
                ) : (
                  <Navigate to="/deliverymanlogin" replace />
                )
              }
            />

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
              path="/userallorders"
              element={
                <ProtectedRoute>
                  <UserAllOrdes />
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
            {/* ✅ Restaurant Owner Dashboard with nested routes */}
            <Route
              path="/restaurant/dashboard"
              element={
                <ProtectedRoute restaurantOwner={true}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
              <Route path="overview" element={<RestaurantOverview />} />
              <Route path="menu" element={<RestaurantMenu />} />
              <Route path="orders" element={<RestaurantOrders />} />
              <Route path="settings" element={<RestaurantSettings />} />
            </Route>

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
