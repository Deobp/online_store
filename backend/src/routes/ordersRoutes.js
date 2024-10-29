import express from "express"

import {
    getAllOrders,
    getOrderById,
    createOrder,
    updateStatus,
    deleteOrder
} from "../controllers/ordersController.js"

import {
    authenticateToken,
    isAdmin
} from "../middlewares/auth.js"

const router = express.Router()

router.get("/", authenticateToken, isAdmin, getAllOrders)

router.route("/:id")
    .get(authenticateToken, getOrderById)
    .patch(authenticateToken, isAdmin, updateStatus)
    .delete(authenticateToken, isAdmin, deleteOrder)

export default router
