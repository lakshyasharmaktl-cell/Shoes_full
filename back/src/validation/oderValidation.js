const Joi = require("joi");

const orderItemSchema = Joi.object({
  product: Joi.string().required(),
  name: Joi.string().required(),
  size: Joi.number().required(),
  quantity: Joi.number().min(1).required(),
  price: Joi.number().min(0).required(),
});

const createOrderSchema = Joi.object({
  customer: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
  }).required(),
  shippingAddress: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().required(),
  }).required(),
  items: Joi.array().items(orderItemSchema).min(1).required(),
  totalAmount: Joi.number().min(0).required(),
  paymentMethod: Joi.string().valid("COD", "ONLINE").optional(),
});

const updateOrderStatusSchema = Joi.object({
  orderStatus: Joi.string()
    .valid("Placed", "Processing", "Shipped", "Delivered", "Cancelled")
    .required(),
});

module.exports = { createOrderSchema, updateOrderStatusSchema };