import express from "express"

import {
    getAllOrders,
    getOrderById,
    updateStatus,
    deleteOrder,
    getUserOrders
} from "../controllers/ordersController.js"

import {
    authenticateToken,
    isAdmin
} from "../middlewares/auth.js"

const router = express.Router()

router.get("/", authenticateToken, isAdmin, getAllOrders)
router.get("/me", authenticateToken, getUserOrders)
router.route("/:id")
    .get(authenticateToken, getOrderById)
    .patch(authenticateToken, isAdmin, updateStatus)
    .delete(authenticateToken, isAdmin, deleteOrder)

export default router
