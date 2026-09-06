
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Package,
    MapPin,
    Calendar,
    ShoppingBag,
    ArrowRight,
    Truck,
    CheckCircle2,
    Clock3,
    XCircle,
    Loader2,
    ShieldCheck,
    RefreshCw,
} from "lucide-react";

import API from "../services/api";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setError("");

            const token = localStorage.getItem("token");

            const response = await API.get("/orders/my-orders", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setOrders(response.data.orders || response.data || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Failed to load orders."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setLoading(true);
        fetchOrders();
    };

    const getStatusStyles = (status = "") => {
        const normalizedStatus = status.toLowerCase();

        if (
            normalizedStatus.includes("deliver") ||
            normalizedStatus.includes("complete")
        ) {
            return {
                wrapper:
                    "border-emerald-400/20 bg-emerald-500/10 text-emerald-400",
                icon: CheckCircle2,
            };
        }

        if (
            normalizedStatus.includes("cancel") ||
            normalizedStatus.includes("fail")
        ) {
            return {
                wrapper:
                    "border-red-400/20 bg-red-500/10 text-red-400",
                icon: XCircle,
            };
        }

        if (
            normalizedStatus.includes("pending") ||
            normalizedStatus.includes("process")
        ) {
            return {
                wrapper:
                    "border-amber-400/20 bg-amber-500/10 text-amber-400",
                icon: Clock3,
            };
        }

        return {
            wrapper:
                "border-indigo-400/20 bg-indigo-500/10 text-indigo-400",
            icon: Truck,
        };
    };

    const formatStatus = (status = "Processing") => {
        return status
            .toString()
            .replace(/[_-]/g, " ")
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Date unavailable";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatPrice = (price) => {
        const amount = Number(price);

        return Number.isFinite(amount)
            ? `₹${amount.toFixed(2)}`
            : "₹0.00";
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <section className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-24 text-white sm:px-6 lg:px-8">

                <div className="pointer-events-none absolute left-0 top-20 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />

                <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />

                <div className="relative mx-auto flex min-h-[65vh] w-full items-center justify-center">

                    <div className="text-center">

                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl">
                            <Loader2
                                size={28}
                                className="animate-spin text-indigo-400"
                            />
                        </div>

                        <h1 className="text-2xl font-bold">
                            My Orders
                        </h1>

                        <p className="mt-2 text-sm text-slate-400">
                            Loading your orders...
                        </p>

                    </div>

                </div>
            </section>
        );
    }

    // =========================
    // ERROR
    // =========================

    if (error) {
        return (
            <section className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-24 text-white sm:px-6 lg:px-8">

                <div className="pointer-events-none absolute left-0 top-20 h-80 w-80 rounded-full bg-red-600/10 blur-3xl" />

                <div className="relative mx-auto flex min-h-[65vh] w-full items-center justify-center">

                    <div className="w-full max-w-lg rounded-3xl border border-red-400/20 bg-red-500/[0.05] p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10">

                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-red-400/10 bg-red-500/10">
                            <XCircle
                                size={42}
                                className="text-red-400"
                            />
                        </div>

                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                            Something went wrong
                        </p>

                        <h1 className="text-2xl font-extrabold">
                            Unable to Load Orders
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            {error}
                        </p>

                        <button
                            onClick={handleRefresh}
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 font-semibold shadow-lg shadow-indigo-500/20 transition duration-300 hover:-translate-y-1 hover:from-indigo-400 hover:to-purple-500"
                        >
                            <RefreshCw size={17} />
                            Try Again
                        </button>

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

            <div className="relative mx-auto w-full max-w-7xl">

                {/* =========================
                    PAGE HEADER
                ========================= */}

                <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

                    <div>

                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
                            <Package size={17} />
                            Your Shopping Activity
                        </div>

                        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                            My Orders
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                            Track your purchases, delivery details, and
                            order status in one place.
                        </p>

                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                        <div className="flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-5 py-2.5 text-sm font-semibold text-indigo-300">
                            <Package size={18} />

                            {orders.length}{" "}
                            {orders.length === 1
                                ? "Order"
                                : "Orders"}
                        </div>

                        <button
                            onClick={handleRefresh}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-300 transition duration-300 hover:bg-white/[0.08] hover:text-white"
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>

                    </div>

                </div>

                {/* =========================
                    EMPTY ORDERS
                ========================= */}

                {orders.length === 0 ? (
                    <div className="flex min-h-[55vh] items-center justify-center">

                        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center shadow-2xl backdrop-blur-xl sm:p-14">

                            <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full border border-indigo-400/10 bg-indigo-500/10">
                                <Package
                                    size={48}
                                    className="text-indigo-400"
                                />
                            </div>

                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
                                Your order history
                            </p>

                            <h2 className="mt-3 text-3xl font-extrabold">
                                No Orders Yet
                            </h2>

                            <p className="mt-4 leading-7 text-slate-400">
                                You haven't placed any orders yet.
                                Explore our collection and find something
                                you'll love.
                            </p>

                            <Link
                                to="/products"
                                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-7 py-3.5 font-bold shadow-lg shadow-indigo-500/20 transition duration-300 hover:-translate-y-1 hover:from-indigo-400 hover:to-purple-500"
                            >
                                <ShoppingBag size={19} />
                                Start Shopping
                                <ArrowRight size={18} />
                            </Link>

                        </div>

                    </div>
                ) : (

                    /* =========================
                       ORDERS LIST
                    ========================= */

                    <div className="space-y-6">

                        {orders.map((order) => {

                            const statusStyle =
                                getStatusStyles(order.status);

                            const StatusIcon =
                                statusStyle.icon;

                            const shippingAddress =
                                order.shippingAddress || {};

                            const orderItems =
                                Array.isArray(order.items)
                                    ? order.items
                                    : [];

                            return (
                                <article
                                    key={order._id}
                                    className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl transition duration-300 hover:border-white/20 hover:bg-white/[0.055]"
                                >

                                    {/* =========================
                                        ORDER HEADER
                                    ========================= */}

                                    <div className="border-b border-white/10 bg-white/[0.02] p-5 sm:p-6">

                                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                            {/* Order ID */}

                                            <div className="min-w-0">

                                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                    Order ID
                                                </p>

                                                <h2 className="mt-1 truncate font-mono text-lg font-bold text-white">
                                                    #
                                                    {order._id
                                                        ? order._id
                                                              .slice(-8)
                                                              .toUpperCase()
                                                        : "UNKNOWN"}
                                                </h2>

                                            </div>

                                            {/* Date */}

                                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                                <Calendar
                                                    size={17}
                                                    className="text-indigo-400"
                                                />

                                                {formatDate(
                                                    order.createdAt
                                                )}
                                            </div>

                                            {/* Status */}

                                            <div
                                                className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide ${statusStyle.wrapper}`}
                                            >
                                                <StatusIcon size={16} />

                                                {formatStatus(
                                                    order.status
                                                )}
                                            </div>

                                        </div>

                                    </div>

                                    {/* =========================
                                        ORDER ITEMS
                                    ========================= */}

                                    <div className="p-5 sm:p-6">

                                        <div className="mb-4 flex items-center justify-between gap-4">

                                            <div className="flex items-center gap-2">

                                                <ShoppingBag
                                                    size={18}
                                                    className="text-indigo-400"
                                                />

                                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                                                    Order Items
                                                </h3>

                                            </div>

                                            <span className="text-xs font-medium text-slate-500">
                                                {orderItems.length}{" "}
                                                {orderItems.length === 1
                                                    ? "item"
                                                    : "items"}
                                            </span>

                                        </div>

                                        <div className="space-y-3">

                                            {orderItems.length === 0 ? (

                                                <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5 text-center text-sm text-slate-500">
                                                    No item details
                                                    available.
                                                </div>

                                            ) : (

                                                orderItems.map(
                                                    (item, index) => (

                                                        <div
                                                            key={
                                                                item._id ||
                                                                index
                                                            }
                                                            className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/[0.025] p-4 transition duration-300 hover:border-white/10 hover:bg-white/[0.04] sm:flex-row sm:items-center"
                                                        >

                                                            {/* Product Image */}

                                                            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-900">

                                                                {item.image ? (
                                                                    <img
                                                                        src={
                                                                            item.image
                                                                        }
                                                                        alt={
                                                                            item.name ||
                                                                            "Product"
                                                                        }
                                                                        className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-105"
                                                                        onError={(
                                                                            event
                                                                        ) => {
                                                                            event.currentTarget.style.display =
                                                                                "none";
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <Package
                                                                        size={
                                                                            30
                                                                        }
                                                                        className="text-slate-600"
                                                                    />
                                                                )}

                                                            </div>

                                                            {/* Product Info */}

                                                            <div className="min-w-0 flex-1">

                                                                <h4 className="break-words text-base font-bold text-white">
                                                                    {item.name ||
                                                                        "Product"}
                                                                </h4>

                                                                <p className="mt-1 text-sm text-slate-500">
                                                                    {formatPrice(
                                                                        item.price
                                                                    )}{" "}
                                                                    ×{" "}
                                                                    {item.quantity ||
                                                                        0}
                                                                </p>

                                                            </div>

                                                            {/* Item Total */}

                                                            <div className="text-left sm:text-right">

                                                                <p className="text-xs uppercase tracking-wider text-slate-600">
                                                                    Item Total
                                                                </p>

                                                                <strong className="text-lg font-extrabold text-white">
                                                                    {formatPrice(
                                                                        Number(
                                                                            item.price
                                                                        ) *
                                                                            Number(
                                                                                item.quantity
                                                                            )
                                                                    )}
                                                                </strong>

                                                            </div>

                                                        </div>

                                                    )
                                                )
                                            )}

                                        </div>

                                    </div>

                                    {/* =========================
                                        SHIPPING ADDRESS
                                    ========================= */}

                                    <div className="border-t border-white/10 px-5 py-6 sm:px-6">

                                        <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5">

                                            <div className="mb-4 flex items-center gap-3">

                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
                                                    <MapPin
                                                        size={19}
                                                        className="text-indigo-400"
                                                    />
                                                </div>

                                                <div>
                                                    <h3 className="font-bold">
                                                        Delivery Address
                                                    </h3>

                                                    <p className="text-xs text-slate-500">
                                                        Shipping information
                                                    </p>
                                                </div>

                                            </div>

                                            <div className="space-y-1 text-sm leading-6 text-slate-400">

                                                <p>
                                                    <span className="font-semibold text-slate-200">
                                                        {shippingAddress.fullName ||
                                                            "Name unavailable"}
                                                    </span>

                                                    {shippingAddress.phone && (
                                                        <>
                                                            {" • "}
                                                            {
                                                                shippingAddress.phone
                                                            }
                                                        </>
                                                    )}
                                                </p>

                                                <p>
                                                    {shippingAddress.address ||
                                                        "Address unavailable"}

                                                    {shippingAddress.city &&
                                                        `, ${shippingAddress.city}`}

                                                    {shippingAddress.state &&
                                                        `, ${shippingAddress.state}`}

                                                    {shippingAddress.pincode &&
                                                        ` - ${shippingAddress.pincode}`}
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                    {/* =========================
                                        ORDER FOOTER
                                    ========================= */}

                                    <div className="border-t border-white/10 bg-white/[0.02] p-5 sm:p-6">

                                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                                                    <ShieldCheck
                                                        size={20}
                                                        className="text-emerald-400"
                                                    />
                                                </div>

                                                <div>
                                                    <p className="text-xs text-slate-500">
                                                        Secure Order
                                                    </p>

                                                    <p className="text-sm font-semibold text-slate-300">
                                                        Thank you for
                                                        shopping with
                                                        ShopEase
                                                    </p>
                                                </div>

                                            </div>

                                            <div className="flex items-center justify-between gap-8 sm:justify-end">

                                                <span className="text-sm font-medium text-slate-400">
                                                    Total Amount
                                                </span>

                                                <strong className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-2xl font-extrabold text-transparent">
                                                    {formatPrice(
                                                        order.totalAmount
                                                    )}
                                                </strong>

                                            </div>

                                        </div>

                                    </div>

                                </article>
                            );
                        })}

                    </div>
                )}

            </div>
        </section>
    );
}

export default Orders;

