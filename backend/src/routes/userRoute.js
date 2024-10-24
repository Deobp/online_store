import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addToCart,
  updatePassword,
  updateFirstName,
  updateLastName,
  verifyUser,
  registerUser
} from '../controllers/userController.js';

import {
  authenticateToken,
  isAdmin
} from "../middlewares/auth.js"

const router = express.Router();

router.post("/register", registerUser)
router.post("/login", verifyUser)

// get all users
router.get('/', authenticateToken, isAdmin, getUsers);

router.get('/:id', authenticateToken, getUserById);

router.post('/', createUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

router.post('/:id/cart', addToCart);

router.put('/:id/password', updatePassword);

router.put('/:id/first-name', updateFirstName);

router.put('/:id/last-name', updateLastName);

export default router;
