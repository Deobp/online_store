import Product from "../models/Product.js";
export const createProduct = async (req, res) => {
  const { name, description, price, quantity, categoryId, imagePath } = req.body;

  try {
      const newProduct = new Product({
          name,
          description,
          price,
          quantity,
          categoryId,
          imagePath
      });

      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
    try {
      const products = await Product.find();
      if(!products.length) return res.status(200).json({ message: "no products in db" });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
      const product = await Product.findById(id).populate('categoryId');
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

export const updateProductById = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
      const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
      if (!updatedProduct) {
          return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(updatedProduct);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

export const deleteProductById = async (req, res) => {
  const { id } = req.params;

  try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
          return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

export const increaseProductQuantity = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
      const product = await Product.findById(id);
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      await product.increaseQuantity(amount);
      res.status(200).json({ message: 'Product quantity increased', product });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

export const decreaseProductQuantity = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
      const product = await Product.findById(id);
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      const result = await product.decreaseQuantity(amount);
      if (!result) {
          return res.status(200).json({ message: 'Product quantity decreased', product });
      }
      res.status(200).json({ message: 'Product removed due to quantity reaching 0' });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

