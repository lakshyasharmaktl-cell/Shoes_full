const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controller/orderController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Public — customer places order
router.post("/", createOrder);

// Admin only — view & manage orders
router.get("/", protect, authorizeRoles("admin", "superadmin"), getOrders);
router.get("/:id", protect, authorizeRoles("admin", "superadmin"), getOrderById);
router.put("/:id/status", protect, authorizeRoles("admin", "superadmin"), updateOrderStatus);

module.exports = router;