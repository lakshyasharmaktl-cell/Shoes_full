const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");
const {
  registerUserSchema,
  loginUserSchema,
  verifyOtpSchema,
  resendOtpSchema,
} = require("../validation/userValidation");

const OTP_EXPIRY_MINUTES = 10;

const registerUser = async (req, res, next) => {
  try {
    const { error } = registerUserSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    let user;
    if (existingUser && !existingUser.isVerified) {
      existingUser.name = name;
      existingUser.password = password;
      existingUser.phone = phone;
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      user = await existingUser.save();
    } else {
      user = await User.create({ name, email, password, phone, otp, otpExpiry });
    }

    await sendEmail(
      user.email,
      "Verify your Shoe Store account",
      `<div style="font-family: sans-serif;">
        <h2>Welcome to Shoe Store, ${user.name}!</h2>
        <p>Your OTP for email verification is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>This OTP will expire in ${OTP_EXPIRY_MINUTES} minutes.</p>
      </div>`
    );

    res.status(201).json({
      message: "Registration successful. OTP sent to your email for verification.",
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { error } = verifyOtpSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "User already verified" });
    if (!user.otp || user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({
      message: "Email verified successfully. You can now log in.",
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id, "user"),
    });
  } catch (err) {
    next(err);
  }
};

const resendOtp = async (req, res, next) => {
  try {
    const { error } = resendOtpSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    await user.save();

    await sendEmail(
      user.email,
      "Your new OTP - Shoe Store",
      `<div style="font-family: sans-serif;">
        <h2>Hi ${user.name},</h2>
        <p>Your new OTP is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>This OTP will expire in ${OTP_EXPIRY_MINUTES} minutes.</p>
      </div>`
    );

    res.json({ message: "New OTP sent to your email" });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { error } = loginUserSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id, "user"),
    });
  } catch (err) {
    next(err);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, verifyOtp, resendOtp, loginUser, getUserProfile };