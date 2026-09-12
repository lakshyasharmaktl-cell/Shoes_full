import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiShield, FiLock, FiMail, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function AdminLoginPage() {
  const { loginAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      await loginAdmin(email.trim(), password);
      navigate("/admin/dashboard");
    } catch (err) {
      // Error is handled in AuthContext with toast
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
            Admin Portal Access
          </h2>
          <p className="text-xs text-slate-500 italic">
            Authorized administrative login only. Only accounts with admin role in MongoDB can access the management portal.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <span>Enter Admin Dashboard</span>
          </button>
        </form>

        <div className="pt-3 text-center">
          <span className="text-[11px] text-slate-400 italic">
            🔒 Protected by cryptographic token & role validation
          </span>
        </div>
      </div>
    </div>
  );
}
