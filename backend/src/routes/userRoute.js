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
  getOrdersByUserId,
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
  .get(noBodyCheck, authenticateToken, paramsCheck, getUserById) // get one user or 'me'
  .put(bodyCheck, authenticateToken, paramsCheck, fullUpdateUserById) // full update one user or 'me'
  .patch(bodyCheck, authenticateToken, paramsCheck, partialUpdateUserById) // partial update one user or 'me'
  .delete(noBodyCheck, authenticateToken, paramsCheck, isAdmin, deleteUser); // delete user

router
  .route("/:id/cart")
  .get(noBodyCheck, authenticateToken, paramsCheck, viewCart) // view user's cart or 'me'
  .post(bodyCheck, authenticateToken, paramsCheck, addToCart); // add products to user's cart or 'me'

router.post(
  "/:id/cart/clear",
  noBodyCheck,
  authenticateToken,
  paramsCheck,
  clearCart
); // clear user's cart or 'me'

router
  .route("/:id/orders")
  .post(noBodyCheck, authenticateToken, paramsCheck, createOrder) // create order based on the cart of 1 user or 'me'
  .get(noBodyCheck, authenticateToken, paramsCheck, getOrdersByUserId); // get orders of 1 user or 'me'

export default router;
