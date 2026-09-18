import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiCheck,
  FiArrowLeft,
  FiPlus,
  FiMinus,
  FiHeart,
  FiShare2,
  FiLogIn,
} from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { api } from "../api/apiClient";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../Components/ProductCard";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showSuccess } = useToast();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await api.getProductById(id);
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          const available = data.sizes.find((s) => s.stock > 0);
          if (available) setSelectedSize(available.size);
        }
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }

        // Fetch related
        const all = await api.getProducts({ category: data.category });
        setRelated((all || []).filter((p) => p._id !== data._id).slice(0, 4));
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-slate-100 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-6 bg-slate-100 rounded w-1/4" />
            <div className="h-10 bg-slate-100 rounded w-3/4" />
            <div className="h-6 bg-slate-100 rounded w-1/3" />
            <div className="h-24 bg-slate-100 rounded" />
            <div className="h-12 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-serif-italic italic text-slate-900">
          Footwear Not Found
        </h2>
        <p className="text-xs text-slate-500 italic">
          The requested shoe item might have been archived or removed.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold italic uppercase tracking-wider"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isDiscounted = product.discountPrice && product.discountPrice < product.price;
  const currentPrice = isDiscounted ? product.discountPrice : product.price;
  const discountPercent = isDiscounted
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const currentSizeObj = product.sizes?.find((s) => Number(s.size) === Number(selectedSize));
  const availableStock = currentSizeObj ? currentSizeObj.stock : product.totalStock || 0;
  const isOutOfStock = availableStock <= 0;

  const imagesList =
    product.images && product.images.length > 0
      ? product.images
      : ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"];

  const handleAddToCart = () => {
    if (!selectedSize) return;
    const added = addToCart(product, selectedSize, quantity);
    if (added) {
      // Success is triggered in cart context
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition italic"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to listings
      </button>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Image Gallery with Swiper */}
        <div className="lg:col-span-7 space-y-4">
          <div className="white-card rounded-3xl p-6 relative bg-gradient-to-b from-white via-slate-50/50 to-white overflow-hidden">
            {isDiscounted && (
              <span className="absolute top-6 left-6 z-10 px-3 py-1 bg-rose-500 text-white text-xs font-black uppercase rounded-full shadow-sm italic tracking-wider">
                {discountPercent}% OFF
              </span>
            )}

            <div className="w-full aspect-[4/3] sm:aspect-square flex items-center justify-center p-4">
              <img
                src={api.getImageUrl(imagesList[activeImageIndex])}
                alt={product.name}
                className="w-full h-full object-contain transform hover:scale-105 transition duration-500"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80";
                }}
              />
            </div>
          </div>

          {/* Thumbnails Row */}
          {imagesList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl border-2 overflow-hidden bg-slate-50 p-1 flex-shrink-0 transition ${
                    activeImageIndex === idx
                      ? "border-slate-900 shadow-md"
                      : "border-slate-200 hover:border-slate-400 opacity-70"
                  }`}
                >
                  <img
                    src={api.getImageUrl(img)}
                    alt=""
                    className="w-full h-full object-cover rounded-xl"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider italic">
                {product.brand || "Exclusive"} • {product.category}
              </span>
              <span
                className={`font-semibold italic flex items-center gap-1 ${
                  !isOutOfStock ? "text-emerald-600" : "text-rose-500"
                }`}
              >
                {!isOutOfStock ? (
                  <>
                    <FiCheck className="w-3.5 h-3.5" /> In Stock ({availableStock} units)
                  </>
                ) : (
                  "Currently Sold Out"
                )}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black font-serif-italic text-slate-950 italic leading-tight">
              {product.name}
            </h1>

            {/* Price section */}
            <div className="pt-2 flex items-baseline gap-3">
              <span className="text-3xl font-black font-serif-italic text-slate-950 italic">
                ${Number(currentPrice).toFixed(2)}
              </span>
              {isDiscounted && (
                <span className="text-base text-slate-400 line-through italic">
                  ${Number(product.price).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed font-light border-t border-b border-slate-100 py-4">
            {product.description}
          </p>

          {/* Color Variations */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider italic">
                Color Variation: <span className="text-slate-500 font-normal">{selectedColor}</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold italic border transition ${
                      selectedColor === c
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-900 uppercase tracking-wider italic">
                Select Shoe Size (US / Standard)
              </label>
              <span className="text-slate-400 italic">True to size fit</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
              {(product.sizes || []).map((s, idx) => {
                const inStock = s.stock > 0;
                const isSelected = Number(selectedSize) === Number(s.size);
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={!inStock}
                    onClick={() => setSelectedSize(s.size)}
                    className={`py-3 rounded-2xl text-xs font-bold italic border transition flex flex-col items-center justify-center relative ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-md scale-102"
                        : inStock
                        ? "bg-white text-slate-800 border-slate-200 hover:border-slate-800 hover:bg-slate-50"
                        : "bg-slate-50 text-slate-300 border-dashed border-slate-200 cursor-not-allowed line-through"
                    }`}
                  >
                    <span>{s.size}</span>
                    <span className="text-[9px] font-normal opacity-80">
                      {inStock ? `${s.stock} left` : "0"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity and Add to Bag */}
          <div className="space-y-4 pt-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* Quantity counter */}
                <div className="flex items-center border border-slate-200 rounded-2xl p-1 bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-600 hover:bg-slate-200 rounded-xl transition"
                  >
                    <FiMinus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-xs text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(availableStock || 99, quantity + 1))}
                    className="p-2 text-slate-600 hover:bg-slate-200 rounded-xl transition"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition shadow-xl flex items-center justify-center gap-2 italic tracking-wider uppercase disabled:opacity-40 disabled:cursor-not-allowed group"
                >
                  <FiShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? "Sold Out in this Size" : "Add to Shopping Bag"}</span>
                </button>
              </div>
            ) : (
              /* Guest: Sign In Prompt */
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="text-2xl">🔒</span>
                  <div>
                    <p className="text-xs font-bold text-slate-900 italic">Sign in to start shopping</p>
                    <p className="text-[11px] text-slate-500 italic mt-0.5">
                      Create a free account or sign in to add items to your cart and checkout.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/auth")}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition shadow-xl flex items-center justify-center gap-2 italic tracking-wider uppercase"
                >
                  <FiLogIn className="w-4 h-4" />
                  <span>Sign In to Shop</span>
                </button>
              </div>
            )}
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-6">
            <div className="text-center p-2.5 rounded-2xl bg-slate-50">
              <FiTruck className="w-4 h-4 mx-auto text-slate-800 mb-1" />
              <p className="text-[10px] font-bold text-slate-900 italic">Free Delivery</p>
              <p className="text-[9px] text-slate-400 italic">Over $100</p>
            </div>
            <div className="text-center p-2.5 rounded-2xl bg-slate-50">
              <FiRefreshCw className="w-4 h-4 mx-auto text-slate-800 mb-1" />
              <p className="text-[10px] font-bold text-slate-900 italic">30 Days</p>
              <p className="text-[9px] text-slate-400 italic">Easy Returns</p>
            </div>
            <div className="text-center p-2.5 rounded-2xl bg-slate-50">
              <FiShield className="w-4 h-4 mx-auto text-slate-800 mb-1" />
              <p className="text-[10px] font-bold text-slate-900 italic">100% Authentic</p>
              <p className="text-[9px] text-slate-400 italic">Guaranteed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Shoes Section */}
      {related.length > 0 && (
        <div className="border-t border-slate-100 pt-16 space-y-8">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">
              Similar Silhouettes
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif-italic text-slate-900 italic mt-1">
              You May Also Like
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
