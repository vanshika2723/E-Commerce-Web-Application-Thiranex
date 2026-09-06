const express = require("express");

const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


// =========================
// USER ORDERS
// =========================

router.post("/", protect, createOrder);

router.get("/my-orders", protect, getMyOrders);


// =========================
// ADMIN ORDERS
// =========================

router.get(
    "/admin/all",
    protect,
    adminOnly,
    getAllOrders
);

router.put(
    "/admin/:id/status",
    protect,
    adminOnly,
    updateOrderStatus
);


module.exports = router;