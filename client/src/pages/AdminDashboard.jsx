
import { useEffect, useState } from "react";
import {
    ShoppingBag,
    IndianRupee,
    Package,
    Users,
    Clock3,
    CheckCircle2,
    XCircle,
    Truck,
    Activity,
    ArrowRight,
    Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

import API from "../services/api";

function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const [ordersRes, productsRes, usersRes] =
                await Promise.all([
                    API.get("/orders/admin/all", { headers }),
                    API.get("/products"),
                    API.get("/auth/users", { headers }),
                ]);

            setOrders(
                Array.isArray(ordersRes.data)
                    ? ordersRes.data
                    : ordersRes.data?.orders || []
            );

            setProducts(
                Array.isArray(productsRes.data)
                    ? productsRes.data
                    : productsRes.data?.products || []
            );

            const userData = usersRes.data;

            setUsers(
                Array.isArray(userData)
                    ? userData
                    : userData?.users ||
                      userData?.data?.users ||
                      []
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                    "Failed to load dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // STATS
    // =========================

    const totalOrders = orders.length;

    const pending = orders.filter(
        (o) => o.status === "Pending"
    ).length;

    const delivered = orders.filter(
        (o) => o.status === "Delivered"
    ).length;

    const cancelled = orders.filter(
        (o) => o.status === "Cancelled"
    ).length;

    const revenue = orders
        .filter((o) => o.status !== "Cancelled")
        .reduce(
            (sum, o) =>
                sum + (Number(o.totalAmount) || 0),
            0
        );

    const lowStock = products.filter(
        (p) =>
            Number(p.stock) > 0 &&
            Number(p.stock) <= 5
    ).length;

    const outOfStock = products.filter(
        (p) => Number(p.stock) <= 0
    ).length;

    const activeOrders =
        totalOrders - delivered - cancelled;

    const recentOrders = [...orders]
        .sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        )
        .slice(0, 5);

    // =========================
    // STATUS STYLE
    // =========================

    const statusStyle = (status) => {
        const styles = {
            Pending: {
                icon: Clock3,
                className:
                    "bg-amber-500/10 text-amber-400 border-amber-500/20",
            },

            Processing: {
                icon: Activity,
                className:
                    "bg-blue-500/10 text-blue-400 border-blue-500/20",
            },

            Shipped: {
                icon: Truck,
                className:
                    "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
            },

            Delivered: {
                icon: CheckCircle2,
                className:
                    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
            },

            Cancelled: {
                icon: XCircle,
                className:
                    "bg-red-500/10 text-red-400 border-red-500/20",
            },
        };

        return (
            styles[status] || {
                icon: Package,
                className:
                    "bg-white/5 text-slate-400 border-white/10",
            }
        );
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center bg-slate-950 text-white">
                <div className="text-center">
                    <Loader2
                        size={40}
                        className="mx-auto animate-spin text-indigo-400"
                    />
                    <p className="mt-4 text-slate-400">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    // =========================
    // ERROR
    // =========================

    if (error) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center bg-slate-950 px-4 text-white">
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
                    <XCircle
                        size={40}
                        className="mx-auto text-red-400"
                    />

                    <p className="mt-4 text-slate-300">
                        {error}
                    </p>

                    <button
                        onClick={fetchDashboard}
                        className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold hover:bg-indigo-500"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">

            <div className="mx-auto max-w-[1500px]">

                {/* HEADER */}

                <div className="mb-8">
                    <p className="text-sm font-semibold text-indigo-400">
                        ADMIN PANEL
                    </p>

                    <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">
                        Dashboard
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Quick overview of your ShopEase store.
                    </p>
                </div>


                {/* MAIN STATS */}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <StatCard
                        title="Total Orders"
                        value={totalOrders}
                        icon={ShoppingBag}
                        iconClass="text-indigo-400 bg-indigo-500/10"
                    />

                    <StatCard
                        title="Total Revenue"
                        value={`₹${revenue.toFixed(2)}`}
                        icon={IndianRupee}
                        iconClass="text-emerald-400 bg-emerald-500/10"
                    />

                    <StatCard
                        title="Products"
                        value={products.length}
                        icon={Package}
                        iconClass="text-purple-400 bg-purple-500/10"
                    />

                    <StatCard
                        title="Users"
                        value={users.length}
                        icon={Users}
                        iconClass="text-blue-400 bg-blue-500/10"
                    />

                </div>


                {/* ORDER SUMMARY */}

                <div className="mt-6 grid gap-4 lg:grid-cols-3">

                    <SummaryCard
                        title="Pending Orders"
                        value={pending}
                        icon={Clock3}
                        className="text-amber-400"
                    />

                    <SummaryCard
                        title="Delivered Orders"
                        value={delivered}
                        icon={CheckCircle2}
                        className="text-emerald-400"
                    />

                    <SummaryCard
                        title="Active Orders"
                        value={activeOrders}
                        icon={Activity}
                        className="text-blue-400"
                    />

                </div>


                {/* RECENT ORDERS + INVENTORY */}

                <div className="mt-6 grid gap-6 lg:grid-cols-3">

                    {/* RECENT ORDERS */}

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 lg:col-span-2">

                        <div className="mb-5 flex items-center justify-between">

                            <div>
                                <h2 className="text-xl font-bold">
                                    Recent Orders
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Latest customer orders
                                </p>
                            </div>

                            <Link
                                to="/admin/orders"
                                className="flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                            >
                                View All
                                <ArrowRight size={15} />
                            </Link>

                        </div>


                        {recentOrders.length === 0 ? (
                            <p className="py-10 text-center text-slate-500">
                                No orders found.
                            </p>
                        ) : (
                            <div className="space-y-3">

                                {recentOrders.map((order) => {

                                    const style =
                                        statusStyle(
                                            order.status
                                        );

                                    const Icon =
                                        style.icon;

                                    return (
                                        <div
                                            key={order._id}
                                            className="flex flex-col gap-3 rounded-xl border border-white/5 bg-slate-900/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                                        >

                                            <div>
                                                <p className="font-mono text-sm font-bold">
                                                    #
                                                    {order._id
                                                        ?.slice(-8)
                                                        .toUpperCase()}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {order.user?.name ||
                                                        "Customer"}
                                                </p>
                                            </div>


                                            <div className="flex items-center justify-between gap-4 sm:justify-end">

                                                <span className="font-bold">
                                                    ₹
                                                    {Number(
                                                        order.totalAmount
                                                    ).toFixed(2)}
                                                </span>

                                                <span
                                                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${style.className}`}
                                                >
                                                    <Icon size={13} />
                                                    {order.status}
                                                </span>

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>
                        )}

                    </div>


                    {/* INVENTORY */}

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">

                        <div className="mb-5 flex items-center justify-between">

                            <div>
                                <h2 className="text-xl font-bold">
                                    Inventory
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Stock overview
                                </p>
                            </div>

                            <Package
                                size={22}
                                className="text-purple-400"
                            />

                        </div>


                        <div className="space-y-3">

                            <InventoryRow
                                title="Total Products"
                                value={products.length}
                            />

                            <InventoryRow
                                title="Low Stock"
                                value={lowStock}
                                valueClass="text-amber-400"
                            />

                            <InventoryRow
                                title="Out of Stock"
                                value={outOfStock}
                                valueClass="text-red-400"
                            />

                        </div>


                        <Link
                            to="/admin/products"
                            className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-indigo-500/10 py-3 text-sm font-semibold text-indigo-400 transition hover:bg-indigo-500/20"
                        >
                            Manage Products
                            <ArrowRight size={15} />
                        </Link>

                    </div>

                </div>


                {/* QUICK LINKS */}

                <div className="mt-6 grid gap-4 sm:grid-cols-3">

                    <QuickLink
                        to="/admin/products"
                        title="Products"
                        icon={Package}
                    />

                    <QuickLink
                        to="/admin/orders"
                        title="Orders"
                        icon={ShoppingBag}
                    />

                    <QuickLink
                        to="/admin/analytics"
                        title="Analytics"
                        icon={Activity}
                    />

                </div>

            </div>

        </div>
    );
}


// =========================
// STAT CARD
// =========================

function StatCard({
    title,
    value,
    icon: Icon,
    iconClass,
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:bg-white/[0.06]">

            <div
                className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
            >
                <Icon size={21} />
            </div>

            <p className="text-sm text-slate-400">
                {title}
            </p>

            <h3 className="mt-1 text-2xl font-extrabold">
                {value}
            </h3>

        </div>
    );
}


// =========================
// SUMMARY CARD
// =========================

function SummaryCard({
    title,
    value,
    icon: Icon,
    className,
}) {
    return (
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">

            <div className={`rounded-xl bg-white/5 p-3 ${className}`}>
                <Icon size={22} />
            </div>

            <div>
                <p className="text-sm text-slate-400">
                    {title}
                </p>

                <h3 className="text-2xl font-bold">
                    {value}
                </h3>
            </div>

        </div>
    );
}


// =========================
// INVENTORY ROW
// =========================

function InventoryRow({
    title,
    value,
    valueClass = "text-white",
}) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/60 px-4 py-3">

            <span className="text-sm text-slate-400">
                {title}
            </span>

            <span className={`font-bold ${valueClass}`}>
                {value}
            </span>

        </div>
    );
}


// =========================
// QUICK LINK
// =========================

function QuickLink({
    to,
    title,
    icon: Icon,
}) {
    return (
        <Link
            to={to}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-indigo-400/20 hover:bg-white/[0.06]"
        >

            <div className="flex items-center gap-3">

                <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                    <Icon size={20} />
                </div>

                <span className="font-bold">
                    {title}
                </span>

            </div>

            <ArrowRight
                size={18}
                className="text-slate-500"
            />

        </Link>
    );
}

export default AdminDashboard;

