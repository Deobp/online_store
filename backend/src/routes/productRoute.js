import express from 'express';
import { 
    createProduct,
    getProducts,
    getProductById, 
    updateProductById, 
    deleteProductById, 
    increaseProductQuantity, 
    decreaseProductQuantity 
} from '../controllers/productController.js';

import {
    authenticateToken,
    isAdmin
  } from "../middlewares/auth.js"

const router = express.Router();

router.post("/", authenticateToken, isAdmin, createProduct).get("/", getProducts);

router.get('/:id', getProductById);

router.put('/:id', authenticateToken, isAdmin, updateProductById);

router.delete('/:id', authenticateToken, isAdmin, deleteProductById);

// Increase product quantity
router.patch('/:id/increase', authenticateToken, isAdmin, increaseProductQuantity);

// Decrease product quantity
router.patch('/:id/decrease', authenticateToken, isAdmin, decreaseProductQuantity);

export default router;
