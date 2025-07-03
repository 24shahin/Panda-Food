import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { isTokenExpired } from "../utils/tokenUtils";

export default function useAutoLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // ✅ Don't redirect if there's no token

    if (isTokenExpired(token)) {
      dispatch(logout());
      navigate("/login");
    }
  }, [dispatch, navigate]);
}
