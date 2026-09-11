const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct, 
  deleteProduct,
} = require("../controller/productController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const upload = require("../utils/uploadImage");

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin only routes — add / update / delete
router.post(
  "/",
  protect,
  authorizeRoles("admin", "superadmin"),
  upload.array("images", 5),
  createProduct
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "superadmin"),
  upload.array("images", 5),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "superadmin"),
  deleteProduct
);

module.exports = router;