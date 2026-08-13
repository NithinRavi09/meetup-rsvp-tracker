const TOKEN_KEY = "meetup_token";
const USER_KEY = "meetup_user";

/**
 * Checks if a JWT token has expired based on its payload 'exp' claim.
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return true;
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));
    if (!decoded || !decoded.exp) return false;
    return decoded.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

/**
 * Saves the JWT authentication token to localStorage.
 */
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Retrieves the JWT authentication token from localStorage, automatically clearing it if expired.
 */
export const getToken = () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && isTokenExpired(token)) {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
  return token;
};

/**
 * Removes the JWT token from localStorage.
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Returns true if a valid, unexpired token exists in storage.
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Saves user profile information to localStorage.
 */
export const saveUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Retrieves the stored user profile object, safely handling invalid or corrupted JSON data.
 */
export const getUser = () => {
  if (typeof window === "undefined") return null;
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) return null;
  try {
    return JSON.parse(userData);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

/**
 * Removes stored user profile from localStorage.
 */
export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};
