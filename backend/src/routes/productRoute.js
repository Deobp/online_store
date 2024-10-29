import express from 'express';
import { 
    createProduct,
    getProducts,
    getProductById, 
    deleteProductById, 
    increaseProductQuantity, 
    decreaseProductQuantity, 
    getActualProducts,
    fullUpdateProductById,
    partialUpdateProductById
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
  .put(authenticateToken, isAdmin, fullUpdateProductById)
  .patch(authenticateToken, isAdmin, partialUpdateProductById)
  .delete(authenticateToken, isAdmin, deleteProductById)

// Increase product quantity
router.patch('/:id/increase-quantity', authenticateToken, isAdmin, increaseProductQuantity);

// Decrease product quantity
router.patch('/:id/decrease-quantity', authenticateToken, isAdmin, decreaseProductQuantity);

export default router;
