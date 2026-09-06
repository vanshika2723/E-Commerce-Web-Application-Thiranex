import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    X,
    Tags,
    CheckCircle,
    XCircle,
    Image as ImageIcon,
    Loader2,
} from "lucide-react";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminCategories() {
    const { token } = useAuth();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [editingCategory, setEditingCategory] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: "",
        status: "active",
    });

    // =========================
    // FETCH CATEGORIES
    // =========================
    const fetchCategories = async () => {
        try {
            setLoading(true);

            const res = await API.get("/categories", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = res.data;

            if (Array.isArray(data)) {
                setCategories(data);
            } else if (Array.isArray(data.categories)) {
                setCategories(data.categories);
            } else if (Array.isArray(data.data)) {
                setCategories(data.data);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error("Fetch categories error:", error);

            alert(
                error.response?.data?.message ||
                    "Failed to fetch categories"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCategories();
        }
    }, [token]);

    // =========================
    // FORM HANDLER
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // OPEN ADD MODAL
    // =========================
    const openAddModal = () => {
        setEditingCategory(null);

        setFormData({
            name: "",
            description: "",
            image: "",
            status: "active",
        });

        setShowModal(true);
    };

    // =========================
    // OPEN EDIT MODAL
    // =========================
    const openEditModal = (category) => {
        setEditingCategory(category);

        setFormData({
            name: category.name || "",
            description: category.description || "",
            image: category.image || "",
            status: category.status || "active",
        });

        setShowModal(true);
    };

    // =========================
    // CLOSE MODAL
    // =========================
    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        setEditingCategory(null);
    };

    // =========================
    // SAVE CATEGORY
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Category name is required");
            return;
        }

        try {
            setSaving(true);

            if (editingCategory) {
                await API.put(
                    `/categories/${editingCategory._id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                alert("Category updated successfully");
            } else {
                await API.post("/categories", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                alert("Category created successfully");
            }

            closeModal();
            fetchCategories();
        } catch (error) {
            console.error("Save category error:", error);

            alert(
                error.response?.data?.message ||
                    "Failed to save category"
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // DELETE CATEGORY
    // =========================
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmDelete) return;

        try {
            await API.delete(`/categories/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setCategories((prev) =>
                prev.filter((category) => category._id !== id)
            );

            alert("Category deleted successfully");
        } catch (error) {
            console.error("Delete category error:", error);

            alert(
                error.response?.data?.message ||
                    "Failed to delete category"
            );
        }
    };

    // =========================
    // FILTER
    // =========================
    const filteredCategories = useMemo(() => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) return categories;

        return categories.filter(
            (category) =>
                category.name?.toLowerCase().includes(keyword) ||
                category.description?.toLowerCase().includes(keyword)
        );
    }, [categories, search]);

    // =========================
    // STATS
    // =========================
    const totalCategories = categories.length;

    const activeCategories = categories.filter(
        (category) => category.status === "active"
    ).length;

    const inactiveCategories = categories.filter(
        (category) => category.status === "inactive"
    ).length;

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1600px]">

                {/* HEADER */}
                <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                                <Tags size={23} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
                                    Admin Panel
                                </p>

                                <h1 className="text-2xl font-black sm:text-3xl">
                                    Categories
                                </h1>
                            </div>
                        </div>

                        <p className="text-sm text-slate-400">
                            Manage your store categories and organize products.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddModal}
                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3 text-sm font-bold shadow-lg shadow-indigo-500/20 transition hover:scale-[1.02] hover:shadow-indigo-500/30"
                    >
                        <Plus size={19} />
                        Add Category
                    </button>
                </div>

                {/* STATS */}
                <div className="mb-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">
                                    Total Categories
                                </p>

                                <h2 className="mt-2 text-3xl font-black">
                                    {totalCategories}
                                </h2>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                                <Tags size={22} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">
                                    Active
                                </p>

                                <h2 className="mt-2 text-3xl font-black text-emerald-400">
                                    {activeCategories}
                                </h2>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                                <CheckCircle size={22} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">
                                    Inactive
                                </p>

                                <h2 className="mt-2 text-3xl font-black text-red-400">
                                    {inactiveCategories}
                                </h2>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                                <XCircle size={22} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEARCH */}
                <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
                    <div className="relative">
                        <Search
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search categories..."
                            className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50"
                        />
                    </div>
                </div>

                {/* CONTENT */}
                {loading ? (
                    <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                        <div className="flex items-center gap-3 text-slate-400">
                            <Loader2
                                size={22}
                                className="animate-spin text-indigo-400"
                            />
                            Loading categories...
                        </div>
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                            <Tags size={28} />
                        </div>

                        <h2 className="text-lg font-bold">
                            No categories found
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            {search
                                ? "Try a different search."
                                : "Create your first category to get started."}
                        </p>

                        {!search && (
                            <button
                                type="button"
                                onClick={openAddModal}
                                className="mt-5 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold hover:bg-indigo-400"
                            >
                                Create Category
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredCategories.map((category) => (
                            <div
                                key={category._id}
                                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-indigo-500/30"
                            >
                                {/* IMAGE */}
                                <div className="relative h-40 overflow-hidden bg-slate-900">
                                    {category.image ? (
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            onError={(e) => {
                                                e.currentTarget.style.display =
                                                    "none";
                                            }}
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <ImageIcon
                                                size={40}
                                                className="text-slate-700"
                                            />
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                                    <span
                                        className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-xs font-bold ${
                                            category.status === "active"
                                                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                                                : "border-red-400/20 bg-red-400/10 text-red-400"
                                        }`}
                                    >
                                        {category.status}
                                    </span>
                                </div>

                                {/* CONTENT */}
                                <div className="p-5">
                                    <h3 className="truncate text-lg font-bold">
                                        {category.name}
                                    </h3>

                                    <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">
                                        {category.description ||
                                            "No description added."}
                                    </p>

                                    <div className="mt-5 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openEditModal(category)
                                            }
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-2.5 text-sm font-semibold text-indigo-400 transition hover:bg-indigo-500/20"
                                        >
                                            <Pencil size={16} />
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(category._id)
                                            }
                                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/50">

                        {/* MODAL HEADER */}
                        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                                    Category Management
                                </p>

                                <h2 className="mt-1 text-xl font-bold">
                                    {editingCategory
                                        ? "Edit Category"
                                        : "Add Category"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        {/* FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-6"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-300">
                                    Category Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Electronics"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500/50"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-300">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Enter category description..."
                                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500/50"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-300">
                                    Image URL
                                </label>

                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://example.com/category.jpg"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500/50"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-300">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50"
                                >
                                    <option value="active">
                                        Active
                                    </option>

                                    <option value="inactive">
                                        Inactive
                                    </option>
                                </select>
                            </div>

                            {/* BUTTONS */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 text-sm font-bold shadow-lg shadow-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving && (
                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />
                                    )}

                                    {editingCategory
                                        ? "Update Category"
                                        : "Create Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminCategories;