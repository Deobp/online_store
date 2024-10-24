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

const router = express.Router();

router.post("/", createProduct).get("/", getProducts);

router.get('/:id', getProductById);

router.put('/:id', updateProductById);

router.delete('/:id', deleteProductById);

// Increase product quantity
router.patch('/:id/increase', increaseProductQuantity);

// Decrease product quantity
router.patch('/:id/decrease', decreaseProductQuantity);

export default router;
