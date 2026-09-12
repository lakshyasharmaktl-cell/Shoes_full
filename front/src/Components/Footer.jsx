import React from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiShield, FiTruck, FiRefreshCw, FiLock } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      {/* Guarantees section */}
      <div className="border-b border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-sm flex-shrink-0">
                <FiTruck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 italic">Free Global Express</h4>
                <p className="text-xs text-slate-500 italic">On all footwear orders over $100</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-sm flex-shrink-0">
                <FiRefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 italic">30-Day Easy Returns</h4>
                <p className="text-xs text-slate-500 italic">Complete satisfaction guaranteed</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-sm flex-shrink-0">
                <FiShield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 italic">100% Authentic</h4>
                <p className="text-xs text-slate-500 italic">Original verified sneaker releases</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-sm flex-shrink-0">
                <FiLock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 italic">Secure Payment</h4>
                <p className="text-xs text-slate-500 italic">COD & Online Encrypted Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-black uppercase font-serif-italic text-slate-900 tracking-tight">
                SHOE COLLECTION
              </span>
              <p className="text-[11px] tracking-[0.2em] text-slate-400 uppercase font-medium italic">
                The White Aesthetic Shoe Studio
              </p>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm italic leading-relaxed">
              Curating premier silhouettes, performance running editions, and luxury sneakers designed for superior comfort and timeless minimalist aesthetics.
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 italic">
                * Designed with Pristine White Elegance *
              </span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-4 italic">
              Categories
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shop?category=Running" className="text-slate-500 hover:text-slate-900 transition italic">
                  Running Shoes
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Casual" className="text-slate-500 hover:text-slate-900 transition italic">
                  Casual Sneakers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Sports" className="text-slate-500 hover:text-slate-900 transition italic">
                  Performance Sports
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Formal" className="text-slate-500 hover:text-slate-900 transition italic">
                  Formal Leather
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-4 italic">
              Quick Links
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shop" className="text-slate-500 hover:text-slate-900 transition italic">
                  Explore Full Catalog
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-slate-500 hover:text-slate-900 transition italic">
                  Customer Account
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-slate-500 hover:text-slate-900 transition italic flex items-center gap-1">
                  Admin Login <FiArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-4 italic">
              Stay Connected
            </h5>
            <p className="text-xs text-slate-500 mb-3 italic">
              Subscribe to unlock secret drops and exclusive discounts.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800 italic"
              />
              <button
                type="submit"
                className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition italic tracking-wider uppercase"
              >
                Join Private Club
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-100 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="italic">
            © {new Date().getFullYear()} SHOE COLLECTION Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6 italic">
            <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-600 cursor-pointer">Shipping Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
