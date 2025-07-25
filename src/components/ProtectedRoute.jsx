// src/components/ProtectedRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  adminOnly = false,
  restaurantOwner = false,
}) {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  if (restaurantOwner && user.role !== "restaurant") {
    return <Navigate to="/" replace />;
  }

  return children;
}
