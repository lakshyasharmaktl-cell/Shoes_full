import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiX, FiTrash2, FiPlus, FiMinus, FiArrowRight, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { api } from "../api/apiClient";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal, totalSavings, totalItems } =
    useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-100 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiShoppingBag className="w-5 h-5 text-slate-800" />
              <h3 className="text-lg font-bold text-slate-900 italic font-serif-italic">
                Your Shopping Bag ({totalItems})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                  <FiShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base italic">Your bag is empty</h4>
                  <p className="text-xs text-slate-500 italic mt-1">
                    Discover exclusive footwear designed in pristine white silhouettes.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate("/shop");
                  }}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition italic tracking-wider uppercase"
                >
                  Shop Now
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`₹{item.productId}-₹{item.size}`}
                  className="flex gap-4 p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-slate-200 transition"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-100">
                    <img
                      src={api.getImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80";
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <Link
                          to={`/product/₹{item.productId}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-bold text-xs text-slate-900 hover:underline line-clamp-1 italic"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.productId, item.size)}
                          className="text-slate-400 hover:text-rose-500 transition p-1"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 italic mt-0.5">
                        Size: <span className="font-semibold text-slate-800">{item.size}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition text-xs"
                        >
                          <FiMinus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition text-xs"
                        >
                          <FiPlus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-sm text-slate-900 italic">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                        {item.discountPrice > 0 && (
                          <p className="text-[10px] text-slate-400 line-through italic">
                            ₹{(item.originalPrice * item.quantity).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Subtotal & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/70 space-y-4">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="italic">Subtotal</span>
                  <span className="font-semibold text-slate-900 italic">₹{subtotal.toFixed(2)}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="italic">Exclusive Promo Savings</span>
                    <span className="font-semibold italic">-₹{totalSavings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="italic">Estimated Shipping</span>
                  <span className="font-semibold text-emerald-600 italic">
                    {subtotal >= 100 ? "FREE" : "₹15.00"}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <span className="font-bold text-sm text-slate-900 italic">Estimated Total</span>
                <span className="font-black text-lg text-slate-900 italic font-serif-italic">
                  ₹{(subtotal + (subtotal >= 100 ? 0 : 15)).toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2 italic tracking-wider uppercase"
              >
                <span>Checkout Now</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
