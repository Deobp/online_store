import mongoose from "mongoose";
import dotenv from "dotenv";
import { categories, users, products } from "./initData.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

// Load environment variables
dotenv.config({ path: "./src/config/.env" });

// Connect to MongoDB
mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Function to initialize the database
async function initializeDb() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    
    console.log("Cleared existing data");

    // Create categories
    const createdCategories = await Category.create(categories);
    console.log("Categories created");

    // Map category names to their IDs
    const categoryMap = {};
    createdCategories.forEach(category => {
      categoryMap[category.name] = category._id;
    });

    // Add categoryId to products based on names
    const productsWithCategories = products.map(product => {
      let categoryId;
      
      if (product.name.includes("by")) {
        categoryId = categoryMap["Books"];
      } else if (product.imagePath.includes("tool")) {
        categoryId = categoryMap["Tools"];
      } else if (product.imagePath.includes("plant")) {
        categoryId = categoryMap["Plants"];
      } else if (product.imagePath.includes("album")) {
        categoryId = categoryMap["Music Albums"];
      } else {
        categoryId = categoryMap["Movies"];
      }
    
      return { ...product, categoryId };
    });
    
    // Create products
    await Product.create(productsWithCategories);
    console.log("Products created");

    // Create users
    await User.create(users);
    console.log("Users created");

    console.log("Database initialization completed");
    
    process.exit(0);
  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1);
  }
}

// Run initialization
initializeDb();
