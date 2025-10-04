import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  adminOnly = false,
  restaurantOwner = false,
  deliveryMan = false,
}) {
  const user = useSelector((state) => state.auth.user);
  const deliveryManInfo = useSelector(
    (state) => state?.deliveryManAuth?.deliveryman
  );

  const isAuthenticatedAsUser = !!user;
  const isAuthenticatedAsDeliveryMan = !!deliveryManInfo;

  // If no one is logged in, redirect to the main login page.
  if (!isAuthenticatedAsUser && !isAuthenticatedAsDeliveryMan) {
    return <Navigate to="/login" replace />;
  }

  // Case 1: Route is specifically for a Delivery Man
  if (deliveryMan) {
    if (
      isAuthenticatedAsDeliveryMan &&
      deliveryManInfo.role === "deliveryman"
    ) {
      return children; // Access granted
    } else {
      // If not a delivery man or not logged in as one, redirect.
      return <Navigate to="/deliverymanlogin" replace />;
    }
  }

  // Case 2: A delivery man is trying to access a route NOT for them (e.g., /cart)
  // We redirect them to their dashboard instead of a generic page.
  if (isAuthenticatedAsDeliveryMan) {
    return <Navigate to="/deliveryman/dashboard" replace />;
  }

  // Case 3: Routes for regular users (customer, admin, restaurant owner)
  if (isAuthenticatedAsUser) {
    if (adminOnly && user.role !== "admin") {
      return <Navigate to="/" replace />; // Not an admin
    }
    if (restaurantOwner && user.role !== "restaurant") {
      return <Navigate to="/" replace />; // Not a restaurant owner
    }
    // If none of the specific role checks fail, grant access.
    return children;
  }

  // Fallback redirect if something unexpected happens
  return <Navigate to="/login" replace />;
}
