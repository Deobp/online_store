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
import { bodyCheck, noBodyCheck, paramsCheck } from '../middlewares/preControllerValidation.js';

const router = express.Router();

router.route("/")
  .post(bodyCheck, authenticateToken, isAdmin, createProduct)
  .get(noBodyCheck, getProducts);

router.get("/actual", noBodyCheck, getActualProducts)

router.route("/:id")
  .get(noBodyCheck, paramsCheck, getProductById)
  .put(bodyCheck, authenticateToken, isAdmin, paramsCheck, fullUpdateProductById)
  .patch(bodyCheck, authenticateToken, isAdmin, paramsCheck, partialUpdateProductById)
  .delete(noBodyCheck, authenticateToken, isAdmin, paramsCheck, deleteProductById)

// Increase product quantity
router.patch('/:id/increase-quantity', bodyCheck, authenticateToken, isAdmin, paramsCheck, increaseProductQuantity);

// Decrease product quantity
router.patch('/:id/decrease-quantity', bodyCheck, authenticateToken, isAdmin, paramsCheck, decreaseProductQuantity);

export default router;
