import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        priceAtPurchase: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "shipping", "completed", "cancelled"],
      default: "pending",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collation: { locale: "en", strength: 2 },
  }
);

orderSchema.virtual("totalQuantity").get(function () {
  return this.products.reduce((acc, product) => acc + product.quantity, 0);
});

orderSchema.methods.updateStatus = async function (newStatus) {
  const validStatuses = ["pending", "shipping", "completed", "cancelled"];

  if (validStatuses.includes(newStatus)) {
    this.status = newStatus;
    return await this.save();
  } else {
    return { message: "Invalid status." };
  }
};

orderSchema.methods.addProduct = async function (productId, quantity) {
  const product = await mongoose.model("Product").findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.quantity < quantity) {
    throw new Error("Insufficient stock available");
  }

  const productIndex = this.products.findIndex(
    (p) => p.productId.toString() === productId.toString()
  );

  if (productIndex !== -1) {
    this.products[productIndex].quantity += quantity;
  } else {
    this.products.push({
      productId,
      quantity,
      priceAtPurchase: product.price,
    });
  }

  await product.decreaseQuantity(quantity);

  return await this.save();
};

orderSchema.methods.removeProduct = async function (productId, quantity) {
  const product = await mongoose.model("Product").findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const productIndex = this.products.findIndex(
    (p) => p.productId.toString() === productId.toString()
  );

  if (productIndex !== -1) {
    this.products.increaseQuantity(quantity);
  } else {
    return { message: "Product not found in the order." };
  }

  if (this.product[productIndex].quantity < 1) {
    this.products = this.products.filter((item) => {
      if (String(productId) !== String(item.productId)) {
        return item;
      }
    });
  }

  return await this.save();
};

orderSchema.pre("save", async function (next) {
  let total = 0;
  for (let product of this.products) {
    const productItem = await mongoose
      .model("Product")
      .findById(product.productId);
    if (productItem) {
      product.priceAtPurchase = productItem.price;
      total += productItem.price * product.quantity;
    }
  }
  this.totalPrice = total;
  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
