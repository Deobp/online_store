import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { UserError } from "../utils/errors.js";

// creating new Product
export const createProduct = async (req, res, next) => {
  // collecting body parameters
  const { name, description, price, quantity, categoryId, imagePath } =
    req.body;

  try {
    const category = await Category.findById(categoryId);

    if (!category)
      return next(new UserError("Category with this id not found.", 404));

    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
      categoryId,
      imagePath,
    });

    const savedProduct = await newProduct.save();

    res
      .status(201)
      .json({ message: "New product successfully created.", savedProduct });
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
};

// Getting all the products from db (both, in stock and ended)
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    if (!products.length)
      return res.status(200).json({ message: "No products in db." });

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// Getting just products that are in stock
export const getActualProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isEnded: false }); // flag for being in stock
    if (!products.length)
      return res.status(200).json({ message: "No products in stock." });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// Getting info about one particular product
export const getProductById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).populate("categoryId");
    if (!product) {
      return next(new UserError("Product not found.", 404));
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// Updating one particular product
export const fullUpdateProductById = async (req, res, next) => {
  const { id } = req.params;

  const params = req.body;

  try {
    const category = await Category.findById(params.categoryId);

    if (!category)
      return next(
        new UserError(
          "Invalid body parameter 'categoryId'. The category doesn't exist.",
          404
        )
      );

    const updatedProduct = await Product.findByIdAndUpdate(id, params, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return next(new UserError("Product not found.", 404));
    }

    res
      .status(200)
      .json({ message: "Product successfully updated", updatedProduct });
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
};

// Deleting one particular product
export const deleteProductById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return next(new UserError("Product not found.", 404));
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// partial updating 1 particular product
export const partialUpdateProductById = async (req, res) => {
  const params = req.body;

  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // looking for changes
    let changesControl = [];

    // if name exists =>
    if (params.name !== undefined) {
      if (product.name !== params.name) {
        await product.updateName(params.name);
        changesControl.push("Product's name updated.");
      } else
        changesControl.push(
          "Product's name didn't change. Same value entered."
        );
    }

    // if description =>
    if (params.description !== undefined) {
      if (product.description !== params.description) {
        await product.updateDescription(params.description);
        changesControl.push("Product's description updated.");
      } else
        changesControl.push(
          "Product's description didn't change. Same value entered."
        );
    }

    // if price =>
    if (params.price !== undefined) {
      if (product.price !== params.price) {
        await product.updatePrice(params.price);
        changesControl.push("Product's price updated.");
      } else
        changesControl.push(
          "Product's price didn't change. Same value entered."
        );
    }

    // if quantity =>
    if (params.quantity !== undefined) {
      if (product.quantity !== params.quantity) {
        await product.updateQuantity(params.quantity);
        changesControl.push("Product's quantity updated.");
      } else
        changesControl.push(
          "Product's quantity didn't change. Same value entered."
        );
    }

    // if categoryId =>
    if (params.categoryId !== undefined) {
      if (product.categoryId.toString() !== params.categoryId) {
        const category = await Category.findById(params.categoryId);

        if (!category)
          return res
            .status(404)
            .json({ message: "Invalid categoryId. Category not exists." });

        await product.updateCategoryId(params.categoryId);

        changesControl.push("categoryId updated.");
      } else
        changesControl.push("categoryId didn't change. Same value entered.");
    }

    // if imagePath =>
    if (params.imagePath !== undefined) {
      if (product.imagePath !== params.imagePath) {
        await product.updateImagePath(params.imagePath);
        changesControl.push("imagePath updated. ");
      } else
        changesControl.push("imagePath didn't change. Same value entered.");
    }

    res.status(200).json({ messages: changesControl, product });
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
};

// increasing quantity of 1 particular product
export const increaseProductQuantity = async (req, res, next) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return next(new UserError("Product not found.", 404));
    }

    await product.increaseQuantity(amount);

    res.status(200).json({ message: "Product quantity increased", product });
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
};

// decreasing quantity of 1 particular product
export const decreaseProductQuantity = async (req, res, next) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return next(new UserError("Product not found.", 404));
    }

    if (product.isEnded)
      return next(
        new UserError("Product's quantity didn't change. Out of stock.")
      );

    if (amount > product.quantity)
      return next(
        new UserError(
          "Product's quantity didn't change. Not enough products in stock."
        )
      );

    const result = await product.decreaseQuantity(amount);

    return res
      .status(200)
      .json({ message: "Product quantity decreased", product });
  } catch (error) {
    // validation error from mongo
    if (error.name === "ValidationError")
      return next(new UserError(error.message));

    next(error);
  }
};
