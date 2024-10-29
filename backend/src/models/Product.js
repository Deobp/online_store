import mongoose from "mongoose";

const nameRegEx = /^[A-Za-z0-9][A-Za-z0-9\s&,.()/-]*[A-Za-z0-9).]$/; // letters, numbers, spaces, &, comma, dot, brackets, hyphen
const descrRegEx =
  /^[A-Za-z0-9][A-Za-z0-9\s,.!?()&$#@%*+\-"':]*[A-Za-z0-9.!?)]$/; // letters, numbers, spaces, punctuation marks, quotes, special chars like @#$%
const imagePathRegEx =
  /^(https?:\/\/[\w-]+\.[\w-]+\.|\/)?[\w/-]+\.(png|jpg|jpeg)$/i;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      match: [
        nameRegEx,
        "Only english letters, numbers, spaces, quotes and '-' allowed.",
      ],
      minlength: [3, "Name should be equal or more than 3 letters."],
      maxlength: [100, "Name shouldn't be more than 100 letters."],
      trim: true,
    },
    description: {
      type: String,
      required: true,
      match: [
        descrRegEx,
        "Only english letters, spaces, quotes and '-' allowed.",
      ],
      minlength: [10, "Description should be equal or more than 10 letters."],
      maxlength: [1000, "Description shouldn't be more than 1000 letters."],
      trim: true,
    },
    imagePath: {
      type: String,
      required: true,
      match: [imagePathRegEx, "Only PNG, JPG, JPEG files allowed."],
      default: "/img/products/default.png",
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0.01,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Value must be an integer",
      },
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isEnded: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    collation: { locale: "en", strength: 2 }, // TeXt = text
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.methods.updateName = async function (newName) {
  this.name = newName;

  return await this.save();
};

productSchema.methods.updateDescription = async function (newDescription) {
  this.description = newDescription;

  return await this.save();
};

productSchema.methods.updatePrice = async function (newPrice) {
  this.price = newPrice;

  return await this.save();
};

productSchema.methods.updateQuantity = async function (newQuantity) {
  if (newQuantity === 0) this.isEnded = true;

  if (this.quantity === 0) this.isEnded = false;

  this.quantity = newQuantity;

  return await this.save();
};

productSchema.methods.increaseQuantity = async function (amount) {
  return await this.updateQuantity(this.quantity + amount);
};

productSchema.methods.decreaseQuantity = async function (amount) {
  amount = parseInt(amount);

  return await this.updateQuantity(this.quantity - amount);
};

productSchema.methods.updateCategoryId = async function (newCategoryId) {
  this.categoryId = newCategoryId;

  return await this.save();
};

productSchema.methods.updateImagePath = async function (newImagePath) {
  this.imagePath = newImagePath;

  return await this.save();
};

const Product = mongoose.model("Product", productSchema);

export default Product;
