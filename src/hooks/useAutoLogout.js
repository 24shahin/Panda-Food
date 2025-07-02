// src/hooks/useAutoLogout.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../utils/tokenUtils";
import { logout } from "../redux/authSlice";

export default function useAutoLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      dispatch(logout());
      navigate("/login");
      return;
    }

    // Optional: Set timer to auto logout exactly when token expires
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = exp * 1000 - Date.now();

    const timer = setTimeout(() => {
      dispatch(logout());
      navigate("/login");
      toast.info("Session expired, please login again.");
    }, expiryTime);

    return () => clearTimeout(timer);
  }, [dispatch, navigate]);
}
