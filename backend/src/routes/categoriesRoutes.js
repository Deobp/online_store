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

const router = express.Router();

router
  .route("/")
  .get(getAllCategories)
  .post(authenticateToken, isAdmin, createCategory);

router
  .route("/:id")
  .get(getCategoryById)
  .put(authenticateToken, isAdmin, fullUpdateCategoryById)
  .patch(authenticateToken, isAdmin, partialUpdateCategoryById)
  .delete(authenticateToken, isAdmin, deleteCategory);

router.get("/:id/products", getProductsByCategoryId);

export default router;
