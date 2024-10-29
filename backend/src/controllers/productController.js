import Category from "../models/Category.js";
import Product from "../models/Product.js";

// creating new Product
export const createProduct = async (req, res) => {
  const receivedKeys = Object.keys(req.body); // collecting keys to count

  // ignoring empty body
  if (receivedKeys.length === 0)
    return res.status(400).json({ message: "No parameters in body." });

  // we are expecting not more than 6 parameters
  if (receivedKeys.length > 6)
    return res
      .status(400)
      .json({ message: "Too many parameters. Not more than 6 are expected." });

  // we are expecting not less than 5 parameters
  if (receivedKeys.length < 5)
    return res
      .status(400)
      .json({ message: "Not enough parameters. Should be min. 5." });

  // parameters are strictly defined
  const allowedParams = [
    "name",
    "description",
    "price",
    "quantity",
    "categoryId",
    "imagePath",
  ];

  // if there is smth else...
  const isBodyValid = receivedKeys.every(function (key) {
    return allowedParams.includes(key);
  });

  // ...BAD REQUEST
  if (!isBodyValid)
    return res.status(400).json({ message: "Invalid parameters in body" });

  // collecting body parameters
  const { name, description, price, quantity, categoryId, imagePath } =
    req.body;

  // if name is missing
  if (name === undefined || name === null)
    return res.status(400).json({ message: "Parameter 'name' is missing" });

  // if description is missing
  if (description === undefined || description === null)
    return res
      .status(400)
      .json({ message: "Parameter 'description' is missing" });

  // if quantity is missing
  if (quantity === undefined || quantity === null)
    return res.status(400).json({ message: "Parameter 'quantity' is missing" });

  // if price is missing
  if (price === undefined || price === null)
    return res.status(400).json({ message: "Parameter 'price' is missing" });

  // if categoryId is missing
  if (categoryId === undefined || categoryId === null)
    return res
      .status(400)
      .json({ message: "Parameter 'categoryId' is missing" });

  // validation of body parameters
  if (typeof price !== "number")
    return res
      .status(400)
      .json({ message: "Body parameter 'price' must be a number." });

  if (price <= 0)
    return res
      .status(400)
      .json({ message: "Body parameter 'price' must be > 0." });

  if (typeof quantity !== "number")
    return res
      .status(400)
      .json({ message: "Body parameter 'quantity' must be a number." });

  if (quantity < 0)
    return res
      .status(400)
      .json({ message: "Body parameter 'quantity' must be > 0." });

  if (!Number.isInteger(quantity))
    return res.status(400).json({ message: "Quantity must be an Integer." });

  if (typeof name !== "string")
    return res
      .status(400)
      .json({ message: "Body parameter 'name' must be a string." });

  if (typeof description !== "string")
    return res
      .status(400)
      .json({ message: "Body parameter 'description' must be a string." });

  if (typeof categoryId !== "string")
    return res
      .status(400)
      .json({ message: "Body parameter 'categoryId' must be a string." });

  // optional parameter
  if (imagePath !== undefined && typeof imagePath !== "string")
    return res
      .status(400)
      .json({ message: "Body parameter 'imagePath' must be a string." });

  try {
    const category = await Category.findById(params.categoryId);

    if (!category)
      return res
        .status(400)
        .json({ message: "Invalid categoryId. Category not exists." });

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
    // error code for duplicated data
    if (error.code === 11000)
      return res.status(400).json({
        message: "Product name must be unique.",
        additionalInfo: error.message,
      });

    if (error.name === "ValidationError")
      return res.status(400).json({ message: error.message });

    res.status(500).json({ message: error.message });
  }
};

// Getting all the products from db (both, in stock and ended)
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products.length)
      return res.status(200).json({ message: "No products in db" });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Getting just products that are in stock
