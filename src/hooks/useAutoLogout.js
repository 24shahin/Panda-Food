// src/hooks/useAutoLogout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { isTokenExpired } from "../utils/tokenUtils";
import toast from "react-hot-toast";

export default function useAutoLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (isTokenExpired(token)) {
      dispatch(logout());
      toast.error("Session expired. Please log in again.");
      navigate("/login");
    }
  }, [dispatch, navigate]);
}
