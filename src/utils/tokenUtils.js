// src/utils/tokenUtils.js
export function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() > exp;
  } catch (err) {
    return true; // treat error as expired
  }
}
