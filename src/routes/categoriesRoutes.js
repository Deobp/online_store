import express from "express"

import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategoryDescr,
    deleteCategory
  } from "../controllers/categoriesController"

const router = express.Router()

router.route("/").get(getAllCategories).post(createCategory);
router.route("/:id").get(getCategoryById).patch(updateCategoryDescr).delete(deleteCategory);

module.exports = router;


