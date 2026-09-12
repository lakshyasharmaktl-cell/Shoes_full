import React from "react";
import { Link } from "react-router-dom";
import { FiHome, FiCompass } from "react-icons/fi";

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center max-w-md mx-auto px-4 py-16 text-center space-y-6">
      <div className="space-y-3">
        <span className="text-6xl font-black font-serif-italic italic text-slate-900 block">
          404
        </span>
        <h2 className="text-2xl font-bold font-serif-italic italic text-slate-800">
          Page Not Found
        </h2>
        <p className="text-xs text-slate-500 italic max-w-xs mx-auto">
          The footwear collection or page you're searching for seems to have moved or does not exist.
        </p>
      </div>

      <div className="flex justify-center gap-3">
        <Link
          to="/"
          className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold italic uppercase tracking-wider transition flex items-center gap-2"
        >
          <FiHome className="w-4 h-4" /> Home
        </Link>
        <Link
          to="/shop"
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full text-xs font-bold italic uppercase tracking-wider transition flex items-center gap-2"
        >
          <FiCompass className="w-4 h-4" /> Browse Shop
        </Link>
      </div>
    </div>
  );
}
