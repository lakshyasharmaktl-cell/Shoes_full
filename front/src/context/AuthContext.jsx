import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/apiClient";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("shoe_auth_token") || null);
  const [role, setRole] = useState(() => localStorage.getItem("shoe_auth_role") || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("shoe_auth_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  const { showSuccess, showError } = useToast();

  const isAdmin = role === "admin" || role === "superadmin";
  const isAuthenticated = !!token;

  useEffect(() => {
    // Check token validity on boot
    const verifySession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        if (isAdmin) {
          const profile = await api.getAdminProfile();
          setUser(profile);
          localStorage.setItem("shoe_auth_user", JSON.stringify(profile));
        } else {
          const profile = await api.getUserProfile();
          setUser(profile);
          localStorage.setItem("shoe_auth_user", JSON.stringify(profile));
        }
      } catch (err) {
        console.warn("Session expired or invalid token:", err.message);
        // If 401, keep clear
        if (err.message.includes("401") || err.message.includes("denied") || err.message.includes("failed")) {
          logout(false);
        }
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [token, role, isAdmin]);

  const setAuthSession = (authToken, userRole, userData) => {
    setToken(authToken);
    setRole(userRole);
    setUser(userData);
    localStorage.setItem("shoe_auth_token", authToken);
    localStorage.setItem("shoe_auth_role", userRole);
    localStorage.setItem("shoe_auth_user", JSON.stringify(userData));
  };

  const loginAdmin = async (email, password) => {
    try {
      const data = await api.loginAdmin({ email, password });
      setAuthSession(data.token, data.role || "admin", data);
      showSuccess(`Welcome back, Admin ${data.name}!`);
      return data;
    } catch (err) {
      showError(err.message || "Failed to login as admin");
      throw err;
    }
  };

  const loginUser = async (email, password) => {
    try {
      const data = await api.loginUser({ email, password });
      setAuthSession(data.token, "user", data);
      showSuccess(`Welcome back, ${data.name}!`);
      return data;
    } catch (err) {
      showError(err.message || "Failed to login");
      throw err;
    }
  };

  const registerUser = async (formData) => {
    try {
      const data = await api.registerUser(formData);
      showSuccess(data.message || "OTP sent to your email!");
      return data;
    } catch (err) {
      showError(err.message || "Registration failed");
      throw err;
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const data = await api.verifyOtp({ email, otp });
      setAuthSession(data.token, "user", data);
      showSuccess("Account verified successfully! Welcome to SHOE COLLECTION.");
      return data;
    } catch (err) {
      showError(err.message || "OTP verification failed");
      throw err;
    }
  };

  const logout = (notify = true) => {
    setToken(null);
    setRole(null);
    setUser(null);
    localStorage.removeItem("shoe_auth_token");
    localStorage.removeItem("shoe_auth_role");
    localStorage.removeItem("shoe_auth_user");
    if (notify) showSuccess("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        user,
        isAdmin,
        isAuthenticated,
        loading,
        loginAdmin,
        loginUser,
        registerUser,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
