import express from 'express';
import { 
    createProduct, 
    getProductById, 
    updateProductById, 
    deleteProductById, 
    increaseProductQuantity, 
    decreaseProductQuantity 
} from '../controllers/productController.js';

const router = express.Router();

// Create a new product
router.post('/products', createProduct);

// Get a product by ID
router.get('/products/:id', getProductById);

// Update a product by ID
router.put('/products/:id', updateProductById);

// Delete a product by ID
router.delete('/products/:id', deleteProductById);

// Increase product quantity
router.patch('/products/:id/increase', increaseProductQuantity);

// Decrease product quantity
router.patch('/products/:id/decrease', decreaseProductQuantity);

export default router;
