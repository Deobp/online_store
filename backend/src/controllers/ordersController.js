import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// getting all orders fron db
export async function getAllOrders(req, res, next) {
  try {
    const orders = await Order.find({});
    if (orders.length === 0)
      return res.status(404).json({ message: "No orders found" });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// get one particular order
export async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (order) {
      if (req.user.id !== order.userId || req.user.role !== "admin")
        return res.status(401).json({
          message: "Access denied, you are not admin or this is not your order",
        });
    }

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    // invalid id
    if (error.name === "CastError")
      return res
        .status(400)
        .json({ message: "Invalid orderId", additionalInfo: error.message });

    res.status(500).json({ message: error.message });
  }
}

// creating new order
export async function createOrder(req, res, next) {
  try {
    const receivedKeys = Object.keys(req.body); // collecting keys to count

    // body is not allowed
    if (receivedKeys.length !== 0)
      return res.status(400).json({ message: "Body is not allowed." });

    let userId = req.params.id;

    if (userId === "me") userId = req.user.id;

    if (req.user.id !== userId) {
      if (req.user.role !== "admin")
        return res.status(403).json({
          message: "Access denied, you are not admin or this is not your data.",
        });
    }

    const user = await User.findById(userId).populate("cart.productId");

    if (!user) return res.status(400).json({ message: "User not found." });

    if (user.cart.length === 0)
      return res.status(400).json({ message: "User's cart is empty." });

    const products = [];
    let totalPrice = 0;
    for (const item of user.cart) {
      products.push({
        productId: item.productId._id,
        priceAtPurchase: item.productId.price,
        quantity: item.quantity,
      });

      totalPrice += item.productId.price * item.quantity;
    }

    const newOrder = Order({ userId, products, totalPrice });
    await newOrder.save();
    await user.clearCart();

    // stealing products from stock
    for (const item of newOrder.products) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      await product.decreaseQuantity(item.quantity);
    }

    res
      .status(201)
      .json({ message: "New order successfully created.", newOrder });
  } catch (error) {
    // invalid id
    if (error.name === "CastError")
      return res
        .status(400)
        .json({ message: "Invalid userId", additionalInfo: error.message });

    res.status(500).json({ message: error.message });
  }
}

// updating order's status
export async function updateStatus(req, res, next) {
  try {
    const receivedKeys = Object.keys(req.body); // collecting keys to count

    // ignoring empty body
    if (receivedKeys.length === 0)
      return res.status(400).json({ message: "No parameters in body." });

    // we are expecting not more than 1 parameters
    if (receivedKeys.length > 1)
      return res.status(400).json({
        message: "Too many parameters. Only 'status' is expected.",
      });

    const { id } = req.params;
    const { status } = req.body;

    // if status is missing
    if (status === undefined || status === null)
      return res.status(400).json({ message: "Status is missing" });

    // if it is not a string
    if (typeof status !== "string")
      return res
        .status(400)
        .json({ message: "Body parameter 'status' must be a string." });

    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    switch (order.status) {
      case "pending":
        if (status === "shipping") {
          await order.updateStatus(status);
          await order.save();
          return res
            .status(200)
            .json({ message: "Status updated to 'shipping'", order });
        } else if (status === "cancelled") {
          for (const item of order.products) {
            const product = await Product.findById(item.productId);
            if (!product)
              return res.status(404).json({ message: "Product not found" });
            await product.increaseQuantity(item.quantity);
          }
          await order.updateStatus(status);
          await order.save();
          return res
            .status(200)
            .json({ message: "Status updated to 'cancelled'", order });
        } else {
          return res.status(400).json({ message: "Incorrect status" });
        }

      case "shipping":
        if (status === "completed") {
          await order.updateStatus(status);
          await order.save();
          return res
            .status(200)
            .json({ message: "Status updated to 'completed'", order });
        } else {
          return res.status(400).json({ message: "Incorrect status" });
        }

      default:
        return res.status(400).json({ message: "Incorrect status" });
    }
  } catch (error) {
    // invalid id
    if (error.name === "CastError")
      return res
        .status(400)
        .json({ message: "Invalid id", additionalInfo: error.message });

    res.status(500).json({ message: error.message });
  }
}

// deleting order
export async function deleteOrder(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) res.status(400).json({ message: "Order ID is missing" });

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) res.status(404).json({ message: "Order not found" });

    res.status(204).send();
  } catch (error) {
    // invalid id
    if (error.name === "CastError")
      return res
        .status(400)
        .json({ message: "Invalid orderId", additionalInfo: error.message });

    res.status(500).json({ message: error.message });
  }
}
