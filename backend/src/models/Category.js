import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (value) {
          //letters, numbers, spaces, hyphens, and underscores =>
          return /^[a-zA-Z0-9-_ ]+$/.test(value);
        },
        message:
          "Category name can only contain letters, numbers, spaces, hyphens, and underscores.",
      },
    },

    description: {
      type: String,
      trim: true,
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
