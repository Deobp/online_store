import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { UserError } from "../utils/errors.js";

// getting all orders fron db
export async function getAllOrders(req, res, next) {
  try {
    const orders = await Order.find({});
    if (orders.length === 0)
      return res.status(200).json({ message: "No orders in db." });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
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

    if (!order) return next(new UserError("Order not found.", 404));

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
}

// creating new order
export async function createOrder(req, res, next) {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).populate("cart.productId");

    if (!user) {
      return next(new UserError("User not found.", 404));
    }

    if (user.cart.length === 0) {
      return next(new UserError("User's cart is empty."));
    }

    const products = user.cart.map((item) => ({
      productId: item.productId._id,
      priceAtPurchase: item.productId.price,
      quantity: item.quantity,
    }));

    const totalPrice = products.reduce(
      (sum, item) => sum + item.priceAtPurchase * item.quantity,
      0
    );

    const newOrder = await Order.create({ userId, products, totalPrice });

    await user.clearCart();

    const bulkUpdates = products.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { quantity: -item.quantity } },
      },
    }));

    const bulkResult = await Product.bulkWrite(bulkUpdates);

    if (bulkResult.matchedCount < products.length) {
      return next(new UserError("Product not found.", 404));
    }

    res
      .status(201)
      .json({ message: "New order successfully created.", newOrder });
  } catch (error) {
    next(error);
  }
}

// updating order's status
export async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const isAdmin = req.userRole === "admin";

    const order = await Order.findById(id);

    if (!order) return next(new UserError("Order not found.", 404));

    if (req.user.id != order.userId.toString() && !isAdmin) {
      return next(new UserError("Access denied.", 403));
    }

    const validStatusTransitions = {
      admin: {
        pending: ["shipping", "cancelled"],
        shipping: ["completed"],
      },
      user: {
        pending: ["cancelled"],
      },
    };

    const allowedTransitions = isAdmin
      ? validStatusTransitions.admin[order.status]
      : validStatusTransitions.user[order.status];

    if (!allowedTransitions?.includes(status)) {
      return next(new UserError("Invalid status transition."));
    }

    if (status === "cancelled" && order.status === "pending") {
      for (const item of order.products) {
        const product = await Product.findById(item.productId);
        if (product) await product.increaseQuantity(item.quantity);
      }
    }

    // Update order status
    await order.updateStatus(status);

    res.status(200).json({ message: `Status updated to '${status}'`, order });
  } catch (error) {
    next(error);
  }
}

// deleting order
export async function deleteOrder(req, res, next) {
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) return next(new UserError("Order not found.", 404));

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
