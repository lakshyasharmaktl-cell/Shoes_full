const Joi = require("joi");

const sizeSchema = Joi.object({
  size: Joi.number().required(),
  stock: Joi.number().min(0).required(),
});

const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(5).required(),
  brand: Joi.string().optional(),
  category: Joi.string().required(),
  price: Joi.number().min(0).required(),
  discountPrice: Joi.number().min(0).optional(),
  sizes: Joi.array().items(sizeSchema).min(1).required(),
  colors: Joi.array().items(Joi.string()).optional(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().min(5),
  brand: Joi.string(),
  category: Joi.string(),
  price: Joi.number().min(0),
  discountPrice: Joi.number().min(0),
  sizes: Joi.array().items(sizeSchema),
  colors: Joi.array().items(Joi.string()),
  isActive: Joi.boolean(),
});

module.exports = { createProductSchema, updateProductSchema };