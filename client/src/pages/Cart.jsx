
import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Minus,
    Plus,
    Trash2,
    ShoppingBag,
    ArrowLeft,
    ShieldCheck,
    Truck,
    CreditCard,
    CheckCircle2,
    Package,
    Lock,
    Sparkles,
} from "lucide-react";

import { useCart } from "../context/CartContext";

function Cart() {
    const {
        cart,
        cartCount,
        cartTotal,
        removeFromCart,
        updateQuantity,
    } = useCart();

    const [removingProductId, setRemovingProductId] =
        useState(null);

    // =========================
    // REMOVE ITEM
    // =========================

    const handleRemove = (productId) => {
        setRemovingProductId(productId);

        setTimeout(() => {
            removeFromCart(productId);
            setRemovingProductId(null);
        }, 250);
    };

    // =========================
    // EMPTY CART
    // =========================

    if (cart.length === 0) {
        return (
            <section className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-24 text-white">

                {/* Background Glow */}
                <div className="pointer-events-none absolute left-0 top-20 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />

                <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />

                <div className="relative mx-auto flex min-h-[65vh] w-full max-w-none items-center justify-center">

                    <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center shadow-2xl backdrop-blur-xl sm:p-14">

                        <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full border border-indigo-400/10 bg-indigo-500/10 shadow-lg shadow-indigo-500/10">
                            <ShoppingBag
                                size={48}
                                className="text-indigo-400"
                            />
                        </div>

                        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-indigo-400">
                            Your Cart
                        </p>

                        <h1 className="text-3xl font-extrabold sm:text-4xl">
                            Your Cart is Empty
                        </h1>

                        <p className="mx-auto mt-4 max-w-md leading-7 text-slate-400">
                            Looks like you haven't added anything to your
                            cart yet. Explore our products and find something
                            you love.
                        </p>

                        <Link
                            to="/products"
                            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-7 py-3.5 font-bold shadow-lg shadow-indigo-500/20 transition duration-300 hover:-translate-y-1 hover:from-indigo-400 hover:to-purple-500"
                        >
                            <ShoppingBag size={19} />
                            Continue Shopping
                        </Link>

                    </div>

                </div>
            </section>
        );
    }

    return (
        <section className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-24 text-white sm:px-6 lg:px-8">

            {/* Background Glows */}
            <div className="pointer-events-none absolute left-0 top-20 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />

            <div className="pointer-events-none absolute bottom-20 right-0 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />

            <div className="relative mx-auto w-full max-w-none">

                {/* =========================
                    HEADER
                ========================= */}

                <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

                    <div>

                        <Link
                            to="/products"
                            className="mb-5 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                        >
                            <ArrowLeft size={17} />
                            Continue Shopping
                        </Link>

                        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">
                            Your Selection
                        </p>

                        <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
                            Shopping Cart
                        </h1>

                        <p className="mt-2 text-slate-400">
                            {cartCount} item
                            {cartCount !== 1 ? "s" : ""} in your cart
                        </p>

                    </div>

                    <div className="flex h-fit w-fit items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-5 py-2.5 text-sm font-semibold text-indigo-300">
                        <ShoppingBag size={18} />
                        {cartCount} Items
                    </div>

                </div>

                {/* =========================
                    FREE SHIPPING BANNER
                ========================= */}

                <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-emerald-400/10 bg-emerald-500/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                            <Truck
                                size={21}
                                className="text-emerald-400"
                            />
                        </div>

                        <div>
                            <p className="font-bold text-emerald-300">
                                Free Shipping Unlocked
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Enjoy free delivery on your ShopEase order.
                            </p>
                        </div>

                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                        <Sparkles size={15} />
                        No shipping charges
                    </div>

                </div>

                {/* =========================
                    CART LAYOUT
                ========================= */}

                <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

                    {/* =========================
                        CART ITEMS
                    ========================= */}

                    <div className="space-y-4">

                        {cart.map((item) => {
                            const stock =
                                Number(item.stock) || 0;

                            const quantity =
                                Number(item.quantity) || 1;

                            const isAtStockLimit =
                                stock > 0 &&
                                quantity >= stock;

                            const isRemoving =
                                removingProductId === item._id;

                            const itemTotal =
                                Number(item.price || 0) *
                                quantity;

                            return (
                                <div
                                    key={item._id}
                                    className={`group rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-xl backdrop-blur-xl transition-all duration-300 sm:p-5 ${
                                        isRemoving
                                            ? "scale-[0.98] opacity-40"
                                            : "hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]"
                                    }`}
                                >

                                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                                        {/* =========================
                                            PRODUCT IMAGE
                                        ========================= */}

                                        <div className="relative flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-900 sm:h-32 sm:w-32">

                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-110"
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
                                                />
                                            ) : null}

                                            <div
                                                className={`${
                                                    item.image
                                                        ? "hidden"
                                                        : "flex"
                                                } h-full w-full items-center justify-center`}
                                            >
                                                <div className="text-center text-xs text-slate-500">

                                                    <Package
                                                        size={30}
                                                        className="mx-auto mb-2 opacity-40"
                                                    />

                                                    No Image

                                                </div>
                                            </div>

                                        </div>

                                        {/* =========================
                                            PRODUCT INFO
                                        ========================= */}

                                        <div className="min-w-0 flex-1">

                                            <span className="inline-block rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
                                                {item.category}
                                            </span>

                                            <h2 className="mt-3 text-lg font-bold text-white sm:text-xl">
                                                {item.name}
                                            </h2>

                                            <p className="mt-1 text-sm text-slate-500">
                                                ₹
                                                {Number(
                                                    item.price || 0
                                                ).toLocaleString("en-IN", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}{" "}
                                                per item
                                            </p>

                                            {/* Stock Status */}
                                            <div className="mt-3 flex items-center gap-2">

                                                {stock === 0 ? (
                                                    <>
                                                        <Package
                                                            size={15}
                                                            className="text-red-400"
                                                        />

                                                        <span className="text-xs font-semibold text-red-400">
                                                            Out of stock
                                                        </span>
                                                    </>
                                                ) : isAtStockLimit ? (
                                                    <>
                                                        <CheckCircle2
                                                            size={15}
                                                            className="text-yellow-400"
                                                        />

                                                        <span className="text-xs font-semibold text-yellow-400">
                                                            Maximum available
                                                            quantity reached
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2
                                                            size={15}
                                                            className="text-emerald-400"
                                                        />

                                                        <span className="text-xs font-semibold text-emerald-400">
                                                            {stock} available
                                                        </span>
                                                    </>
                                                )}

                                            </div>

                                        </div>

                                        {/* =========================
                                            QUANTITY
                                        ========================= */}

                                        <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-center sm:gap-2">

                                            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                                Quantity
                                            </p>

                                            <div className="flex items-center overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-inner">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item._id,
                                                            quantity - 1
                                                        )
                                                    }
                                                    disabled={
                                                        quantity <= 1
                                                    }
                                                    aria-label="Decrease quantity"
                                                    className="flex h-10 w-10 items-center justify-center text-slate-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                                                >
                                                    <Minus size={16} />
                                                </button>

                                                <span className="flex h-10 min-w-11 items-center justify-center border-x border-white/10 px-3 text-sm font-bold text-white">
                                                    {quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item._id,
                                                            quantity + 1
                                                        )
                                                    }
                                                    disabled={
                                                        stock <= 0 ||
                                                        isAtStockLimit
                                                    }
                                                    aria-label="Increase quantity"
                                                    title={
                                                        isAtStockLimit
                                                            ? "Maximum stock reached"
                                                            : "Increase quantity"
                                                    }
                                                    className="flex h-10 w-10 items-center justify-center text-slate-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                                                >
                                                    <Plus size={16} />
                                                </button>

                                            </div>

                                            {stock > 0 && (
                                                <span className="text-[10px] text-slate-600">
                                                    Max {stock}
                                                </span>
                                            )}

                                        </div>

                                        {/* =========================
                                            ITEM TOTAL
                                        ========================= */}

                                        <div className="flex items-center justify-between border-t border-white/10 pt-4 sm:block sm:min-w-[120px] sm:border-0 sm:pt-0 sm:text-right">

                                            <p className="text-xs uppercase tracking-wider text-slate-500 sm:hidden">
                                                Total
                                            </p>

                                            <p className="text-xl font-extrabold text-white">
                                                ₹
                                                {itemTotal.toLocaleString(
                                                    "en-IN",
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    }
                                                )}
                                            </p>

                                            <p className="mt-1 hidden text-xs text-slate-600 sm:block">
                                                {quantity} × ₹
                                                {Number(
                                                    item.price || 0
                                                ).toLocaleString(
                                                    "en-IN",
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    }
                                                )}
                                            </p>

                                        </div>

                                        {/* =========================
                                            REMOVE
                                        ========================= */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemove(item._id)
                                            }
                                            disabled={isRemoving}
                                            aria-label={`Remove ${item.name}`}
                                            title="Remove item"
                                            className="flex h-10 w-10 shrink-0 items-center justify-center self-end rounded-xl border border-red-400/10 bg-red-500/5 text-red-400 transition hover:border-red-400/20 hover:bg-red-500/15 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50 sm:self-center"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                    {/* =========================
                        ORDER SUMMARY
                    ========================= */}

                    <div className="lg:sticky lg:top-24 lg:h-fit">

                        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-7">

                            {/* Summary Header */}
                            <div className="mb-6 flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10">
                                    <ShoppingBag
                                        size={21}
                                        className="text-indigo-400"
                                    />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold">
                                        Order Summary
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        Review your order
                                    </p>
                                </div>

                            </div>

                            {/* Summary Rows */}
                            <div className="space-y-4">

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">
                                        Items
                                    </span>

                                    <span className="font-semibold text-white">
                                        {cartCount}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">
                                        Subtotal
                                    </span>

                                    <span className="font-semibold text-white">
                                        ₹
                                        {cartTotal.toLocaleString(
                                            "en-IN",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">
                                        Shipping
                                    </span>

                                    <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                                        <CheckCircle2 size={15} />
                                        Free
                                    </span>
                                </div>

                            </div>

                            {/* Divider */}
                            <div className="my-6 h-px bg-white/10" />

                            {/* Total */}
                            <div className="flex items-end justify-between gap-4">

                                <div>
                                    <p className="text-sm text-slate-400">
                                        Total Amount
                                    </p>

                                    <p className="mt-1 text-xs text-slate-600">
                                        Inclusive of all applicable charges
                                    </p>
                                </div>

                                <strong className="text-2xl font-extrabold text-white">
                                    ₹
                                    {cartTotal.toLocaleString(
                                        "en-IN",
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </strong>

                            </div>

                            {/* Checkout */}
                            <Link
                                to="/checkout"
                                className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-sm font-bold shadow-lg shadow-indigo-500/20 transition duration-300 hover:-translate-y-1 hover:from-indigo-400 hover:to-purple-500 hover:shadow-indigo-500/30"
                            >
                                <Lock size={17} />
                                Proceed to Checkout
                            </Link>

                            {/* Continue Shopping */}
                            <Link
                                to="/products"
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
                            >
                                <ArrowLeft size={16} />
                                Continue Shopping
                            </Link>

                            {/* Trust */}
                            <div className="mt-7 space-y-3 border-t border-white/10 pt-6">

                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                    <Truck
                                        size={17}
                                        className="text-indigo-400"
                                    />
                                    Free & Fast Delivery
                                </div>

                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                    <ShieldCheck
                                        size={17}
                                        className="text-purple-400"
                                    />
                                    Secure Shopping Experience
                                </div>

                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                    <CreditCard
                                        size={17}
                                        className="text-emerald-400"
                                    />
                                    Safe & Secure Payments
                                </div>

                            </div>

                            {/* Secure Checkout Note */}
                            <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">

                                <Lock
                                    size={16}
                                    className="mt-0.5 shrink-0 text-slate-500"
                                />

                                <p className="text-[11px] leading-5 text-slate-500">
                                    Your checkout information is handled
                                    securely. We never store sensitive
                                    payment details.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}

export default Cart;

