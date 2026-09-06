
const express = require("express");

const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getAllUsers,
    deleteUser
} = require("../controllers/authController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");


const router = express.Router();

// =========================
// AUTH ROUTES
// =========================

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);


// =========================
// PROTECTED USER ROUTE
// =========================

router.get("/profile", protect, (req, res) => {
    res.json({
        message: "Protected profile accessed successfully",
        user: req.user
    });
});


// =========================
// ADMIN ONLY ROUTE
// =========================

router.get("/admin", protect, adminOnly, (req, res) => {
    res.json({
        message: "Welcome Admin!",
        user: req.user
    });
});

// =========================
// ADMIN USER MANAGEMENT
// =========================

router.get("/users", protect, adminOnly, getAllUsers);

router.delete("/users/:id", protect, adminOnly, deleteUser);

module.exports = router;

