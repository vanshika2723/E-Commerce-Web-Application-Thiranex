
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    ShoppingCart,
    Package,
    ShieldCheck,
    Truck,
    CheckCircle2,
    Heart,
    Minus,
    Plus,
    Zap,
    Check
} from "lucide-react";

import API from "../services/api";
import { useCart } from "../context/CartContext";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        addToCart,
        toggleWishlist,
        isInWishlist
    } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    const fetchProduct = async () => {
        try {
            const response = await API.get(`/products/${id}`);

            setProduct(response.data);
        } catch (error) {
            console.error(error);

            setError("Product not found");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <section className="min-h-screen bg-slate-950 px-4 py-24 text-white">
                <div className="mx-auto flex min-h-[60vh] max-w-none w-full items-center justify-center">
                    <div className="text-center">

                        <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-indigo-500"></div>

                        <h2 className="text-xl font-semibold">
                            Loading product...
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                            Please wait while we fetch the product details.
                        </p>

                    </div>
                </div>
            </section>
        );
    }

    // =========================
    // ERROR
    // =========================

    if (error || !product) {
        return (
            <section className="min-h-screen bg-slate-950 px-4 py-24 text-white">
                <div className="mx-auto flex min-h-[60vh] max-w-none w-full items-center justify-center">

                    <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center shadow-2xl backdrop-blur-xl">

                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-4xl">
                            😕
                        </div>

                        <h2 className="text-2xl font-bold">
                            {error || "Product not found"}
                        </h2>

                        <p className="mt-3 text-slate-400">
                            The product you're looking for may have been
                            removed or doesn't exist.
                        </p>

                        <Link
                            to="/products"
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5"
                        >
                            <ArrowLeft size={18} />
                            Back to Products
                        </Link>

                    </div>

                </div>
            </section>
        );
    }

    // =========================
    // PRODUCT DATA
    // =========================

    const stock = Number(product.stock) || 0;

    const isInStock = stock > 0;

    const wishlisted = isInWishlist(product._id);

    const rating = Number(product.rating || 0);

    const reviewCount = Number(
        product.reviewCount || 0
    );

    const safeQuantity = Math.min(
        Math.max(quantity, 1),
        stock
    );

    // =========================
    // QUANTITY
    // =========================

    const decreaseQuantity = () => {
        setQuantity((currentQuantity) =>
            Math.max(1, currentQuantity - 1)
        );
    };

    const increaseQuantity = () => {
        setQuantity((currentQuantity) =>
            Math.min(stock, currentQuantity + 1)
        );
    };

    // =========================
    // ADD TO CART
    // =========================

    const handleAddToCart = () => {
        if (!isInStock) {
            return;
        }

        for (let i = 0; i < safeQuantity; i++) {
            addToCart(product);
        }

        setAddedToCart(true);

        setTimeout(() => {
            setAddedToCart(false);
        }, 1800);
    };

    // =========================
    // BUY NOW
    // =========================

    const handleBuyNow = () => {
        if (!isInStock) {
            return;
        }

        for (let i = 0; i < safeQuantity; i++) {
            addToCart(product);
        }

        navigate("/cart");
    };

    // =========================
    // WISHLIST
    // =========================

    const handleWishlist = () => {
        toggleWishlist(product);
    };

    return (
        <section className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-24 text-white sm:px-6 lg:px-8">

            {/* Background Glow */}
            <div className="pointer-events-none absolute left-0 top-20 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl"></div>

            <div className="pointer-events-none absolute bottom-20 right-0 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl"></div>

            <div className="relative mx-auto max-w-none w-full">

                {/* Back Button */}
                <Link
                    to="/products"
                    className="mb-8 inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                    <ArrowLeft size={18} />
                    Back to Products
                </Link>

                {/* Main Product Card */}
                <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl lg:grid-cols-2">

                    {/* =========================
                        PRODUCT IMAGE
                    ========================= */}

                    <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden border-b border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 p-8 sm:p-12 lg:min-h-[650px] lg:border-b-0 lg:border-r">

                        {/* Glow */}
                        <div className="absolute h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl"></div>

                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                onError={(e) => {
                                    e.currentTarget.style.display =
                                        "none";

                                    if (
                                        e.currentTarget
                                            .nextElementSibling
                                    ) {
                                        e.currentTarget
                                            .nextElementSibling
                                            .style.display =
                                            "flex";
                                    }
                                }}
                                className="relative z-10 max-h-[500px] w-full max-w-lg rounded-2xl object-contain drop-shadow-2xl transition duration-500 hover:scale-105"
                            />
                        ) : null}

                        {/* Image Fallback */}
                        <div
                            className={`${
                                product.image
                                    ? "hidden"
                                    : "flex"
                            } relative z-10 h-80 w-full max-w-lg items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-500`}
                        >
                            <div className="text-center">

                                <Package
                                    size={64}
                                    className="mx-auto mb-4 opacity-40"
                                />

                                <span className="text-lg">
                                    No Image Available
                                </span>

                            </div>
                        </div>

                        {/* Stock Badge */}
                        <div
                            className={`absolute left-6 top-6 z-20 rounded-full border px-4 py-2 text-xs font-bold backdrop-blur-md ${
                                isInStock
                                    ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-400"
                                    : "border-red-400/20 bg-red-500/10 text-red-400"
                            }`}
                        >
                            {isInStock
                                ? "✓ IN STOCK"
                                : "OUT OF STOCK"}
                        </div>

                        {/* Wishlist */}
                        <button
                            type="button"
                            onClick={handleWishlist}
                            aria-label={
                                wishlisted
                                    ? "Remove from wishlist"
                                    : "Add to wishlist"
                            }
                            title={
                                wishlisted
                                    ? "Remove from wishlist"
                                    : "Add to wishlist"
                            }
                            className={`absolute right-6 top-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-90 ${
                                wishlisted
                                    ? "border-pink-400/30 bg-pink-500/15 text-pink-400 shadow-lg shadow-pink-500/20"
                                    : "border-white/10 bg-slate-950/70 text-white hover:border-pink-400/30 hover:bg-pink-500/10 hover:text-pink-400"
                            }`}
                        >
                            <Heart
                                size={21}
                                fill={
                                    wishlisted
                                        ? "currentColor"
                                        : "none"
                                }
                            />
                        </button>

                    </div>

                    {/* =========================
                        PRODUCT INFORMATION
                    ========================= */}

                    <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">

                        {/* Category */}
                        <span className="mb-5 inline-flex w-fit rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                            {product.category}
                        </span>

                        {/* Product Name */}
                        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="mt-5 flex flex-wrap items-center gap-3">

                            <div className="flex items-center gap-1.5 rounded-lg border border-yellow-400/10 bg-yellow-500/5 px-3 py-1.5">

                                <span className="text-lg text-yellow-400">
                                    ★
                                </span>

                                <span className="font-bold text-white">
                                    {rating.toFixed(1)}
                                </span>

                            </div>

                            <span className="text-sm text-slate-500">
                                {reviewCount} reviews
                            </span>

                            <span className="text-slate-700">
                                •
                            </span>

                            <span className="text-sm text-slate-400">
                                {product.category}
                            </span>

                        </div>

                        {/* Description */}
                        <p className="mt-6 text-base leading-7 text-slate-400 sm:text-lg">
                            {product.description ||
                                "Discover this amazing product at ShopEase."}
                        </p>

                        {/* Price */}
                        <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.03] p-5">

                            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Price
                            </p>

                            <div className="flex items-end justify-between gap-4">

                                <h2 className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
                                    ₹{Number(product.price || 0).toLocaleString("en-IN")}
                                </h2>

                                {isInStock && stock <= 5 && (
                                    <span className="rounded-full border border-yellow-400/20 bg-yellow-500/10 px-3 py-1.5 text-xs font-semibold text-yellow-300">
                                        Only {stock} left
                                    </span>
                                )}

                            </div>

                        </div>

                        {/* Stock Information */}
                        <div className="mt-6">

                            {isInStock ? (
                                <div className="flex items-center gap-3">

                                    <CheckCircle2
                                        size={20}
                                        className="text-emerald-400"
                                    />

                                    <div>
                                        <p className="text-sm font-semibold text-emerald-400">
                                            In Stock
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            {stock} items available
                                        </p>
                                    </div>

                                </div>
                            ) : (
                                <div className="flex items-center gap-3">

                                    <Package
                                        size={20}
                                        className="text-red-400"
                                    />

                                    <div>
                                        <p className="text-sm font-semibold text-red-400">
                                            Currently Out of Stock
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            Please check back later.
                                        </p>
                                    </div>

                                </div>
                            )}

                        </div>

                        {/* Quantity */}
                        {isInStock && (
                            <div className="mt-7">

                                <div className="mb-2 flex items-center justify-between">

                                    <label className="text-sm font-semibold text-slate-300">
                                        Quantity
                                    </label>

                                    <span className="text-xs text-slate-500">
                                        Maximum {stock}
                                    </span>

                                </div>

                                <div className="flex w-fit items-center overflow-hidden rounded-xl border border-white/10 bg-slate-900/70">

                                    <button
                                        type="button"
                                        onClick={decreaseQuantity}
                                        disabled={safeQuantity <= 1}
                                        className="flex h-12 w-12 items-center justify-center text-slate-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        <Minus size={18} />
                                    </button>

                                    <div className="flex h-12 min-w-14 items-center justify-center border-x border-white/10 px-4 text-lg font-bold">
                                        {safeQuantity}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={increaseQuantity}
                                        disabled={safeQuantity >= stock}
                                        className="flex h-12 w-12 items-center justify-center text-slate-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        <Plus size={18} />
                                    </button>

                                </div>

                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-8 grid gap-3 sm:grid-cols-2">

                            {/* Add To Cart */}
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={!isInStock}
                                className={`flex items-center justify-center gap-3 rounded-2xl px-6 py-4 text-base font-bold shadow-xl transition-all duration-300 ${
                                    !isInStock
                                        ? "cursor-not-allowed bg-slate-800 text-slate-500"
                                        : addedToCart
                                        ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300 shadow-emerald-500/10"
                                        : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-500/20 hover:-translate-y-1 hover:from-indigo-400 hover:to-purple-500 hover:shadow-indigo-500/30"
                                }`}
                            >
                                {addedToCart ? (
                                    <>
                                        <Check size={21} />
                                        Added to Cart
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={21} />
                                        Add to Cart
                                    </>
                                )}
                            </button>

                            {/* Buy Now */}
                            <button
                                type="button"
                                onClick={handleBuyNow}
                                disabled={!isInStock}
                                className={`flex items-center justify-center gap-3 rounded-2xl border px-6 py-4 text-base font-bold transition-all duration-300 ${
                                    !isInStock
                                        ? "cursor-not-allowed border-white/5 bg-slate-900 text-slate-600"
                                        : "border-pink-400/20 bg-pink-500/10 text-pink-300 hover:-translate-y-1 hover:border-pink-400/40 hover:bg-pink-500/15 hover:text-white"
                                }`}
                            >
                                <Zap size={21} />
                                Buy Now
                            </button>

                        </div>

                        {/* Wishlist Text Action */}
                        <button
                            type="button"
                            onClick={handleWishlist}
                            className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] py-3 text-sm font-semibold text-slate-400 transition hover:border-pink-400/20 hover:bg-pink-500/5 hover:text-pink-300"
                        >
                            <Heart
                                size={17}
                                fill={
                                    wishlisted
                                        ? "currentColor"
                                        : "none"
                                }
                            />

                            {wishlisted
                                ? "Remove from Wishlist"
                                : "Add to Wishlist"}
                        </button>

                        {/* Trust Features */}
                        <div className="mt-8 grid grid-cols-1 gap-3 border-t border-white/10 pt-7 sm:grid-cols-3">

                            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 text-center transition hover:bg-white/[0.05]">

                                <Truck
                                    size={22}
                                    className="mx-auto mb-2 text-indigo-400"
                                />

                                <p className="text-xs font-semibold text-slate-300">
                                    Fast Delivery
                                </p>

                            </div>

                            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 text-center transition hover:bg-white/[0.05]">

                                <ShieldCheck
                                    size={22}
                                    className="mx-auto mb-2 text-purple-400"
                                />

                                <p className="text-xs font-semibold text-slate-300">
                                    Secure Payment
                                </p>

                            </div>

                            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 text-center transition hover:bg-white/[0.05]">

                                <CheckCircle2
                                    size={22}
                                    className="mx-auto mb-2 text-emerald-400"
                                />

                                <p className="text-xs font-semibold text-slate-300">
                                    Quality Product
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

                {/* =========================
                    BOTTOM INFORMATION
                ========================= */}

                <div className="mt-8 grid gap-4 md:grid-cols-3">

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/20">

                        <Truck
                            className="mb-4 text-indigo-400"
                            size={25}
                        />

                        <h3 className="font-bold">
                            Fast & Reliable Delivery
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Get your order delivered safely and quickly to
                            your doorstep.
                        </p>

                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-purple-400/20">

                        <ShieldCheck
                            className="mb-4 text-purple-400"
                            size={25}
                        />

                        <h3 className="font-bold">
                            Secure Shopping
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Your shopping experience is protected with
                            secure payment options.
                        </p>

                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20">

                        <CheckCircle2
                            className="mb-4 text-emerald-400"
                            size={25}
                        />

                        <h3 className="font-bold">
                            Premium Quality
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Carefully selected products made for quality
                            and value.
                        </p>

                    </div>

                </div>

            </div>
        </section>
    );
}

export default ProductDetails;

