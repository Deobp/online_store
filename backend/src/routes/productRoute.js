import express from 'express';
import { 
    createProduct,
    getProducts,
    getProductById, 
    updateProductById, 
    deleteProductById, 
    increaseProductQuantity, 
    decreaseProductQuantity, 
    updateProductName,
    updateProductDescr,
    updateProductPrice,
    updateProductQuantity,
    updateProductCategoryId,
    updateProductImagePath,
    getActualProducts
} from '../controllers/productController.js';

import {
    authenticateToken,
    isAdmin
  } from "../middlewares/auth.js"

const router = express.Router();

router.route("/")
  .post(authenticateToken, isAdmin, createProduct)
  .get(getProducts);

router.get("/actual", getActualProducts)

router.route("/:id")
  .get(getProductById)
  .put(authenticateToken, isAdmin, updateProductById)
  .delete(authenticateToken, isAdmin, deleteProductById)

router.patch("/:id/name", authenticateToken, isAdmin, updateProductName)

router.patch("/:id/description", authenticateToken, isAdmin, updateProductDescr)

router.patch("/:id/price", authenticateToken, isAdmin, updateProductPrice)

router.patch("/:id/quantity", authenticateToken, isAdmin, updateProductQuantity)

router.patch("/:id/category-id", authenticateToken, isAdmin, updateProductCategoryId)

router.patch("/:id/image-path", authenticateToken, isAdmin, updateProductImagePath)

// Increase product quantity
router.patch('/:id/increase', authenticateToken, isAdmin, increaseProductQuantity);

// Decrease product quantity
router.patch('/:id/decrease', authenticateToken, isAdmin, decreaseProductQuantity);

export default router;
