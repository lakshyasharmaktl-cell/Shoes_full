import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiLock,
  FiShoppingBag,
  FiTruck,
  FiCreditCard,
  FiCheckCircle,
  FiArrowLeft,
  FiDollarSign,
} from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../api/apiClient";

export default function CheckoutPage() {
  const { cart, subtotal, totalSavings, clearCart } = useCart();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "COD",
  });

  const shippingCost = subtotal >= 100 ? 0 : 15;
  const finalTotal = subtotal + shippingCost;

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
          <FiShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-serif-italic italic text-slate-900">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-xs text-slate-500 italic">
          Add some exclusive shoes to your cart before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 bg-slate-900 text-white rounded-full text-xs font-bold italic tracking-wider uppercase hover:bg-slate-800 transition"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {
      showError("Please fill in all shipping details");
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        customer: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        },
        shippingAddress: {
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },
        items: cart.map((item) => ({
          product: item.productId,
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: Number(finalTotal.toFixed(2)),
        paymentMethod: formData.paymentMethod,
      };

      const placedOrder = await api.createOrder(orderPayload);
      clearCart();
      showSuccess("Order placed successfully! Thank you for choosing SHOE COLLECTION.");
      navigate(`/order-success/₹{placedOrder._id}`, { state: { order: placedOrder } });
    } catch (err) {
      showError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition italic"
      >
        <FiArrowLeft className="w-4 h-4" /> Continue Shopping
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Shipping & Payment Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            {/* Customer Details */}
            <div className="white-card rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center italic">
                  1
                </span>
                <h3 className="font-bold text-base text-slate-900 font-serif-italic italic">
                  Customer Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Johnathan Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none italic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none italic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 234 567 8900"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none italic"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="white-card rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center italic">
                  2
                </span>
                <h3 className="font-bold text-base text-slate-900 font-serif-italic italic">
                  Delivery Destination
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Apartment, suite, unit, building, floor, street"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none italic"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="New York"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none italic"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
                      State / Province *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="NY"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none italic"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="10001"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none italic"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="white-card rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center italic">
                  3
                </span>
                <h3 className="font-bold text-base text-slate-900 font-serif-italic italic">
                  Payment Method
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ₹{
                    formData.paymentMethod === "COD"
                      ? "border-slate-900 bg-slate-50/80 shadow-xs"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === "COD"}
                    onChange={() => setFormData({ ...formData, paymentMethod: "COD" })}
                    className="mt-1 accent-slate-900"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block italic">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[11px] text-slate-500 italic">
                      Pay in cash upon doorstep package delivery
                    </span>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ₹{
                    formData.paymentMethod === "ONLINE"
                      ? "border-slate-900 bg-slate-50/80 shadow-xs"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ONLINE"
                    checked={formData.paymentMethod === "ONLINE"}
                    onChange={() => setFormData({ ...formData, paymentMethod: "ONLINE" })}
                    className="mt-1 accent-slate-900"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block italic">
                      Online Card / UPI Payment
                    </span>
                    <span className="text-[11px] text-slate-500 italic">
                      Secure encrypted digital checkout
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs sm:text-sm font-bold transition shadow-xl flex items-center justify-center gap-2 italic tracking-wider uppercase disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <FiLock className="w-4 h-4" />
              )}
              <span>Place Order • ₹{finalTotal.toFixed(2)}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="white-card rounded-3xl p-6 sm:p-8 space-y-6 sticky top-28">
            <h3 className="font-bold text-base text-slate-900 font-serif-italic italic border-b border-slate-100 pb-3">
              Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
            </h3>

            {/* Items list */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={`₹{item.productId}-₹{item.size}`}
                  className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl"
                >
                  <div className="w-12 h-12 rounded-lg bg-white overflow-hidden p-1 flex-shrink-0 border border-slate-200">
                    <img
                      src={api.getImageUrl(item.image)}
                      alt=""
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-slate-900 truncate italic">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-slate-500 italic">
                      Size: {item.size} • Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-xs text-slate-900 italic">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="italic">Items Subtotal</span>
                <span className="font-semibold text-slate-900 italic">₹{subtotal.toFixed(2)}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span className="italic">Total Promo Savings</span>
                  <span className="font-semibold italic">-₹{totalSavings.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="italic">Express Delivery</span>
                <span className="font-semibold text-emerald-600 italic">
                  {shippingCost === 0 ? "FREE" : `₹₹{shippingCost.toFixed(2)}`}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 flex justify-between items-baseline">
              <span className="font-bold text-sm text-slate-900 italic">Final Amount</span>
              <span className="font-black text-2xl text-slate-950 italic font-serif-italic">
                ₹{finalTotal.toFixed(2)}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2 text-[11px] text-slate-500 italic">
              <FiLock className="w-4 h-4 text-slate-800 flex-shrink-0" />
              <span>256-Bit SSL Encrypted & Protected Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
