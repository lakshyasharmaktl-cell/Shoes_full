import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiShoppingBag, FiUser, FiSearch, FiShield, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=₹{encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "All Shoes", path: "/shop" },
    { name: "Running", path: "/shop?category=Running" },
    { name: "Casual", path: "/shop?category=Casual" },
    { name: "Sports", path: "/shop?category=Sports" },
    { name: "Formal", path: "/shop?category=Formal" },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname + location.search === path) return true;
    if (path === "/shop" && location.pathname === "/shop" && !location.search) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4 text-center tracking-wider font-light">
        <span className="italic font-medium">✨ FREE EXPRESS DELIVERY ON ALL ORDERS OVER ₹100 • 30-DAY HASSLE-FREE RETURNS ✨</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg italic shadow-md group-hover:bg-slate-800 transition">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tight uppercase font-serif-italic text-slate-900 leading-none">
                SHOE COLLECTION
              </span>
              <span className="text-[10px] tracking-[0.25em] text-slate-400 uppercase font-medium italic">
                White Edition Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 tracking-wide ₹{
                  isActive(link.path)
                    ? "text-slate-950 font-bold border-b-2 border-slate-950 pb-1 italic"
                    : "text-slate-600 hover:text-slate-950 italic"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative max-w-xs w-full ml-4"
          >
            <input
              type="text"
              placeholder="Search shoes, sneakers, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition placeholder:italic placeholder:text-slate-400 italic"
            />
            <FiSearch className="absolute left-3 text-slate-400 w-4 h-4 pointer-events-none" />
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Admin Portal Link — ONLY visible when authenticated with admin role */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-full text-xs font-semibold hover:bg-slate-800 transition shadow-sm"
              >
                <FiShield className="w-3.5 h-3.5 text-amber-400" />
                <span className="italic">Admin Portal</span>
              </Link>
            )}

            {/* User Account Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 p-2 rounded-full hover:bg-slate-100 text-slate-700 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs uppercase italic">
                      {user?.name ? user.name.charAt(0) : "U"}
                    </div>
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400 italic">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-800 truncate italic">
                          {user?.name || "Customer"}
                        </p>
                        {isAdmin && (
                          <span className="inline-block px-1.5 py-0.5 mt-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                            ADMIN
                          </span>
                        )}
                      </div>
                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setShowUserDropdown(false)}
                          className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 italic font-medium"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          logout();
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 italic font-medium"
                      >
                        <FiLogOut className="w-3.5 h-3.5" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center gap-1 p-2 rounded-full hover:bg-slate-100 text-slate-700 transition text-xs font-semibold italic"
                  title="Sign In / Register"
                >
                  <FiUser className="w-5 h-5 text-slate-800" />
                  <span className="hidden md:inline">Sign In</span>
                </Link>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 transition flex items-center justify-center"
              aria-label="View Cart"
            >
              <FiShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 py-4 px-2 space-y-3 bg-white">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search all shoe collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs italic"
              />
              <FiSearch className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
            </form>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-lg text-xs font-semibold text-center italic ₹{
                    isActive(link.path)
                      ? "bg-slate-900 text-white"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-amber-700 font-bold italic flex items-center gap-1"
                >
                  <FiShield className="w-4 h-4" /> Admin Portal
                </Link>
              )}

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-rose-600 font-semibold italic"
                >
                  Log Out
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-900 font-semibold italic"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
