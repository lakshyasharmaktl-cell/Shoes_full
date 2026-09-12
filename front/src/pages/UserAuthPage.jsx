import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiKey,
  FiArrowRight,
  FiCheckCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../api/apiClient";

export default function UserAuthPage() {
  const { loginUser, registerUser, verifyOtp, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [tab, setTab] = useState("login"); // 'login' or 'register'
  const [step, setStep] = useState("form"); // 'form' or 'otp'
  const [loading, setLoading] = useState(false);

  // Form states
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [otp, setOtp] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");

  if (isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 white-card rounded-3xl text-center space-y-4">
        <FiCheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
        <h3 className="text-xl font-bold font-serif-italic italic text-slate-900">
          You are already signed in
        </h3>
        <p className="text-xs text-slate-500 italic">
          Start exploring the white edition sneaker catalog.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold italic uppercase tracking-wider"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(loginData.email.trim(), loginData.password);
      navigate("/");
    } catch (err) {
      // Error is handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(registerData);
      setRegisteredEmail(registerData.email);
      setStep("otp");
    } catch (err) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOtp(registeredEmail, otp.trim());
      navigate("/");
    } catch (err) {
      // Error handled
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await api.resendOtp({ email: registeredEmail });
      showSuccess("A fresh OTP has been dispatched to your inbox");
    } catch (err) {
      showError(err.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center max-w-md mx-auto px-4 py-12">
      <div className="white-card rounded-3xl p-8 w-full shadow-2xl space-y-6 bg-white border border-slate-100">
        {/* Step 1: Login or Register */}
        {step === "form" ? (
          <>
            {/* Header / Tabs */}
            <div className="text-center space-y-3">
              <span className="text-2xl font-black uppercase font-serif-italic italic text-slate-900 tracking-tight">
                SHOE COLLECTION
              </span>
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition italic ${
                    tab === "login"
                      ? "bg-white text-slate-950 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Customer Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setTab("register")}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition italic ${
                    tab === "register"
                      ? "bg-white text-slate-950 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Login Form */}
            {tab === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none italic"
                    />
                    <FiMail className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
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
                  <span>Sign In</span>
                </button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none italic"
                    />
                    <FiUser className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none italic"
                    />
                    <FiMail className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="+1 555 0192"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none italic"
                    />
                    <FiPhone className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
                    Create Password *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="At least 6 characters"
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, password: e.target.value })
                      }
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
                  <span>Continue to OTP Verification</span>
                </button>
              </form>
            )}
          </>
        ) : (
          /* Step 2: OTP Verification */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-900">
                <FiKey className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif-italic italic text-slate-900">
                Verify Your Email
              </h3>
              <p className="text-xs text-slate-500 italic">
                We sent a 6-digit verification code to{" "}
                <span className="font-semibold text-slate-800">{registeredEmail}</span>
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic text-center">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full py-3 bg-slate-50 border border-slate-300 rounded-2xl text-center text-xl font-bold tracking-[0.4em] focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-lg flex items-center justify-center gap-2 italic tracking-wider uppercase disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <FiCheckCircle className="w-4 h-4" />
                )}
                <span>Verify & Complete Registration</span>
              </button>
            </form>

            <div className="flex items-center justify-between text-xs text-slate-500 italic pt-2">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="hover:text-slate-800"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                className="font-bold text-slate-900 hover:underline flex items-center gap-1"
              >
                <FiRefreshCw className="w-3 h-3" /> Resend OTP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
