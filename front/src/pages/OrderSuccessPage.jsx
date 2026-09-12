import React from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { FiCheckCircle, FiPackage, FiTruck, FiArrowRight, FiHome } from "react-icons/fi";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="white-card rounded-3xl p-8 sm:p-12 text-center space-y-8 bg-gradient-to-b from-white via-slate-50/40 to-white">
        {/* Checkmark icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <FiCheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 italic">
            Order Confirmed & Received
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-serif-italic italic text-slate-900">
            Thank You For Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 italic max-w-md mx-auto">
            Your footwear package is now being prepped in our white-glove packaging facility.
          </p>
        </div>

        {/* Order Details card */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold italic">
                Order Tracking Reference
              </span>
              <p className="text-sm font-mono font-bold text-slate-900">{id}</p>
            </div>
            {order?.createdAt && (
              <span className="text-xs text-slate-500 italic">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {order && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] italic">
                  Shipping Recipient
                </p>
                <p className="font-semibold text-slate-900 italic">{order.customer?.name}</p>
                <p className="text-slate-600 italic">{order.customer?.email}</p>
                <p className="text-slate-600 italic">{order.customer?.phone}</p>
              </div>

              <div>
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] italic">
                  Delivery Address
                </p>
                <p className="text-slate-800 italic">{order.shippingAddress?.address}</p>
                <p className="text-slate-800 italic">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}
                </p>
                <p className="text-slate-500 italic mt-1 font-semibold">
                  Payment: {order.paymentMethod} • Total: ${order.totalAmount?.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition shadow-md flex items-center justify-center gap-2 italic tracking-wider uppercase"
          >
            <FiHome className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            to="/shop"
            className="w-full sm:w-auto px-8 py-3.5 bg-white border border-slate-200 hover:border-slate-800 text-slate-900 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 italic"
          >
            <span>Continue Shopping</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
