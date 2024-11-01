import express from "express";
import {
  getUsers,
  getUserById,
  fullUpdateUserById,
  deleteUser,
  addToCart,
  updateUsername,
  updatePassword,
  updateFirstName,
  updateLastName,
  verifyUser,
  registerUser,
  updateEmail,
  updatePhone,
  updateCountry,
  updateCity,
  updateStreet,
  updateHouse,
  updateApartment,
  clearCart,
  viewCart,
  logout,
  partialUpdateUserById,
} from "../controllers/userController.js";

import { bodyCheck, noBodyCheck, paramsCheck } from "../middlewares/preControllerValidation.js";
import { authenticateToken, isAdmin } from "../middlewares/auth.js";
import { createOrder } from "../controllers/ordersController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", verifyUser);
router.post("/logout", logout);

// get all users
router.get("/", noBodyCheck, authenticateToken, isAdmin, getUsers);

router
  .route("/:id")
  .get(noBodyCheck, authenticateToken, paramsCheck, getUserById)
  .put(bodyCheck, authenticateToken, paramsCheck, fullUpdateUserById)
  .patch(bodyCheck, authenticateToken, paramsCheck, partialUpdateUserById)
  .delete(authenticateToken, isAdmin, deleteUser);

router
  .route("/:id/cart")
  .get(authenticateToken, viewCart)
  .post(authenticateToken, addToCart);

router.post("/:id/cart/clear", authenticateToken, clearCart);

router.post("/:id/orders", authenticateToken, createOrder)

export default router;
