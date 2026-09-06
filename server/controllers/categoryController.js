const Category = require("../models/Category");

// =========================
// GET ALL CATEGORIES
// =========================
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            categories
        });

    } catch (error) {
        console.error("Get categories error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
            error: error.message
        });
    }
};


// =========================
// CREATE CATEGORY
// =========================
const createCategory = async (req, res) => {
    try {
        const { name, description, image, status } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const existingCategory = await Category.findOne({
            name: name.trim()
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category already exists"
            });
        }

        const category = await Category.create({
            name: name.trim(),
            description: description || "",
            image: image || "",
            status: status || "active"
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });

    } catch (error) {
        console.error("Create category error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create category",
            error: error.message
        });
    }
};


// =========================
// UPDATE CATEGORY
// =========================
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image, status } = req.body;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        if (name) {
            const duplicate = await Category.findOne({
                name: name.trim(),
                _id: { $ne: id }
            });

            if (duplicate) {
                return res.status(400).json({
                    success: false,
                    message: "Category already exists"
                });
            }

            category.name = name.trim();
        }

        category.description = description ?? category.description;
        category.image = image ?? category.image;
        category.status = status ?? category.status;

        await category.save();

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });

    } catch (error) {
        console.error("Update category error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update category",
            error: error.message
        });
    }
};


// =========================
// DELETE CATEGORY
// =========================
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        await Category.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        console.error("Delete category error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete category",
            error: error.message
        });
    }
};


module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
};