export const getActualProducts = async (req, res) => {
  try {
    const products = await Product.find({ isEnded: false }); // flag for being in stock
    if (!products.length)
      return res.status(200).json({ message: "No products in stock" });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Getting info about one particular product
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).populate("categoryId");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    if (error.name === "CastError")
      return res
        .status(400)
        .json({ message: "Invalid productId", additionalInfo: error.message });

    res.status(500).json({ message: error.message });
  }
};

// Updating one particular product
export const fullUpdateProductById = async (req, res) => {
  const receivedKeys = Object.keys(req.body); // collecting keys to count

  // ignoring empty body
  if (receivedKeys.length === 0)
    return res.status(400).json({ message: "No parameters in body." });

  // we are expecting not more than 6 parameters
  if (receivedKeys.length > 6)
    return res
      .status(400)
      .json({ message: "Too many parameters. Not more than 6 are expected." });

  // we are expecting not less than 5 parameters
  if (receivedKeys.length < 5)
    return res
      .status(400)
      .json({ message: "Not enough parameters. Should be min. 5." });

  // parameters are strictly defined
  const allowedParams = [
    "name",
    "description",
    "price",
    "quantity",
    "categoryId",
    "imagePath",
  ];

  // if there is smth else...
  const isBodyValid = receivedKeys.every(function (key) {
    return allowedParams.includes(key);
  });

  // ...BAD REQUEST
  if (!isBodyValid)
    return res.status(400).json({ message: "Invalid parameters in body" });

  // collecting body parameters
  const { name, description, price, quantity, categoryId, imagePath } =
    req.body;

  // if name is missing
  if (name === undefined || name === null)
    return res.status(400).json({ message: "Parameter 'name' is missing" });

  // if description is missing
  if (description === undefined || description === null)
    return res
      .status(400)
      .json({ message: "Parameter 'description' is missing" });

  // if quantity is missing
  if (quantity === undefined || quantity === null)
    return res.status(400).json({ message: "Parameter 'quantity' is missing" });

  // if price is missing
  if (price === undefined || price === null)
    return res.status(400).json({ message: "Parameter 'price' is missing" });

  // if categoryId is missing
  if (categoryId === undefined || categoryId === null)
    return res
      .status(400)
      .json({ message: "Parameter 'categoryId' is missing" });

  // validation of body parameters
  if (typeof price !== "number")
    return res
      .status(400)
      .json({ message: "Body parameter 'price' must be a number." });

  if (price <= 0)
    return res
      .status(400)
      .json({ message: "Body parameter 'price' must be > 0." });

  if (typeof quantity !== "number")
    return res
      .status(400)
      .json({ message: "Body parameter 'quantity' must be a number." });

  if (quantity < 0)
    return res
      .status(400)
      .json({ message: "Body parameter 'quantity' must be > 0." });

  if (!Number.isInteger(quantity))
    return res.status(400).json({ message: "Quantity must be an Integer." });

  if (typeof name !== "string")
    return res
      .status(400)
      .json({ message: "Body parameter 'name' must be a string." });

  if (typeof description !== "string")
    return res
      .status(400)
      .json({ message: "Body parameter 'description' must be a string." });

  if (typeof categoryId !== "string")
    return res
      .status(400)
      .json({ message: "Body parameter 'categoryId' must be a string." });

  // optional parameter
  if (imagePath !== undefined && typeof imagePath !== "string")
    return res
      .status(400)
      .json({ message: "Body parameter 'imagePath' must be a string." });

  const { id } = req.params;

  const params = req.body;

  try {
    const category = await Category.findById(params.categoryId);

    if (!category)
      return res
        .status(400)
        .json({ message: "Invalid categoryId. Category not exists." });

    const updatedProduct = await Product.findByIdAndUpdate(id, params, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Product successfully updated", updatedProduct });
  } catch (error) {
    // error code for duplicated data
    if (error.code === 11000)
      return res.status(400).json({
        message: "Product name must be unique.",
        additionalInfo: error.message,
      });

    if (error.name === "ValidationError")
      return res.status(400).json({ message: error.message });

    // invalid id
    if (error.name === "CastError")
      return res
        .status(400)
        .json({ message: "Invalid productId", additionalInfo: error.message });

    res.status(500).json({ message: error.message });
  }
};

// Deleting one particular product
export const deleteProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    // invalid id
    if (error.name === "CastError")
      return res
        .status(400)
        .json({ message: "Invalid productId", additionalInfo: error.message });

    res.status(500).json({ message: error.message });
  }
};

