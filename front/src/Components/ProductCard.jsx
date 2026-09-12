import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCheck, FiXCircle } from "react-icons/fi";
import { api } from "../api/apiClient";

export default function ProductCard({ product }) {
  if (!product) return null;

  const mainImage = product.images && product.images[0] ? api.getImageUrl(product.images[0]) : null;
  const isDiscounted = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = isDiscounted
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const currentPrice = isDiscounted ? product.discountPrice : product.price;
  const hasStock = (product.sizes || []).some((s) => s.stock > 0) || product.totalStock > 0;

  return (
    <div className="group white-card white-card-hover rounded-3xl p-4 flex flex-col justify-between overflow-hidden relative">
      {/* Top Badges */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1.5 items-start">
        {isDiscounted && (
          <span className="px-2.5 py-1 bg-rose-500 text-white text-[10px] font-black uppercase rounded-full shadow-sm italic tracking-wider">
            {discountPercent}% OFF
          </span>
        )}
        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold uppercase rounded-full border border-slate-100 shadow-xs italic">
          {product.category || "Footwear"}
        </span>
      </div>

      {/* Image Container */}
      <Link
        to={`/product/₹{product._id}`}
        className="block relative w-full aspect-square bg-slate-50/70 rounded-2xl overflow-hidden mb-4 p-4 flex items-center justify-center group-hover:bg-slate-100/50 transition duration-300"
      >
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-contain object-center transform group-hover:scale-108 group-hover:-rotate-2 transition duration-500 ease-out"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80";
          }}
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider italic text-[11px] text-slate-500">
              {product.brand || "Exclusive"}
            </span>
            <span
              className={`flex items-center gap-1 text-[11px] font-medium italic ₹{
                hasStock ? "text-emerald-600" : "text-rose-500"
              }`}
            >
              {hasStock ? (
                <>
                  <FiCheck className="w-3 h-3" /> In Stock
                </>
              ) : (
                <>
                  <FiXCircle className="w-3 h-3" /> Sold Out
                </>
              )}
            </span>
          </div>

          <Link to={`/product/₹{product._id}`} className="block">
            <h3 className="font-serif-italic font-bold text-base text-slate-900 group-hover:text-slate-700 transition line-clamp-1 italic leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 italic line-clamp-2 mt-1 mb-3">
            {product.description}
          </p>
        </div>

        {/* Sizes Preview & Pricing */}
        <div>
          {/* Sizes Chips */}
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            <span className="text-[10px] text-slate-400 italic mr-1">Sizes:</span>
            {(product.sizes || []).slice(0, 5).map((s, idx) => (
              <span
                key={idx}
                className={`text-[10px] px-2 py-0.5 rounded-md font-medium italic ₹{
                  s.stock > 0
                    ? "bg-slate-100 text-slate-700 border border-slate-200"
                    : "bg-slate-50 text-slate-300 line-through border border-dashed border-slate-200"
                }`}
              >
                {s.size}
              </span>
            ))}
            {(product.sizes || []).length > 5 && (
              <span className="text-[10px] text-slate-400 italic">
                +{(product.sizes || []).length - 5} more
              </span>
            )}
          </div>

          {/* Price & Action Button */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black font-serif-italic text-slate-950 italic">
                  ₹{Number(currentPrice).toFixed(2)}
                </span>
                {isDiscounted && (
                  <span className="text-xs text-slate-400 line-through italic">
                    ₹{Number(product.price).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <Link
              to={`/product/₹{product._id}`}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 italic tracking-wider group/btn"
            >
              <span>View</span>
              <FiArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
