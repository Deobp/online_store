import express from "express";

import {
  getAllCategories,
  getCategoryById,
  createCategory,
  deleteCategory,
  getProductsByCategoryId,
  fullUpdateCategoryById,
  partialUpdateCategoryById,
} from "../controllers/categoriesController.js";

import { authenticateToken, isAdmin } from "../middlewares/auth.js";
import { bodyCheck, noBodyCheck, paramsCheck } from "../middlewares/preControllerValidation.js";

const router = express.Router();

router
  .route("/")
  .get(noBodyCheck, getAllCategories) // list of all categories
  .post(bodyCheck, authenticateToken, isAdmin, createCategory); // create a new category (only admin)

router
  .route("/:id")
  .get(noBodyCheck, paramsCheck, getCategoryById)  // get info about one category
  .put(paramsCheck, bodyCheck, authenticateToken, isAdmin, fullUpdateCategoryById) // full update of category (only admin)
  .patch(paramsCheck, bodyCheck, authenticateToken, isAdmin, partialUpdateCategoryById)  // partial update of 1 category (only admin)
  .delete(noBodyCheck, paramsCheck, authenticateToken, isAdmin, deleteCategory); // deleting category (only admin)

router.get("/:id/products", noBodyCheck, paramsCheck, getProductsByCategoryId);  // get products that belongs to 1 category

export default router;
