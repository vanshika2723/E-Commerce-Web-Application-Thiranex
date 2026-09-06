
import { useEffect, useMemo, useState } from "react";
import {
    BarChart3,
    IndianRupee,
    ShoppingCart,
    Package,
    Users,
    TrendingUp,
    Clock3,
    CheckCircle,
    XCircle,
    Truck,
    Loader2,
} from "lucide-react";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminAnalytics() {
    const { token } = useAuth();

    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const [ordersRes, productsRes, usersRes] =
                await Promise.all([
                    API.get("/orders/admin/all", config),
                    API.get("/products", config),
                    API.get("/auth/users", config),
                ]);

            const ordersData = ordersRes.data;
            const productsData = productsRes.data;
            const usersData = usersRes.data;

            setOrders(
                Array.isArray(ordersData)
                    ? ordersData
                    : ordersData?.orders || ordersData?.data || []
            );

            setProducts(
                Array.isArray(productsData)
                    ? productsData
                    : productsData?.products || productsData?.data || []
            );

            setUsers(
                Array.isArray(usersData)
                    ? usersData
                    : usersData?.users ||
                          usersData?.data?.users ||
                          usersData?.data ||
                          []
            );
        } catch (error) {
            console.error("Analytics fetch error:", error);

            alert(
                error.response?.data?.message ||
                    "Failed to load analytics"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchAnalyticsData();
        }
    }, [token]);

    // =========================
    // MAIN STATS
    // =========================

    const stats = useMemo(() => {
        const validOrders = orders.filter(
            (order) => order.status !== "Cancelled"
        );

        const revenue = validOrders.reduce(
            (sum, order) => sum + Number(order.totalAmount || 0),
            0
        );

        const pending = orders.filter(
            (order) => order.status === "Pending"
        ).length;

        const processing = orders.filter(
            (order) => order.status === "Processing"
        ).length;

        const shipped = orders.filter(
            (order) => order.status === "Shipped"
        ).length;

        const delivered = orders.filter(
            (order) => order.status === "Delivered"
        ).length;

        const cancelled = orders.filter(
            (order) => order.status === "Cancelled"
        ).length;

        return {
            revenue,
            orders: orders.length,
            products: products.length,
            users: users.length,
            pending,
            processing,
            shipped,
            delivered,
            cancelled,
        };
    }, [orders, products, users]);

    // =========================
    // MONTHLY REVENUE
    // =========================

    const monthlyRevenue = useMemo(() => {
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        const result = months.map((month) => ({
            month,
            revenue: 0,
            orders: 0,
        }));

        orders.forEach((order) => {
            if (order.status === "Cancelled") return;

            const date = new Date(order.createdAt);

            if (Number.isNaN(date.getTime())) return;

            const monthIndex = date.getMonth();

            result[monthIndex].revenue += Number(
                order.totalAmount || 0
            );

            result[monthIndex].orders += 1;
        });

        return result;
    }, [orders]);

    const maxRevenue = Math.max(
        ...monthlyRevenue.map((item) => item.revenue),
        1
    );

    // =========================
    // TOP PRODUCTS
    // =========================

    const topProducts = useMemo(() => {
        const productMap = {};

        orders.forEach((order) => {
            if (order.status === "Cancelled") return;

            order.items?.forEach((item) => {
                const name = item.name || "Unknown Product";

                if (!productMap[name]) {
                    productMap[name] = {
                        name,
                        quantity: 0,
                        revenue: 0,
                    };
                }

                productMap[name].quantity += Number(
                    item.quantity || 0
                );

                productMap[name].revenue +=
                    Number(item.price || 0) *
                    Number(item.quantity || 0);
            });
        });

        return Object.values(productMap)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);
    }, [orders]);

    // =========================
    // RECENT ORDERS
    // =========================

    const recentOrders = useMemo(() => {
        return [...orders]
            .sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            )
            .slice(0, 6);
    }, [orders]);

    // =========================
    // FORMAT CURRENCY
    // =========================

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const statusStyles = {
        Pending:
            "bg-amber-500/10 text-amber-400 border-amber-500/20",

        Processing:
            "bg-blue-500/10 text-blue-400 border-blue-500/20",

        Shipped:
            "bg-purple-500/10 text-purple-400 border-purple-500/20",

        Delivered:
            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",

        Cancelled:
            "bg-red-500/10 text-red-400 border-red-500/20",
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
                <div className="flex items-center gap-3 text-slate-400">
                    <Loader2
                        size={25}
                        className="animate-spin text-indigo-400"
                    />
                    Loading analytics...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1600px]">

                {/* ================= HEADER ================= */}

                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                            <BarChart3 size={24} />
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
                                Admin Panel
                            </p>

                            <h1 className="text-2xl font-black sm:text-3xl">
                                Analytics
                            </h1>
                        </div>
                    </div>

                    <p className="mt-3 text-sm text-slate-400">
                        Monitor your store performance, revenue,
                        orders and customers.
                    </p>
                </div>

                {/* ================= STATS ================= */}

                <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <StatCard
                        title="Total Revenue"
                        value={formatCurrency(stats.revenue)}
                        icon={IndianRupee}
                        iconClass="bg-emerald-500/10 text-emerald-400"
                    />

                    <StatCard
                        title="Total Orders"
                        value={stats.orders}
                        icon={ShoppingCart}
                        iconClass="bg-blue-500/10 text-blue-400"
                    />

                    <StatCard
                        title="Total Products"
                        value={stats.products}
                        icon={Package}
                        iconClass="bg-purple-500/10 text-purple-400"
                    />

                    <StatCard
                        title="Total Users"
                        value={stats.users}
                        icon={Users}
                        iconClass="bg-pink-500/10 text-pink-400"
                    />

                </div>

                {/* ================= REVENUE ================= */}

                <div className="mb-8 grid gap-6 lg:grid-cols-[1.7fr_1fr]">

                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/10 backdrop-blur-xl">

                        <div className="mb-7 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold">
                                    Revenue Overview
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Monthly revenue performance
                                </p>
                            </div>

                            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                                <TrendingUp size={20} />
                            </div>
                        </div>

                        <div className="flex h-72 items-end gap-2 sm:gap-4">
                            {monthlyRevenue.map((item) => {
                                const height =
                                    item.revenue > 0
                                        ? Math.max(
                                              (item.revenue /
                                                  maxRevenue) *
                                                  100,
                                              5
                                          )
                                        : 4;

                                return (
                                    <div
                                        key={item.month}
                                        className="group flex h-full flex-1 flex-col items-center justify-end"
                                    >
                                        <div className="relative flex h-[90%] w-full items-end justify-center">

                                            <div
                                                className="w-full max-w-10 rounded-t-xl bg-gradient-to-t from-indigo-600 to-purple-400 transition-all duration-500 group-hover:from-indigo-500 group-hover:to-pink-400"
                                                style={{
                                                    height: `${height}%`,
                                                }}
                                            />

                                            {item.revenue > 0 && (
                                                <div className="absolute bottom-full mb-2 hidden whitespace-nowrap rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-[10px] text-white shadow-xl group-hover:block">
                                                    {formatCurrency(
                                                        item.revenue
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <span className="mt-3 text-[10px] text-slate-500 sm:text-xs">
                                            {item.month}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ================= ORDER STATUS ================= */}

                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/10 backdrop-blur-xl">

                        <div className="mb-6">
                            <h2 className="text-lg font-bold">
                                Order Status
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Current order distribution
                            </p>
                        </div>

                        <div className="space-y-4">

                            <StatusRow
                                icon={Clock3}
                                label="Pending"
                                value={stats.pending}
                                total={stats.orders}
                                className="text-amber-400"
                            />

                            <StatusRow
                                icon={Loader2}
                                label="Processing"
                                value={stats.processing}
                                total={stats.orders}
                                className="text-blue-400"
                            />

                            <StatusRow
                                icon={Truck}
                                label="Shipped"
                                value={stats.shipped}
                                total={stats.orders}
                                className="text-purple-400"
                            />

                            <StatusRow
                                icon={CheckCircle}
                                label="Delivered"
                                value={stats.delivered}
                                total={stats.orders}
                                className="text-emerald-400"
                            />

                            <StatusRow
                                icon={XCircle}
                                label="Cancelled"
                                value={stats.cancelled}
                                total={stats.orders}
                                className="text-red-400"
                            />

                        </div>
                    </div>
                </div>

                {/* ================= TOP PRODUCTS ================= */}

                <div className="mb-8 grid gap-6 lg:grid-cols-2">

                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/10 backdrop-blur-xl">

                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold">
                                    Top Selling Products
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Best performing products
                                </p>
                            </div>

                            <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400">
                                <Package size={20} />
                            </div>
                        </div>

                        {topProducts.length === 0 ? (
                            <EmptyState text="No sales data available yet." />
                        ) : (
                            <div className="space-y-4">
                                {topProducts.map(
                                    (product, index) => (
                                        <div
                                            key={product.name}
                                            className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4"
                                        >
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 font-black text-indigo-300">
                                                #{index + 1}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-bold">
                                                    {product.name}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {product.quantity}{" "}
                                                    units sold
                                                </p>
                                            </div>

                                            <p className="text-sm font-bold text-emerald-400">
                                                {formatCurrency(
                                                    product.revenue
                                                )}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {/* ================= SUMMARY ================= */}

                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/10 backdrop-blur-xl">

                        <div className="mb-6">
                            <h2 className="text-lg font-bold">
                                Store Summary
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Overall store statistics
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">

                            <SummaryBox
                                label="Active Orders"
                                value={
                                    stats.pending +
                                    stats.processing +
                                    stats.shipped
                                }
                                icon={ShoppingCart}
                            />

                            <SummaryBox
                                label="Delivered"
                                value={stats.delivered}
                                icon={CheckCircle}
                            />

                            <SummaryBox
                                label="Cancelled"
                                value={stats.cancelled}
                                icon={XCircle}
                            />

                            <SummaryBox
                                label="Customers"
                                value={users.filter(
                                    (user) =>
                                        user.role !== "admin"
                                ).length}
                                icon={Users}
                            />

                        </div>
                    </div>
                </div>

                {/* ================= RECENT ORDERS ================= */}

                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/10 backdrop-blur-xl">

                    <div className="border-b border-white/10 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold">
                                    Recent Orders
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Latest customer orders
                                </p>
                            </div>

                            <ShoppingCart
                                size={21}
                                className="text-indigo-400"
                            />
                        </div>
                    </div>

                    {recentOrders.length === 0 ? (
                        <EmptyState text="No orders found." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead>
                                    <tr className="border-b border-white/10 text-left">
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Customer
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Amount
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Date
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {recentOrders.map(
                                        (order) => (
                                            <tr
                                                key={order._id}
                                                className="border-b border-white/5 transition hover:bg-white/[0.03]"
                                            >
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-sm font-semibold">
                                                            {order.user
                                                                ?.name ||
                                                                "Guest"}
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            {order.user
                                                                ?.email ||
                                                                "-"}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-sm font-bold text-emerald-400">
                                                    {formatCurrency(
                                                        order.totalAmount
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                                                            statusStyles[
                                                                order
                                                                    .status
                                                            ] ||
                                                            "border-white/10 bg-white/5 text-slate-400"
                                                        }`}
                                                    >
                                                        {
                                                            order.status
                                                        }
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 text-sm text-slate-400">
                                                    {formatDate(
                                                        order.createdAt
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
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
        <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/10 backdrop-blur-xl transition hover:-translate-y-1 hover:border-indigo-500/20">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-400">
                        {title}
                    </p>

                    <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                        {value}
                    </h2>
                </div>

                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass}`}
                >
                    <Icon size={22} />
                </div>
            </div>
        </div>
    );
}

// =========================
// STATUS ROW
// =========================

function StatusRow({
    icon: Icon,
    label,
    value,
    total,
    className,
}) {
    const percentage =
        total > 0 ? (value / total) * 100 : 0;

    return (
        <div>
            <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon size={16} className={className} />

                    <span className="text-sm text-slate-300">
                        {label}
                    </span>
                </div>

                <span className="text-sm font-bold">
                    {value}
                </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <div
                    className="h-full rounded-full bg-current transition-all"
                    style={{
                        width: `${percentage}%`,
                    }}
                />
            </div>
        </div>
    );
}

// =========================
// SUMMARY BOX
// =========================

function SummaryBox({
    label,
    value,
    icon: Icon,
}) {
    return (
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-slate-500">
                        {label}
                    </p>

                    <p className="mt-2 text-2xl font-black">
                        {value}
                    </p>
                </div>

                <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                    <Icon size={20} />
                </div>
            </div>
        </div>
    );
}

// =========================
// EMPTY STATE
// =========================

function EmptyState({ text }) {
    return (
        <div className="flex min-h-32 items-center justify-center px-6 text-sm text-slate-500">
            {text}
        </div>
    );
}

export default AdminAnalytics;

