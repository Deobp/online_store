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
import { bodyCheck, noBodyCheck } from "../middlewares/preControllerValidation.js";

const router = express.Router();

router
  .route("/")
  .get(noBodyCheck, getAllCategories)
  .post(bodyCheck, authenticateToken, isAdmin, createCategory);

router
  .route("/:id")
  .get(noBodyCheck, getCategoryById)
  .put(bodyCheck, authenticateToken, isAdmin, fullUpdateCategoryById)
  .patch(bodyCheck, authenticateToken, isAdmin, partialUpdateCategoryById)
  .delete(noBodyCheck, authenticateToken, isAdmin, deleteCategory);

router.get("/:id/products", noBodyCheck, getProductsByCategoryId);

export default router;
