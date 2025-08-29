// src/components/AuthRedirectRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AuthRedirectRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);
  const deliveryManInfo = useSelector(
    (state) => state?.deliveryManAuth?.deliveryman
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  // If there's a user, redirect them to the home page
  if (user || deliveryManInfo) {
    return <Navigate to="/" replace />;
  }

  // If there's no user, allow them to view the child components
  return children;
}
