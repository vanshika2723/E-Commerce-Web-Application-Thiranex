
import { Link } from "react-router-dom";
import {
    Heart,
    ShoppingCart,
    Trash2,
    ArrowRight,
    PackageSearch
} from "lucide-react";

import { useCart } from "../context/CartContext";

function Wishlist() {
    const {
        wishlist,
        removeFromWishlist,
        addToCart
    } = useCart();

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-28 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-10">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-400/20 bg-pink-500/10 px-4 py-2 text-sm font-semibold text-pink-300">
                        <Heart size={16} fill="currentColor" />
                        Your Favorites
                    </div>

                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                        My Wishlist
                    </h1>

                    <p className="mt-3 max-w-2xl text-slate-400">
                        Save your favorite products and come back to
                        them whenever you’re ready to shop.
                    </p>
                </div>

                {/* Empty Wishlist */}
                {wishlist.length === 0 ? (
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-20 text-center shadow-2xl shadow-black/20">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-pink-400/20 bg-pink-500/10 text-pink-400">
                            <PackageSearch size={36} />
                        </div>

                        <h2 className="text-2xl font-bold">
                            Your wishlist is empty
                        </h2>

                        <p className="mx-auto mt-3 max-w-md text-slate-400">
                            Looks like you haven't saved any products yet.
                            Explore our collection and add your favorites.
                        </p>

                        <Link
                            to="/products"
                            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-indigo-500"
                        >
                            Explore Products
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Wishlist Count */}
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-sm text-slate-400">
                                {wishlist.length}{" "}
                                {wishlist.length === 1
                                    ? "product"
                                    : "products"}{" "}
                                saved
                            </p>

                            <Link
                                to="/products"
                                className="hidden items-center gap-2 text-sm font-semibold text-indigo-400 transition hover:text-indigo-300 sm:flex"
                            >
                                Continue Shopping
                                <ArrowRight size={16} />
                            </Link>
                        </div>

                        {/* Products Grid */}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {wishlist.map((product) => {
                                const stock =
                                    Number(product.stock) || 0;

                                return (
                                    <article
                                        key={product._id}
                                        className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-white/20"
                                    >
                                        {/* Image */}
                                        <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display =
                                                            "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-slate-600">
                                                    <PackageSearch size={42} />
                                                </div>
                                            )}

                                            {/* Stock */}
                                            <span
                                                className={`absolute left-4 top-4 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-md ${
                                                    stock === 0
                                                        ? "border-red-400/20 bg-red-500/10 text-red-300"
                                                        : stock <= 5
                                                        ? "border-yellow-400/20 bg-yellow-500/10 text-yellow-300"
                                                        : "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                                                }`}
                                            >
                                                {stock === 0
                                                    ? "Out of Stock"
                                                    : stock <= 5
                                                    ? `Only ${stock} left`
                                                    : "In Stock"}
                                            </span>

                                            {/* Remove */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFromWishlist(
                                                        product._id
                                                    )
                                                }
                                                aria-label="Remove from wishlist"
                                                title="Remove from wishlist"
                                                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-red-400/20 bg-slate-950/80 text-red-400 backdrop-blur-md transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                                                {product.category}
                                            </p>

                                            <h2 className="mt-2 line-clamp-1 text-lg font-bold text-white">
                                                {product.name}
                                            </h2>

                                            <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-400">
                                                {product.description}
                                            </p>

                                            {/* Rating */}
                                            <div className="mt-3 flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-yellow-400">
                                                        ★
                                                    </span>

                                                    <span className="text-sm font-semibold text-white">
                                                        {Number(
                                                            product.rating || 0
                                                        ).toFixed(1)}
                                                    </span>
                                                </div>

                                                <span className="text-xs text-slate-500">
                                                    (
                                                    {product.reviewCount || 0}{" "}
                                                    reviews)
                                                </span>
                                            </div>

                                            {/* Price */}
                                            <div className="mt-4 flex items-center justify-between">
                                                <span className="text-2xl font-black text-white">
                                                    ₹
                                                    {Number(
                                                        product.price
                                                    ).toLocaleString("en-IN")}
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div className="mt-5 space-y-3">
                                                <Link
                                                    to={`/products/${product._id}`}
                                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white transition hover:border-indigo-400/30 hover:bg-indigo-500/10"
                                                >
                                                    View Details
                                                    <ArrowRight size={16} />
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        addToCart(product)
                                                    }
                                                    disabled={stock === 0}
                                                    className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${
                                                        stock === 0
                                                            ? "cursor-not-allowed border-white/5 bg-slate-900 text-slate-600"
                                                            : "border-indigo-400/20 bg-indigo-500/10 text-indigo-300 hover:-translate-y-0.5 hover:border-indigo-400/40 hover:bg-indigo-500/20 hover:text-white"
                                                    }`}
                                                >
                                                    <ShoppingCart size={17} />
                                                    {stock === 0
                                                        ? "Out of Stock"
                                                        : "Add to Cart"}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

export default Wishlist;

