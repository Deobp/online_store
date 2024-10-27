import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
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
  logout
} from '../controllers/userController.js';

import {
  authenticateToken,
  isAdmin
} from "../middlewares/auth.js"

const router = express.Router();

router.post("/register", registerUser)
router.post("/login", verifyUser)
router.post("/logout", logout)

// get all users
router.get('/', authenticateToken, isAdmin, getUsers);

router.get('/:id', authenticateToken, getUserById);

///router.post('/', createUser);

router.put('/:id', authenticateToken, updateUser);

router.delete('/:id', authenticateToken, isAdmin, deleteUser);

router.route("/:id/cart").get(authenticateToken, viewCart).post(authenticateToken, addToCart);

router.post('/:id/cart/clear', authenticateToken, clearCart);

router.patch('/:id/username', authenticateToken, updateUsername);

router.patch('/:id/password', authenticateToken, updatePassword);

router.patch('/:id/first-name', authenticateToken, updateFirstName);

router.patch('/:id/last-name', authenticateToken, updateLastName);

router.patch('/:id/email', authenticateToken, updateEmail);

router.patch('/:id/phone', authenticateToken, updatePhone);

router.patch('/:id/country', authenticateToken, updateCountry);

router.patch('/:id/city', authenticateToken, updateCity);

router.patch('/:id/street', authenticateToken, updateStreet);

router.patch('/:id/house', authenticateToken, updateHouse);

router.patch('/:id/apartment', authenticateToken, updateApartment);



export default router;
