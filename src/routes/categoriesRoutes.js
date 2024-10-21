import express from "express"

import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategoryDescr,
    deleteCategory
  } from "../controllers/categoriesController.js"

  import {
    authenticateToken,
    isAdmin
  } from "../middlewares/auth.js"

const router = express.Router()

router.route("/").get(getAllCategories).post(authenticateToken, isAdmin, createCategory);
router.route("/:id").get(getCategoryById).patch(authenticateToken, isAdmin, updateCategoryDescr).delete(authenticateToken, isAdmin, deleteCategory);

//module.exports = router;

export default router


