const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");
const { registerAdminSchema, loginAdminSchema } = require("../validation/adminValidation");

// @desc    Register a new admin (should be locked down / used once in real deployment)
// @route   POST /api/admin/register
// @access  Public (recommend: protect this route or disable after first superadmin is created)
const registerAdmin = async (req, res, next) => {
  try { 
    const { error } = registerAdminSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, password, role } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists with this email" });
    }

    const admin = await Admin.create({ name, email, password, role });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res, next) => {
  try {
    const { error } = loginAdminSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged-in admin profile
// @route   GET /api/admin/profile
// @access  Private
const getAdminProfile = async (req, res, next) => {
  try {
    res.json(req.admin);
  } catch (err) {
    next(err);
  }
};

module.exports = { registerAdmin, loginAdmin, getAdminProfile };