// src/utils/tokenUtils.js
import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};
