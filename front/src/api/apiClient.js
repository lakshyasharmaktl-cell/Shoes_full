// Base API client configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Helper to get authorization header
const getAuthHeaders = () => {
  const token = localStorage.getItem("shoe_auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  baseUrl: API_BASE_URL,

  // Format image URL (handles both relative `/image/...` and full URLs)
  getImageUrl: (imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  },

  // Generic request
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    const headers = {
      ...getAuthHeaders(),
      ...options.headers,
    };

    // If body is not FormData, set Content-Type to application/json
    if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    try {
      const res = await fetch(url, { ...options, headers });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error((data && data.message) || `Request failed with status ${res.status}`);
      }

      return data;
    } catch (err) {
      console.error(`API Error on [${options.method || "GET"} ${endpoint}]:`, err);
      throw err;
    }
  },

  // HTTP Methods
  get(endpoint, headers = {}) {
    return this.request(endpoint, { method: "GET", headers });
  },

  post(endpoint, body, isFormData = false) {
    return this.request(endpoint, {
      method: "POST",
      body: isFormData ? body : JSON.stringify(body),
    });
  },

  put(endpoint, body, isFormData = false) {
    return this.request(endpoint, {
      method: "PUT",
      body: isFormData ? body : JSON.stringify(body),
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  },

  // Specific API calls
  // Products
  getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== "All") query.append("category", params.category);
    if (params.minPrice) query.append("minPrice", params.minPrice);
    if (params.maxPrice) query.append("maxPrice", params.maxPrice);
    if (params.search) query.append("search", params.search);
    if (params.all) query.append("all", "true");

    const qs = query.toString();
    return this.get(`/api/products${qs ? `?${qs}` : ""}`);
  },

  getProductById(id) {
    return this.get(`/api/products/${id}`);
  },

  createProduct(formData) {
    return this.post("/api/products", formData, true);
  },

  updateProduct(id, formData, isFormData = true) {
    return this.put(`/api/products/${id}`, formData, isFormData);
  },

  deleteProduct(id) {
    return this.delete(`/api/products/${id}`);
  },

  // Orders
  createOrder(orderData) {
    return this.post("/api/orders", orderData);
  },

  getOrders() {
    return this.get("/api/orders");
  },

  getOrderById(id) {
    return this.get(`/api/orders/${id}`);
  },

  updateOrderStatus(id, orderStatus) {
    return this.put(`/api/orders/${id}/status`, { orderStatus });
  },

  // Auth - Admin
  loginAdmin(credentials) {
    return this.post("/api/admin/login", credentials);
  },

  registerAdmin(data) {
    return this.post("/api/admin/register", data);
  },

  getAdminProfile() {
    return this.get("/api/admin/profile");
  },

  // Auth - Customer User
  registerUser(data) {
    return this.post("/api/users/register", data);
  },

  verifyOtp(data) {
    return this.post("/api/users/verify-otp", data);
  },

  resendOtp(data) {
    return this.post("/api/users/resend-otp", data);
  },

  loginUser(credentials) {
    return this.post("/api/users/login", credentials);
  },

  getUserProfile() {
    return this.get("/api/users/profile");
  },
};