// partial updating 1 particular product
export const partialUpdateProductById = async (req, res) => {
  const receivedKeys = Object.keys(req.body); // collecting keys to count

  // ignoring empty body
  if (receivedKeys.length === 0)
    return res.status(400).json({ message: "No parameters in body." });

  // we are expecting not more than 6 parameters
  if (receivedKeys.length > 6)
    return res
      .status(400)
      .json({ message: "Too many parameters. Not more than 6 are expected." });

  // parameters are strictly defined
  const allowedParams = [
    "name",
    "description",
    "price",
    "quantity",
    "categoryId",
    "imagePath",
  ];

  // if there is smth else...
  const isBodyValid = receivedKeys.every(function (key) {
    return allowedParams.includes(key);
  });

  // ...BAD REQUEST
  if (!isBodyValid)
    return res.status(400).json({ message: "Invalid parameters in body" });

  const params = req.body;

  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // looking for changes
    let changesControl = [];

    // if name exists => check the type
    if (params.name !== undefined) {
      if (typeof params.name !== "string")
        return res
          .status(400)
          .json({ message: "Body parameter 'name' must be a string." });

      if (product.name !== params.name) {
        await product.updateName(params.name);
        changesControl.push("Product name updated.");
      } else
        changesControl.push("Product name didn't change. Same value entered.");
    }

    // if description => check the type
    if (params.description !== undefined) {
      if (typeof params.description !== "string")
        return res
          .status(400)
          .json({ message: "Body parameter 'description' must be a string." });

      if (product.description !== params.description) {
        await product.updateDescription(params.description);
        changesControl.push("Product description updated.");
      } else
        changesControl.push(
          "Product description didn't change. Same value entered."
        );
    }

    // if price => check the type
    if (params.price !== undefined) {
      if (typeof params.price !== "number")
        return res
          .status(400)
          .json({ message: "Body parameter 'price' must be a number." });

      if (params.price <= 0)
        return res
          .status(400)
          .json({ message: "Body parameter 'price' must be > 0." });

      if (product.price !== params.price) {
        await product.updatePrice(params.price);
        changesControl.push("Product price updated.");
      } else
        changesControl.push("Product price didn't change. Same value entered.");
    }

    // if quantity => check the type
    if (params.quantity !== undefined) {
      if (typeof params.quantity !== "number")
        return res
          .status(400)
          .json({ message: "Body parameter 'quantity' must be a number." });

      if (params.quantity < 0)
        return res
          .status(400)
          .json({ message: "Body parameter 'quantity' must be >= 0." });

      if (!Number.isInteger(params.quantity))
        return res
          .status(400)
          .json({ message: "Quantity must be an Integer." });

      if (product.quantity !== params.quantity) {
        await product.updateQuantity(params.quantity);
        changesControl.push("Product quantity updated.");
      } else
        changesControl.push(
          "Product quantity didn't change. Same value entered."
        );
    }

    // if categoryId => check the type
    if (params.categoryId !== undefined) {
      if (typeof params.categoryId !== "string")
        return res
          .status(400)
          .json({ message: "Body parameter 'categoryId' must be a string." });

      if (product.categoryId.toString() !== params.categoryId) {
        const category = await Category.findById(params.categoryId);

        if (!category)
          return res
            .status(400)
            .json({ message: "Invalid categoryId. Category not exists." });

        await product.updateCategoryId(params.categoryId);

        changesControl.push("categoryId updated. ");
      } else
        changesControl.push("categoryId didn't change. Same value entered.");
    }

    // if imagePath => check the type
    if (params.imagePath !== undefined) {
      if (typeof params.imagePath !== "string")
        return res
          .status(400)
          .json({ message: "Body parameter 'imagePath' must be a string." });

      if (product.imagePath !== params.imagePath) {
        await product.updateImagePath(params.imagePath);
        changesControl.push("imagePath updated. ");
      } else
        changesControl.push("imagePath didn't change. Same value entered.");
    }

    res.status(200).json({ messages: changesControl, product });
  } catch (error) {
    // error code for duplicated data
    if (error.code === 11000)
      return res.status(400).json({
        message: "Product name must be unique.",
        additionalInfo: error.message,
      });

    if (error.name === "ValidationError")
      return res.status(400).json({ message: error.message });

    // invalid id
    if (error.name === "CastError")
      return res
        .status(400)
        .json({ message: "Invalid Id", additionalInfo: error.message });

    res.status(500).json({ message: error.message });
  }
};

