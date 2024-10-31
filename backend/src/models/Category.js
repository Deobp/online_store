import mongoose from "mongoose";
import { CATEGORY_DESCRIPTION_REGEX, CATEGORY_NAME_REGEX } from "../utils/regEx.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        CATEGORY_NAME_REGEX,
        "Name can only contain English letters, numbers, spaces, hyphens and underscores",
      ],
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    description: {
      type: String,
      trim: true,
      match: [
        CATEGORY_DESCRIPTION_REGEX,
        "Description can only contain English letters and basic punctuation",
      ],
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "No description.",
    },
  },

  {
    collation: { locale: "en", strength: 2 }, // TeXt = text
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

categorySchema.methods.updateName = async function (newName) {
  this.name = newName;

  return await this.save();
};

categorySchema.methods.updateDescription = async function (newDescription) {
  this.description = newDescription;

  return await this.save();
};

categorySchema.methods.deleteCategory = async function () {
  return await this.remove();
};

categorySchema.statics.findByName = async function (name) {
  return await this.findOne({ name: name });
};

categorySchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "categoryId",
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
