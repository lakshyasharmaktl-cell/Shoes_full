import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiShield, FiLock, FiMail, FiArrowRight, FiUserCheck, FiUserPlus } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../api/apiClient";

export default function AdminLoginPage() {
  const { loginAdmin, isAdmin } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        await loginAdmin(email.trim(), password);
        navigate("/admin/dashboard");
      } else {
        // Register new admin
        const res = await api.registerAdmin({
          name: name.trim(),
          email: email.trim(),
          password,
          role: "admin",
        });
        showSuccess("Admin created successfully! Logging you in...");
        await loginAdmin(email.trim(), password);
        navigate("/admin/dashboard");
      }
    } catch (err) {
      // Error handled in AuthContext or api
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center max-w-md mx-auto px-4 py-12">
      <div className="white-card rounded-3xl p-8 w-full shadow-2xl space-y-6 border border-slate-100 bg-white">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
            <FiShield className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold font-serif-italic italic text-slate-900">
            {mode === "login" ? "Admin Portal Access" : "Register Admin Account"}
          </h2>
          <p className="text-xs text-slate-500 italic">
            {mode === "login"
              ? "Secure access to manage catalog, add/edit/delete shoes & manage orders"
              : "Create an authorized administrative credential"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
                Admin Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Master Admin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none italic"
                />
                <FiUserCheck className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
              Admin Email *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@shoes.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none italic"
              />
              <FiMail className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
              Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none italic"
              />
              <FiLock className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-lg flex items-center justify-center gap-2 italic tracking-wider uppercase disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <FiArrowRight className="w-4 h-4" />
            )}
            <span>{mode === "login" ? "Enter Admin Dashboard" : "Register & Sign In"}</span>
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 italic">
          <span>
            {mode === "login" ? "Need an admin account?" : "Already have admin credentials?"}
          </span>
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="font-bold text-slate-900 hover:underline"
          >
            {mode === "login" ? "Register Admin" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
