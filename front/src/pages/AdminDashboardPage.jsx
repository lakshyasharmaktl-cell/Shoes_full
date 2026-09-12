import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiShield,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiBox,
  FiShoppingBag,
  FiDollarSign,
  FiAlertTriangle,
  FiSearch,
  FiCheckCircle,
  FiRefreshCw,
  FiLogOut,
  FiEye,
  FiExternalLink,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../api/apiClient";
import AdminProductModal from "../components/AdminProductModal";
import ConfirmModal from "../components/ConfirmModal";

export default function AdminDashboardPage() {
  const { user, isAdmin, loading: authLoading, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("products"); // 'products' or 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Protect Admin route
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, authLoading, navigate]);

  // Load Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, ordersData] = await Promise.all([
        api.getProducts({ all: "true" }),
        api.getOrders().catch(() => []),
      ]);
      setProducts(productsData || []);
      setOrders(ordersData || []);
    } catch (err) {
      showError("Failed to fetch dashboard records: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  if (authLoading || (!isAdmin && authLoading)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-900 border-t-transparent" />
      </div>
    );
  }

  // Calculate Metrics
  const totalProducts = products.length;
  const outOfStockCount = products.filter(
    (p) => (p.sizes || []).every((s) => s.stock <= 0) || p.totalStock <= 0
  ).length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Handle Delete Product
  const confirmDeleteProduct = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setActionLoading(true);
    try {
      await api.deleteProduct(productToDelete._id);
      showSuccess(`Product "₹{productToDelete.name}" deleted successfully`);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      loadData();
    } catch (err) {
      showError(err.message || "Failed to delete product");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Update Order Status
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      showSuccess(`Order status updated to "₹{newStatus}"`);
      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err) {
      showError(err.message || "Failed to update order status");
    }
  };

  // Filter Products
  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand?.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Filter Orders
  const filteredOrders = orders.filter(
    (o) =>
      o._id?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer?.email?.toLowerCase().includes(orderSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header Bar */}
      <div className="white-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
            <FiShield className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black font-serif-italic italic tracking-tight">
                SHOE COLLECTION Admin Portal
              </h1>
              <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-bold text-[10px] rounded uppercase">
                ADMIN ACCESS
              </span>
            </div>
            <p className="text-xs text-slate-300 italic mt-0.5">
              Logged in as <span className="text-white font-semibold">{user?.name || user?.email}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => {
              setProductToEdit(null);
              setIsProductModalOpen(true);
            }}
            className="px-5 py-2.5 bg-white text-slate-950 rounded-xl text-xs font-bold hover:bg-slate-100 transition shadow-md flex items-center gap-2 italic tracking-wider uppercase"
          >
            <FiPlus className="w-4 h-4" /> Add New Shoe
          </button>

          <button
            onClick={loadData}
            title="Refresh Data"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition border border-white/10"
          >
            <FiRefreshCw className={`w-4 h-4 ₹{loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => {
              logout();
              navigate("/admin/login");
            }}
            className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 italic"
          >
            <FiLogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="white-card rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center flex-shrink-0">
            <FiBox className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase italic">Total Shoes</p>
            <p className="text-2xl font-black font-serif-italic italic text-slate-900">
              {totalProducts}
            </p>
          </div>
        </div>

        <div className="white-card rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <FiAlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase italic">Out of Stock</p>
            <p className="text-2xl font-black font-serif-italic italic text-rose-600">
              {outOfStockCount}
            </p>
          </div>
        </div>

        <div className="white-card rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center flex-shrink-0">
            <FiShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase italic">Total Orders</p>
            <p className="text-2xl font-black font-serif-italic italic text-slate-900">
              {totalOrders}
            </p>
          </div>
        </div>

        <div className="white-card rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <FiDollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase italic">Total Sales</p>
            <p className="text-2xl font-black font-serif-italic italic text-emerald-600">
              ₹{totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold italic">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 px-2 flex items-center gap-2 transition ₹{
            activeTab === "products"
              ? "border-b-2 border-slate-900 text-slate-900"
              : "text-slate-400 hover:text-slate-700"
          }`}
        >
          <FiBox className="w-4 h-4" />
          <span>Footwear Products ({filteredProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 px-2 flex items-center gap-2 transition ₹{
            activeTab === "orders"
              ? "border-b-2 border-slate-900 text-slate-900"
              : "text-slate-400 hover:text-slate-700"
          }`}
        >
          <FiShoppingBag className="w-4 h-4" />
          <span>Customer Orders ({filteredOrders.length})</span>
        </button>
      </div>

      {/* TAB 1: PRODUCTS TABLE */}
      {activeTab === "products" && (
        <div className="white-card rounded-3xl overflow-hidden space-y-4 p-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Search products by title, brand, category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none italic"
              />
              <FiSearch className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
            </div>

            <button
              onClick={() => {
                setProductToEdit(null);
                setIsProductModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 italic"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider italic">
                  <th className="py-3 px-4">Shoe</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Sizes & Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions (Admin Only)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 italic">
                      No footwear products match your query. Click "Add New Product" to create one.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const totalStock = (product.sizes || []).reduce(
                      (s, i) => s + Number(i.stock || 0),
                      0
                    );
                    const isDiscounted =
                      product.discountPrice && product.discountPrice < product.price;

                    return (
                      <tr key={product._id} className="hover:bg-slate-50/70 transition">
                        {/* Shoe Image & Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 p-1">
                              <img
                                src={api.getImageUrl(product.images?.[0])}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.src =
                                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80";
                                }}
                              />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 font-serif-italic italic text-sm">
                                {product.name}
                              </p>
                              <p className="text-[10px] text-slate-400 italic">
                                {product.brand || "Exclusive"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold italic">
                            {product.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 font-semibold italic">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-bold text-slate-900">
                              ₹{Number(isDiscounted ? product.discountPrice : product.price).toFixed(2)}
                            </span>
                            {isDiscounted && (
                              <span className="text-[10px] text-slate-400 line-through">
                                ₹{Number(product.price).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Sizes & Stock */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 flex-wrap max-w-xs">
                            {(product.sizes || []).map((s, idx) => (
                              <span
                                key={idx}
                                className={`text-[9px] px-1.5 py-0.5 rounded font-medium italic ₹{
                                  s.stock > 0
                                    ? "bg-slate-100 text-slate-800"
                                    : "bg-rose-50 text-rose-500 line-through"
                                }`}
                              >
                                {s.size}: {s.stock}
                              </span>
                            ))}
                            <span className="text-[10px] text-slate-500 font-bold ml-1 italic">
                              (Tot: {totalStock})
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] font-bold italic ₹{
                              product.isActive
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setProductToEdit(product);
                                setIsProductModalOpen(true);
                              }}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 transition"
                              title="Edit Shoe"
                            >
                              <FiEdit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => confirmDeleteProduct(product)}
                              className="p-2 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition"
                              title="Delete Shoe"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === "orders" && (
        <div className="white-card rounded-3xl overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between gap-4 pb-2">
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Search orders by customer or reference..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none italic"
              />
              <FiSearch className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider italic">
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Items Ordered</th>
                  <th className="py-3 px-4">Total & Payment</th>
                  <th className="py-3 px-4">Status Updater</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-400 italic">
                      No customer orders have been placed yet.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 align-top">
                        <p className="font-mono font-bold text-slate-900 text-xs">{order._id}</p>
                        <p className="text-[10px] text-slate-400 italic mt-0.5">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </td>

                      <td className="py-3 px-4 align-top">
                        <p className="font-bold text-slate-900 italic">{order.customer?.name}</p>
                        <p className="text-[11px] text-slate-500 italic">{order.customer?.email}</p>
                        <p className="text-[10px] text-slate-400 italic">{order.customer?.phone}</p>
                        <p className="text-[10px] text-slate-500 italic mt-1 font-mono">
                          {order.shippingAddress?.address}, {order.shippingAddress?.city}
                        </p>
                      </td>

                      <td className="py-3 px-4 align-top">
                        <div className="space-y-1">
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} className="text-[11px] text-slate-700 italic">
                              • <span className="font-bold">{item.name}</span> (Size {item.size}) x{" "}
                              {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 align-top">
                        <p className="font-black text-sm text-slate-900 italic font-serif-italic">
                          ₹{order.totalAmount?.toFixed(2)}
                        </p>
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold italic mt-1">
                          {order.paymentMethod || "COD"}
                        </span>
                      </td>

                      <td className="py-3 px-4 align-top">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold italic border focus:outline-none ₹{
                            order.orderStatus === "Delivered"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                              : order.orderStatus === "Shipped"
                              ? "bg-blue-50 text-blue-700 border-blue-300"
                              : order.orderStatus === "Processing"
                              ? "bg-amber-50 text-amber-700 border-amber-300"
                              : order.orderStatus === "Cancelled"
                              ? "bg-rose-50 text-rose-700 border-rose-300"
                              : "bg-slate-100 text-slate-800 border-slate-200"
                          }`}
                        >
                          <option value="Placed">Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Add / Edit Product Modal */}
      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={productToEdit}
        onSaved={loadData}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Permanently Delete Product?"
        message={`Are you sure you want to delete "₹{productToDelete?.name}"? This will remove it from the online store and customer listings.`}
        confirmText="Delete Product"
        loading={actionLoading}
        onConfirm={handleDeleteProduct}
        onCancel={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
      />
    </div>
  );
}
