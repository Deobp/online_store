import Category from "../models/Category.js";
import Product from "../models/Product.js";

// creating new Product
export const createProduct = async (req, res) => {
  const receivedKeys = Object.keys(req.body); // collecting keys to count

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

  if (typeof quantity !== "number")
    return res
      .status(400)
      .json({ message: "Body parameter 'quantity' must be a number." });

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

  if (typeof quantity !== "number")
    return res
      .status(400)
      .json({ message: "Body parameter 'quantity' must be a number." });

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

  const updates = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
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

// Updating quantity of one particular product
export async function updateProductQuantity(req, res, next) {
  const receivedKeys = Object.keys(req.body); // collecting keys to count

  // we are expecting only 1 parameter
  if (receivedKeys.length > 1)
    return res
      .status(400)
      .json({ message: "Too many parameters. Only 'quantity' is expected." });

  const { quantity } = req.body; // collecting data

  // if quantity is missing
  if (quantity === undefined || quantity === null)
    return res.status(400).json({ message: "Quantity is missing" });

  // if it is not a number
  if (typeof quantity !== "number")
    return res
      .status(400)
      .json({ message: "Body parameter 'quantity' must be a number." });

  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.updateQuantity(quantity);

    res
      .status(200)
      .json({ message: "Product's quantity updated successfully", product });
  } catch (error) {
    if (
      error.message.includes("didn't change") ||
      error.name === "ValidationError"
    )
      return res.status(400).json({ message: error.message });

    res.status(500).json({ message: error.message });
  }
}

// increasing quantity of 1 particular product
export const increaseProductQuantity = async (req, res) => {
  const receivedKeys = Object.keys(req.body); // collecting keys to count

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

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.increaseQuantity(amount);
    res.status(200).json({ message: "Product quantity increased", product });
  } catch (error) {
    if (
      error.message.includes("didn't change") ||
      error.name === "ValidationError"
    )
      return res.status(400).json({ message: error.message });

    res.status(500).json({ message: error.message });
  }
};

// decreasing quantity of 1 particular product
export const decreaseProductQuantity = async (req, res) => {
  const receivedKeys = Object.keys(req.body); // collecting keys to count

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

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

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

// Updating product's name
export async function updateProductName(req, res, next) {
  const receivedKeys = Object.keys(req.body); // collecting keys to count

  // we are expecting only 1 parameter
  if (receivedKeys.length > 1)
    return res
      .status(400)
      .json({ message: "Too many parameters. Only 'name' is expected." });

  const { id } = req.params;
  const { name } = req.body;

  // if name is missing
  if (name === undefined || name === null)
    return res.status(400).json({ message: "Name is missing" });

  // if it is not a string
  if (typeof name !== "string")
    return res
      .status(400)
      .json({ message: "Body parameter 'name' must be a string." });

  try {
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.updateName(name);

    res
      .status(200)
      .json({ message: "Product's name updated successfully", product });
  } catch (error) {
    // error code for duplicated data
    if (error.code === 11000)
      return res.status(400).json({
        message: "Product name must be unique.",
        additionalInfo: error.message,
      });

    if (
      error.message.includes("didn't change") ||
      error.name === "ValidationError"
    )
      return res.status(400).json({ message: error.message });

    res.status(500).json({ message: error.message });
  }
}

// Updating product's description
export async function updateProductDescr(req, res, next) {
  const receivedKeys = Object.keys(req.body); // collecting keys to count

  // we are expecting only 1 parameter
  if (receivedKeys.length > 1)
    return res.status(400).json({
      message: "Too many parameters. Only 'description' is expected.",
    });
  const { id } = req.params;

  const { description } = req.body;

  // if description is missing
  if (description === undefined || description === null)
    return res.status(400).json({ message: "Description is missing" });

  // if it is not a string
  if (typeof description !== "string")
    return res
      .status(400)
      .json({ message: "Body parameter 'description' must be a string." });

  try {
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.updateDescription(description);

    res
      .status(200)
      .json({ message: "Product's description updated successfully", product });
  } catch (error) {
    if (
      error.message.includes("didn't change") ||
      error.name === "ValidationError"
    )
      return res.status(400).json({ message: error.message });

    res.status(500).json({ message: error.message });
  }
}

// Updating product's price
export async function updateProductPrice(req, res, next) {
  const receivedKeys = Object.keys(req.body); // collecting keys to count

  // we are expecting only 1 parameter
  if (receivedKeys.length > 1)
    return res.status(400).json({
      message: "Too many parameters. Only 'price' is expected.",
    });

  const { id } = req.params;

  const { price } = req.body;

  // if price is missing
  if (price === undefined || price === null)
    return res.status(400).json({ message: "Price is missing" });

  // if it is not a number
  if (typeof price !== "number")
    return res
      .status(400)
      .json({ message: "Body parameter 'price' must be a string." });

  try {
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.updatePrice(price);

    res
      .status(200)
      .json({ message: "Product's price updated successfully", product });
  } catch (error) {
    if (
      error.message.includes("didn't change") ||
      error.name === "ValidationError"
    )
      return res.status(400).json({ message: error.message });

    res.status(500).json({ message: error.message });
  }
}

// Updating categoryId
export async function updateProductCategoryId(req, res, next) {
  const receivedKeys = Object.keys(req.body); // collecting keys to count

  // we are expecting only 1 parameter
  if (receivedKeys.length > 1)
    return res.status(400).json({
      message: "Too many parameters. Only 'categoryId' is expected.",
    });

  const { id } = req.params;

  const { categoryId } = req.body;

  // if categoryId is missing
  if (categoryId === undefined || categoryId === null)
    return res.status(400).json({ message: "Category ID is missing" });

  // if it is not a string
  if (typeof categoryId !== "string")
    return res
      .status(400)
      .json({ message: "Body parameter 'categoryId' must be a string." });

  try {
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const category = await Category.findById(categoryId);

    if (!category)
      return res
        .status(404)
        .json({ message: "Category with this id not found" });

    await product.updateCategoryId(categoryId);

    res
      .status(200)
      .json({ message: "Category ID updated successfully", product });
  } catch (error) {
    if (
      error.message.includes("didn't change") ||
      error.name === "ValidationError" ||
      error.name === "CastError"
    )
      return res.status(400).json({ message: error.message });

    res.status(500).json({ message: error.message });
  }
}

// Updating imagePath
export async function updateProductImagePath(req, res, next) {
  const receivedKeys = Object.keys(req.body); // collecting keys to count

  // we are expecting only 1 parameter
  if (receivedKeys.length > 1)
    return res.status(400).json({
      message: "Too many parameters. Only 'categoryId' is expected.",
    });

  const { id } = req.params;

  const { imagePath } = req.body;

  // if imagePath is missing
  if (imagePath === undefined || imagePath === null)
    return res.status(400).json({ message: "imagePath is missing" });

  // if it is not a string
  if (typeof imagePath !== "string")
    return res
      .status(400)
      .json({ message: "Body parameter 'imagePath' must be a string." });

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.updateImagePath(imagePath);

    res
      .status(200)
      .json({ message: "Product's image path updated successfully", product });
  } catch (error) {
    if (
      error.message.includes("didn't change") ||
      error.name === "ValidationError"
    )
      return res.status(400).json({ message: error.message });

    res.status(500).json({ message: error.message });
  }
}
