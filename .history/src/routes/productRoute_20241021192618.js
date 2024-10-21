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

router.post('/products', createProduct);

router.get('/products/:id', getProductById);

router.put('/products/:id', updateProductById);

router.delete('/products/:id', deleteProductById);

// Increase product quantity
router.patch('/products/:id/increase', increaseProductQuantity);

// Decrease product quantity
router.patch('/products/:id/decrease', decreaseProductQuantity);

export default router;
