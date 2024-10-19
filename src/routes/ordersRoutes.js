import express from "express"

import {
    getAllOrders,
    getOrderById,
    createOrder,
    updateStatus,
    deleteOrder
  } from "../controllers/ordersController"

const router = express.Router()

router.route("/").get(getAllOrders).post(createOrder);
router.route("/:id").get(getOrderById).patch(updateStatus).delete(deleteOrder);

module.exports = router;