// increasing quantity of 1 particular product
export const increaseProductQuantity = async (req, res) => {
  const receivedKeys = Object.keys(req.body); // collecting keys to count

  // ignoring empty body
  if (receivedKeys.length === 0)
    return res.status(400).json({ message: "No parameters in body." });

  // we are expecting only 1 parameter
  if (receivedKeys.length > 1)
    return res
      .status(400)
      .json({ message: "Too many parameters. Only 'amount' is expected." });

  const { id } = req.params;
  const { amount } = req.body;

  // if amount is missing
  if (amount === undefined || amount === null)
    return res.status(400).json({ message: "Amount is missing" });

  // if it is not a number
  if (typeof amount !== "number")
    return res
      .status(400)
      .json({ message: "Body parameter 'amount' must be a number." });

  if (amount <= 0)
    return res
      .status(400)
      .json({ message: "The increasing amount must be > 0" });

  if (!Number.isInteger(amount))
    return res.status(400).json({ message: "Amount must be an Integer." });

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.increaseQuantity(amount);

    res.status(200).json({ message: "Product quantity increased", product });
  } catch (error) {
    if (error.name === "ValidationError")
      return res.status(400).json({ message: error.message });

    // invalid id
    if (error.name === "CastError")
      return res
        .status(400)
        .json({ message: "Invalid productId", additionalInfo: error.message });

    res.status(500).json({ message: error.message });
  }
};

// decreasing quantity of 1 particular product
export const decreaseProductQuantity = async (req, res) => {
  const receivedKeys = Object.keys(req.body); // collecting keys to count

  // ignoring empty body
  if (receivedKeys.length === 0)
    return res.status(400).json({ message: "No parameters in body." });

  // we are expecting only 1 parameter
  if (receivedKeys.length > 1)
    return res
      .status(400)
      .json({ message: "Too many parameters. Only 'amount' is expected." });

  const { id } = req.params;
  const { amount } = req.body;

  // if amount is missing
  if (amount === undefined || amount === null)
    return res.status(400).json({ message: "Amount is missing" });

  // if it is not a number
  if (typeof amount !== "number")
    return res
      .status(400)
      .json({ message: "Body parameter 'amount' must be a number." });

  if (amount <= 0)
    return res
      .status(400)
      .json({ message: "The increasing amount must be > 0" });

  if (!Number.isInteger(amount))
    return res.status(400).json({ message: "Amount must be an Integer." });

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.isEnded)
      return res
        .status(400)
        .json({ message: "Product's quantity didn't change. Out of stock." });

    if (amount > product.quantity)
      return res.status(400).json({
        message:
          "Product's quantity didn't change. Not enough products in stock.",
      });

    const result = await product.decreaseQuantity(amount);

    return res
      .status(200)
      .json({ message: "Product quantity decreased", product });
  } catch (error) {
    if (
      error.message.includes("didn't change") ||
      error.name === "ValidationError"
    )
      return res.status(400).json({ message: error.message });

    res.status(500).json({ message: error.message });
  }
};

