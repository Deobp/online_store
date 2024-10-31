import Category from "../models/Category.js";
import { UserError } from "../utils/errors.js";

// Getting all categories
export async function getAllCategories(req, res, next) {
  try {
    const categories = await Category.find();

    if (categories.length === 0)
      return res
        .status(200)
        .json({ message: "List of categories is empty.", categories });

    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
}

// Get info about 1 particular category
export async function getCategoryById(req, res, next) {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);

    if (!category) return next(new UserError("Category not found.", 404));

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
}

// Creating category
export async function createCategory(req, res, next) {
  try {
    const { name, description } = req.body;

    const newCategory = Category({ name, description });

    const result = await newCategory.save();

    res
      .status(201)
      .json({ message: "The new category added successfully", result });
  } catch (error) {
    // validation error from mongo
    if (error.name === "ValidationError")
      return next(new UserError(error.message));

    // duplicate value error from mongo
    if (error.code === 11000)
      return next(
        new UserError("Duplicate value. Body parameter 'name' must be unique.")
      );

    next(error);
  }
}

// full updating 1 particular category
export const fullUpdateCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const params = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(id, params, {
      new: true,
      runValidators: true,
    });

    if (!updatedCategory) {
      return next(new UserError("Category not found.", 404));
    }

    res
      .status(200)
      .json({ message: "Category successfully updated", updatedCategory });
  } catch (error) {
    // error code for duplicated data (mongo)
    if (error.code === 11000)
      return next(
        new UserError("Duplicate value. Body parameter 'name' must be unique.")
      );

    // validation error from mongo
    if (error.name === "ValidationError")
      return next(new UserError(error.message));

    next(error);
  }
};

// partial updating 1 particular category
export const partialUpdateCategoryById = async (req, res) => {
  try {
    const params = req.body;

    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) return next(new UserError("Category not found.", 404));

    let changesControl = [];

    // if name exists => check for changes
    if (params.name !== undefined) {
      if (category.name.trim() !== params.name.trim()) {
        await category.updateName(params.name);

        changesControl.push("Category name updated.");
      } else
        changesControl.push("Category name didn't change. Same value entered.");
    }

    // if description exists => check for changes
    if (params.description !== undefined) {
      if (category.description.trim() !== params.description.trim()) {
        await category.updateDescription(params.description);

        changesControl.push("Category description updated.");
      } else
        changesControl.push(
          "Category description didn't change. Same value entered."
        );
    }

    res.status(200).json({ message: changesControl, category });
  } catch (error) {
    // error code for duplicated data (mongo)
    if (error.code === 11000)
      return next(
        new UserError("Duplicate value. Body parameter 'name' must be unique.")
      );

    // validation error from mongo
    if (error.name === "ValidationError")
      return next(new UserError(error.message));

    next(error);
  }
};

// Deleting 1 category
export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Category ID is missing" });

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory)
      return res.status(404).json({ message: "Category not found" });

    res.status(204).send();
  } catch (error) {
    // invalid id - mongo error
    if (error.name === "CastError")
      return next(new UserError("Invalid route parameter ':id'."));

    next(error);
  }
}

// Getting list of products from 1 category
export async function getProductsByCategoryId(req, res) {
  try {
    const category = await Category.findById(req.params.id).populate(
      "products"
    );

    res.json(category);
  } catch (error) {
    // invalid id - mongo error
    if (error.name === "CastError")
      return next(new UserError("Invalid route parameter ':id'."));

    next(error);
  }
}
