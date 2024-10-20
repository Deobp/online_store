import express from "express"

import {
    getAllOrders,
    getOrderById,
    createOrder,
    updateStatus,
    deleteOrder
} from "../controllers/ordersController"

import {
    authenticateToken,
    isAdmin
} from "../middlewares/auth"

const router = express.Router()

router.route("/").get(authenticateToken, isAdmin, getAllOrders)
                .post(authenticateToken, createOrder)

router.route("/:id").get(authenticateToken, getOrderById)
                    .patch(authenticateToken, isAdmin, updateStatus)
                    .delete(authenticateToken, isAdmin, deleteOrder) // modify to allow user delete his order in some statuses

module.exports = router;