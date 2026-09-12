const Order = require("../models/Order");
const Product = require("../models/Product");
const { createOrderSchema, updateOrderStatusSchema } = require("../validation/oderValidation");

const createOrder = async (req, res, next) => {
  try {
    const { error } = createOrderSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    for (const item of req.body.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }
      const sizeEntry = product.sizes.find((s) => s.size === item.size);
      if (!sizeEntry || sizeEntry.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name} (size ${item.size})`,
        });
      }
    }

    const order = await Order.create(req.body);

    // Reduce stock after successful order
    for (const item of req.body.items) {
      await Product.updateOne(
        { _id: item.product, "sizes.size": item.size },
        { $inc: { "sizes.$.stock": -item.quantity, totalStock: -item.quantity } }
      );
    }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};


const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { error } = updateOrderStatusSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = req.body.orderStatus;
    await order.save();

    res.json(order);
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };