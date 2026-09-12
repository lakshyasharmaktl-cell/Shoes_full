const Joi = require("joi");

const customSizesParser = (value, helpers) => {
  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch (e) {
      return helpers.message('"sizes" must be a valid JSON array or list of sizes');
    }
  }
  if (!Array.isArray(parsed) || parsed.length === 0) {
    return helpers.message('"sizes" must contain at least 1 size');
  }
  for (const s of parsed) {
    if (s.size === undefined || s.stock === undefined || isNaN(Number(s.size)) || isNaN(Number(s.stock))) {
      return helpers.message('Each size in "sizes" must have numeric size and stock');
    }
  }
  return parsed.map((s) => ({ size: Number(s.size), stock: Number(s.stock) }));
};

const customColorsParser = (value, helpers) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      return value.split(",").map((c) => c.trim()).filter(Boolean);
    }
  }
  return [];
};

const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(5).required(),
  brand: Joi.string().allow("", null).optional(),
  category: Joi.string().required(),
  price: Joi.number().min(0).required(),
  discountPrice: Joi.number().min(0).allow(null, 0, "").optional(),
  sizes: Joi.custom(customSizesParser).required(),
  colors: Joi.custom(customColorsParser).optional(),
  isActive: Joi.boolean().optional(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().min(5).optional(),
  brand: Joi.string().allow("", null).optional(),
  category: Joi.string().optional(),
  price: Joi.number().min(0).optional(),
  discountPrice: Joi.number().min(0).allow(null, 0, "").optional(),
  sizes: Joi.custom(customSizesParser).optional(),
  colors: Joi.custom(customColorsParser).optional(),
  isActive: Joi.boolean().optional(),
});

module.exports = { createProductSchema, updateProductSchema };