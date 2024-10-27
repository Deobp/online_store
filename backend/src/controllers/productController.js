import Category from "../models/Category.js";
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
    if (error.name === "ValidationError" || error.code === 11000)
        return res.status(400).json({ message: error.message })

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
  if (!amount)
    return res.status(400).json({ message: "Amount is missing" })
  try {
      const product = await Product.findById(id);
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      await product.increaseQuantity(amount);
      res.status(200).json({ message: 'Product quantity increased', product });
  } catch (error) {
    if (error.message.includes("didn't change") || error.name === "ValidationError")
        return res.status(400).json({ message: error.message })

      res.status(500).json({ message: error.message });
  }
};

export const decreaseProductQuantity = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  if (!amount)
    return res.status(400).json({ message: "Amount is missing" })

  try {
      const product = await Product.findById(id);
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      const result = await product.decreaseQuantity(amount);
      if (result) {
          return res.status(200).json({ message: 'Product quantity decreased', product });
      }
      res.status(200).json({ message: 'Product removed due to quantity reaching 0' });
  } catch (error) {
      if (error.message.includes("didn't change") || error.name === "ValidationError")
        return res.status(400).json({ message: error.message })
    
      res.status(500).json({ message: error.message });
  }
};

export async function updateProductName(req, res, next) {
    try {
        const { id } = req.params
        const {name} = req.body
        
        const product = await Product.findById(id)

        if (!product)
           return res.status(404).json({ message: "Product not found" })

        if (!name)
            return res.status(400).json({ message: "Name is missing" })

        await product.updateName(name)
       
        res.status(200).json({ message: "Product's name updated successfully"});
    } catch (error) {
        if (error.message.includes("didn't change") || error.name === "ValidationError" || error.code === 11000)
            return res.status(400).json({ message: error.message })

        res.status(500).json({ message: error.message });
    }
}

export async function updateProductDescr(req, res, next) {
    try {
        const { id } = req.params
        
        
        const product = await Product.findById(id)

        if (!product)
           return res.status(404).json({ message: "Product not found" })

        const {description} = req.body

        if (!description)
            return res.status(400).json({ message: "Description is missing" })

        await product.updateDescription(description)
       
        res.status(200).json({ message: "Product's description updated successfully"});
    } catch (error) {
        if (error.message.includes("didn't change") || error.name === "ValidationError")
            return res.status(400).json({ message: error.message })

        res.status(500).json({ message: error.message });
    }
}

export async function updateProductPrice(req, res, next) {
    try {
        const { id } = req.params
        
        
        const product = await Product.findById(id)

        if (!product)
           return res.status(404).json({ message: "Product not found" })

        const {price} = req.body

        if (!price)
            return res.status(400).json({ message: "Price is missing" })

        await product.updatePrice(price)
       
        res.status(200).json({ message: "Product's price updated successfully"});
    } catch (error) {
        if (error.message.includes("didn't change") || error.name === "ValidationError")
            return res.status(400).json({ message: error.message })

        res.status(500).json({ message: error.message });
    }
}

export async function updateProductQuantity(req, res, next) {
    try {
        const { id } = req.params
        
        
        const product = await Product.findById(id)

        if (!product)
           return res.status(404).json({ message: "Product not found" })

        const {quantity} = req.body

        if (!quantity)
            return res.status(400).json({ message: "Quantity is missing" })

        await product.updateQuantity(quantity)
       
        res.status(200).json({ message: "Product's quantity updated successfully"});
    } catch (error) {
        if (error.message.includes("didn't change") || error.name === "ValidationError")
            return res.status(400).json({ message: error.message })

        res.status(500).json({ message: error.message });
    }
}
 
 
export async function updateProductCategoryId(req, res, next) {
    try {
        const { id } = req.params
        
        
        const product = await Product.findById(id)

        if (!product)
           return res.status(404).json({ message: "Product not found" })

        const {categoryId} = req.body

        if (!categoryId)
            return res.status(400).json({ message: "Category ID is missing" })

        const category = await Category.findById(categoryId)

        if (!category)
            return res.status(404).json({ message: "Category with this id not found" })

        await product.updateCategoryId(categoryId)
       
        res.status(200).json({ message: "Category ID updated successfully"});
    } catch (error) {
        if (error.message.includes("didn't change") || error.name === "ValidationError" || error.name === "CastError")
            return res.status(400).json({ message: error.message })

        res.status(500).json({ message: error.message });
    }
}
 
export async function updateProductImagePath(req, res, next) {
    try {
        const { id } = req.params
        
        
        const product = await Product.findById(id)

        if (!product)
           return res.status(404).json({ message: "Product not found" })

        const {imagePath} = req.body

        if (!imagePath)
            return res.status(400).json({ message: "Image Path is missing" })

        await product.updateImagePath(imagePath)
       
        res.status(200).json({ message: "Product's image path updated successfully"});
    } catch (error) {
        if (error.message.includes("didn't change") || error.name === "ValidationError")
            return res.status(400).json({ message: error.message })

        res.status(500).json({ message: error.message });
    }
}
  
  