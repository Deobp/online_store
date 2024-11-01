import express from "express";
import {
  getUsers,
  getUserById,
  fullUpdateUserById,
  deleteUser,
  addToCart,
  verifyUser,
  registerUser,
  clearCart,
  viewCart,
  logout,
  partialUpdateUserById,
} from "../controllers/userController.js";

import {
  bodyCheck,
  noBodyCheck,
  paramsCheck,
} from "../middlewares/preControllerValidation.js";
import { authenticateToken, isAdmin } from "../middlewares/auth.js";
import { createOrder } from "../controllers/ordersController.js";

const router = express.Router();

router.post("/register", bodyCheck, registerUser);
router.post("/login", bodyCheck, verifyUser);
router.post("/logout", noBodyCheck, logout);

// get all users
router.get("/", noBodyCheck, authenticateToken, isAdmin, getUsers);

router
  .route("/:id")
  .get(noBodyCheck, authenticateToken, paramsCheck, getUserById)
  .put(bodyCheck, authenticateToken, paramsCheck, fullUpdateUserById)
  .patch(bodyCheck, authenticateToken, paramsCheck, partialUpdateUserById)
  .delete(noBodyCheck, paramsCheck, authenticateToken, isAdmin, deleteUser);

router
  .route("/:id/cart")
  .get(noBodyCheck, authenticateToken, paramsCheck, viewCart)
  .post(bodyCheck, authenticateToken, paramsCheck, addToCart);

router.post(
  "/:id/cart/clear",
  noBodyCheck,
  authenticateToken,
  paramsCheck,
  clearCart
);

router.post("/:id/orders", authenticateToken, createOrder);

export default router;
