
import { useEffect, useState } from "react";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Package,
    X,
    Save,
} from "lucide-react";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";


function AdminProducts() {

    const { token } = useAuth();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);

    const [editingProduct, setEditingProduct] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: "",
    });


    // =========================
    // FETCH PRODUCTS
    // =========================

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const response = await API.get("/products");

            const data = response.data;

            setProducts(
                Array.isArray(data)
                    ? data
                    : data.products || data.data || []
            );

        } catch (error) {

            console.error(
                "Products fetch error:",
                error.response?.data || error.message
            );

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchProducts();
    }, []);


    // =========================
    // FORM CHANGE
    // =========================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };


    // =========================
    // OPEN ADD MODAL
    // =========================

    const openAddModal = () => {

        setEditingProduct(null);

        setFormData({
            name: "",
            description: "",
            price: "",
            category: "",
            stock: "",
            image: "",
        });

        setShowModal(true);
    };


    // =========================
    // OPEN EDIT MODAL
    // =========================

    const openEditModal = (product) => {

        setEditingProduct(product);

        setFormData({
            name: product.name || "",
            description: product.description || "",
            price: product.price ?? "",
            category: product.category || "",
            stock: product.stock ?? "",
            image: product.image || "",
        });

        setShowModal(true);
    };


    // =========================
    // ADD / UPDATE PRODUCT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!token) {
            alert("You are not authorized. Please login again.");
            return;
        }

        try {

            setSaving(true);

            const payload = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                category: formData.category,
                stock: Number(formData.stock),
                image: formData.image,
            };


            if (editingProduct) {

                await API.put(
                    `/products/${editingProduct._id}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

            } else {

                await API.post(
                    "/products",
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

            }


            setShowModal(false);

            setEditingProduct(null);

            setFormData({
                name: "",
                description: "",
                price: "",
                category: "",
                stock: "",
                image: "",
            });

            await fetchProducts();

        } catch (error) {

            console.error(
                "Save product error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Something went wrong while saving the product."
            );

        } finally {
            setSaving(false);
        }
    };


    // =========================
    // DELETE PRODUCT
    // =========================

    const deleteProduct = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) return;

        if (!token) {
            alert("You are not authorized. Please login again.");
            return;
        }

        try {

            await API.delete(
                `/products/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            await fetchProducts();

        } catch (error) {

            console.error(
                "Delete error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete product."
            );
        }
    };


    // =========================
    // FILTER PRODUCTS
    // =========================

    const filteredProducts = products.filter((product) => {

        const searchText = search.toLowerCase();

        return (
            product.name
                ?.toLowerCase()
                .includes(searchText) ||

            product.category
                ?.toLowerCase()
                .includes(searchText)
        );
    });


    // =========================
    // UI
    // =========================

    return (

        <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">

            <div className="mx-auto max-w-[1600px]">


                {/* ================= HEADER ================= */}

                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    <div>

                        <div className="mb-2 flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">

                                <Package size={22} />

                            </div>

                            <div>

                                <h1 className="text-2xl font-bold sm:text-3xl">
                                    Products
                                </h1>

                                <p className="text-sm text-slate-400">
                                    Manage your ShopEase products
                                </p>

                            </div>

                        </div>

                    </div>


                    <button
                        onClick={openAddModal}
                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3 font-semibold shadow-lg shadow-indigo-500/20 transition hover:scale-[1.02]"
                    >

                        <Plus size={19} />

                        Add Product

                    </button>

                </div>


                {/* ================= SEARCH ================= */}

                <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">

                    <div className="relative">

                        <Search
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500/50"
                        />

                    </div>

                </div>


                {/* ================= TABLE ================= */}

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[850px]">

                            <thead>

                                <tr className="border-b border-white/10 bg-white/[0.03] text-left text-xs uppercase tracking-wider text-slate-500">

                                    <th className="px-6 py-4">
                                        Product
                                    </th>

                                    <th className="px-6 py-4">
                                        Category
                                    </th>

                                    <th className="px-6 py-4">
                                        Price
                                    </th>

                                    <th className="px-6 py-4">
                                        Stock
                                    </th>

                                    <th className="px-6 py-4">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-white/5">


                                {/* LOADING */}

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="px-6 py-16 text-center text-slate-500"
                                        >
                                            Loading products...
                                        </td>

                                    </tr>

                                ) : filteredProducts.length === 0 ? (

                                    /* EMPTY */

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="px-6 py-16 text-center text-slate-500"
                                        >
                                            No products found.
                                        </td>

                                    </tr>

                                ) : (

                                    /* PRODUCTS */

                                    filteredProducts.map((product) => (

                                        <tr
                                            key={product._id}
                                            className="transition hover:bg-white/[0.03]"
                                        >

                                            {/* PRODUCT */}

                                            <td className="px-6 py-4">

                                                <div className="flex items-center gap-4">

                                                    <div className="h-14 w-14 overflow-hidden rounded-xl border border-white/10 bg-slate-900">

                                                        {product.image ? (

                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="h-full w-full object-cover"
                                                            />

                                                        ) : (

                                                            <div className="flex h-full items-center justify-center text-slate-600">

                                                                <Package size={20} />

                                                            </div>

                                                        )}

                                                    </div>


                                                    <div>

                                                        <p className="font-semibold text-white">

                                                            {product.name}

                                                        </p>

                                                        <p className="mt-1 max-w-xs truncate text-xs text-slate-500">

                                                            {product.description || "No description"}

                                                        </p>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* CATEGORY */}

                                            <td className="px-6 py-4">

                                                <span className="rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300">

                                                    {product.category || "Uncategorized"}

                                                </span>

                                            </td>


                                            {/* PRICE */}

                                            <td className="px-6 py-4 font-semibold">

                                                ₹
                                                {Number(
                                                    product.price || 0
                                                ).toLocaleString("en-IN")}

                                            </td>


                                            {/* STOCK */}

                                            <td className="px-6 py-4">

                                                <span className="font-semibold">

                                                    {product.stock ?? 0}

                                                </span>

                                            </td>


                                            {/* STATUS */}

                                            <td className="px-6 py-4">

                                                {(product.stock ?? 0) > 0 ? (

                                                    <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">

                                                        In Stock

                                                    </span>

                                                ) : (

                                                    <span className="rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400">

                                                        Out of Stock

                                                    </span>

                                                )}

                                            </td>


                                            {/* ACTIONS */}

                                            <td className="px-6 py-4">

                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        onClick={() =>
                                                            openEditModal(product)
                                                        }
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 transition hover:bg-indigo-500/20"
                                                        title="Edit Product"
                                                    >

                                                        <Edit size={16} />

                                                    </button>


                                                    <button
                                                        onClick={() =>
                                                            deleteProduct(
                                                                product._id
                                                            )
                                                        }
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
                                                        title="Delete Product"
                                                    >

                                                        <Trash2 size={16} />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>


            {/* ================= MODAL ================= */}

            {showModal && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">


                        {/* MODAL HEADER */}

                        <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-slate-900 px-6 py-5">

                            <div>

                                <h2 className="text-xl font-bold">

                                    {editingProduct
                                        ? "Edit Product"
                                        : "Add New Product"}

                                </h2>

                                <p className="mt-1 text-xs text-slate-500">

                                    Fill in the product information

                                </p>

                            </div>


                            <button
                                onClick={() => setShowModal(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                            >

                                <X size={19} />

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-6"
                        >


                            {/* NAME */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-300">

                                    Product Name

                                </label>

                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter product name"
                                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500/50"
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-300">

                                    Description

                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Enter product description"
                                    className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500/50"
                                />

                            </div>


                            {/* PRICE + STOCK */}

                            <div className="grid gap-5 sm:grid-cols-2">


                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-300">

                                        Price

                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        placeholder="₹ 0"
                                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500/50"
                                    />

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-300">

                                        Stock

                                    </label>

                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        placeholder="0"
                                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500/50"
                                    />

                                </div>

                            </div>


                            {/* CATEGORY */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-300">

                                    Category

                                </label>

                                <input
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    placeholder="e.g. Electronics"
                                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500/50"
                                />

                            </div>


                            {/* IMAGE */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-300">

                                    Image URL

                                </label>

                                <input
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://example.com/product.jpg"
                                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500/50"
                                />

                            </div>


                            {/* BUTTONS */}

                            <div className="flex gap-3 border-t border-white/10 pt-5">


                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    disabled={saving}
                                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 font-semibold shadow-lg shadow-indigo-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {saving ? (
                                        "Saving..."
                                    ) : (
                                        <>
                                            <Save size={18} />

                                            {editingProduct
                                                ? "Update Product"
                                                : "Save Product"}
                                        </>
                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}


export default AdminProducts;

