import express from "express"

import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategoryById,
    updateCategoryName,
    updateCategoryDescr,
    deleteCategory,
    getProductsByCategoryId
  } from "../controllers/categoriesController.js"

  import {
    authenticateToken,
    isAdmin
  } from "../middlewares/auth.js"

const router = express.Router()

router.route("/")
  .get(getAllCategories)
  .post(authenticateToken, isAdmin, createCategory)

router.route("/:id")
  .get(getCategoryById)
  .put(authenticateToken, isAdmin, updateCategoryById)
  .delete(authenticateToken, isAdmin, deleteCategory)

router.get("/:id/products", getProductsByCategoryId)

router.patch("/:id/name", authenticateToken, isAdmin, updateCategoryName)

router.patch("/:id/description", authenticateToken, isAdmin, updateCategoryDescr)


export default router


