import React, { createContext, useState } from "react";

export const AuthContext = createContext({
  token: null,
  userId: null,
  login: (token) => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  // Load any existing token from localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Derive userId from the JWT’s `sub` claim
  const userId = token ? JSON.parse(atob(token.split(".")[1])).sub : null;

  // Call this after login to persist token
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  // Call this on logout to clear state
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
