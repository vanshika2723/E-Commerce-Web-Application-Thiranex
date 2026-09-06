
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// =========================
// REGISTER
// =========================

// =========================
// REGISTER
// =========================

const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role = "user"
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Only allow valid roles
        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({
                message: "Invalid account type"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role
        });

        // Create JWT immediately after registration
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(201).json({
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
};


// =========================
// LOGIN
// =========================

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};


// =========================
// FORGOT PASSWORD
// =========================

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        // Security: don't reveal whether the email exists
        if (!user) {
            return res.json({
                message:
                    "If an account exists with this email, a password reset link has been sent."
            });
        }

        // Generate secure random token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash token before storing it in database
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = hashedToken;

        // Token valid for 15 minutes
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        await user.save();

        // Development reset URL
        // Later we will send this through email.
        const resetUrl = `${
            process.env.CLIENT_URL || "http://localhost:5173"
        }/reset-password/${resetToken}`;

        console.log("=================================");
        console.log("PASSWORD RESET URL:");
        console.log(resetUrl);
        console.log("=================================");

        res.json({
            message:
                "If an account exists with this email, a password reset link has been sent."
        });

    } catch (error) {
        console.error("Forgot password error:", error);

        res.status(500).json({
            message: "Unable to process password reset request"
        });
    }
};


// =========================
// RESET PASSWORD
// =========================

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!token) {
            return res.status(400).json({
                message: "Reset token is required"
            });
        }

        if (!password) {
            return res.status(400).json({
                message: "New password is required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        // Hash token received from URL
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find valid, non-expired token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: {
                $gt: Date.now()
            }
        });

        if (!user) {
            return res.status(400).json({
                message: "Reset token is invalid or has expired"
            });
        }

        // Hash new password
        user.password = await bcrypt.hash(password, 10);

        // Clear reset token after successful reset
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;

        await user.save();

        res.json({
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("Reset password error:", error);

        res.status(500).json({
            message: "Password reset failed"
        });
    }
};

// =========================
// GET ALL USERS - ADMIN
// =========================

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password -resetPasswordToken -resetPasswordExpire")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Get users error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message
        });
    }
};


// =========================
// DELETE USER - ADMIN
// =========================

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error("Delete user error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete user",
            error: error.message
        });
    }
};

// =========================
// EXPORTS
// =========================

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getAllUsers,
    deleteUser
};

