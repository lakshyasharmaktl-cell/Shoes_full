/**
 * Restricts route access to specific roles.
 * Usage: router.post("/", protect, authorizeRoles("admin", "superadmin"), createProduct)
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin || !allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({
        message: `Access denied. Requires role: ${allowedRoles.join(" or ")}`,
      });
    }
    next();
  };
};

module.exports = { authorizeRoles };