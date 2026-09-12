const express = require("express");
const router = express.Router();
const {
  registerUser,
  verifyOtp,
  resendOtp,
  loginUser,
  getUserProfile,
} = require("../controller/userController");
const { protectUser } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", loginUser);
router.get("/profile", protectUser, getUserProfile);

module.exports = router;