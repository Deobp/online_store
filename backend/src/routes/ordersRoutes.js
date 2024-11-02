import express from "express"

import {
    getAllOrders,
    getOrderById,
    updateStatus,
    deleteOrder
} from "../controllers/ordersController.js"

import {
    authenticateToken,
    isAdmin
} from "../middlewares/auth.js"
import { bodyCheck, noBodyCheck, paramsCheck } from "../middlewares/preControllerValidation.js"

const router = express.Router()

router.get("/", noBodyCheck, authenticateToken, isAdmin, getAllOrders)

router.route("/:id")
    .get(noBodyCheck, authenticateToken, paramsCheck, getOrderById)
    .patch(bodyCheck, authenticateToken, paramsCheck, /*isAdmin,*/ updateStatus)
    .delete(noBodyCheck, authenticateToken, paramsCheck, isAdmin, deleteOrder)

export default router
