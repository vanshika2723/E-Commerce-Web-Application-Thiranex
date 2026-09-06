const Order = require("../models/Order");
const Product = require("../models/Product");

// =========================
// CREATE ORDER
// =========================

const createOrder = async (req, res) => {
    try {
        const {
            items,
            shippingAddress
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        if (
            !shippingAddress ||
            !shippingAddress.fullName ||
            !shippingAddress.phone ||
            !shippingAddress.address ||
            !shippingAddress.city ||
            !shippingAddress.state ||
            !shippingAddress.pincode
        ) {
            return res.status(400).json({
                message: "Complete shipping address is required"
            });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    message: `Product not found: ${item.product}`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `${product.name} does not have enough stock`
                });
            }

            totalAmount += product.price * item.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.image
            });
        }

        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            shippingAddress,
            totalAmount
        });

        // Reduce stock
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }

        res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create order",
            error: error.message
        });
    }
};


// =========================
// GET USER ORDERS
// =========================

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.id
        })
            .populate("items.product")
            .sort({
                createdAt: -1
            });

        res.json(orders);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product", "name image")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch all orders",
            error: error.message
        });
    }
};
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        order.status = status;

        await order.save();

        res.json({
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update order status",
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
            getMyOrders,
    getAllOrders,
    updateOrderStatus
        };