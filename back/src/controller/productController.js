const Product = require("../models/Product");
const { createProductSchema, updateProductSchema } = require("../validation/productValidation");

// Helper to normalize formData payload before validation
const normalizeProductBody = (body) => {
  const data = { ...body };
  if (typeof data.sizes === "string") {
    try {
      data.sizes = JSON.parse(data.sizes);
    } catch (e) {
      // let Joi catch validation error
    }
  }
  if (typeof data.colors === "string") {
    try {
      data.colors = JSON.parse(data.colors);
    } catch (e) {
      // If it's a comma-separated string
      data.colors = data.colors.split(",").map((c) => c.trim()).filter(Boolean);
    }
  }
  if (data.price !== undefined && data.price !== null) {
    data.price = Number(data.price);
  }
  if (data.discountPrice !== undefined && data.discountPrice !== null) {
    data.discountPrice = Number(data.discountPrice);
  }
  return data;
};

// @desc    Create product (ADMIN ONLY)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const normalizedData = normalizeProductBody(req.body);
    const { error, value } = createProductSchema.validate(normalizedData);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const images = req.files ? req.files.map((file) => `/image/${file.filename}`) : [];

    const totalStock = (value.sizes || []).reduce(
      (sum, s) => sum + Number(s.stock || 0),
      0
    );

    const product = await Product.create({
      ...value,
      images,
      totalStock,
      createdBy: req.admin._id,
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all products (public — with basic filtering)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, search, all } = req.query;
    const filter = {};
    if (all !== "true") {
      filter.isActive = true;
    }

    if (category && category !== "All") filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.name = { $regex: search, $options: "i" };

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product by id
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// @desc    Update product (ADMIN ONLY)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const normalizedData = normalizeProductBody(req.body);
    const { error, value } = updateProductSchema.validate(normalizedData);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.files && req.files.length > 0) {
      value.images = req.files.map((file) => `/image/${file.filename}`);
    }

    if (value.sizes) {
      value.totalStock = value.sizes.reduce(
        (sum, s) => sum + Number(s.stock || 0),
        0
      );
    }

    Object.assign(product, value);
    await product.save();

    res.json(product);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete product (ADMIN ONLY)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product removed successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};