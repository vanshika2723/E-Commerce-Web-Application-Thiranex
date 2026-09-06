import { useEffect, useMemo, useState } from "react";
import {
    Search,
    ShoppingCart,
    Package,
    User,
    CalendarDays,
    IndianRupee,
    RefreshCw,
    Truck,
    CheckCircle,
    Clock,
    XCircle,
    Eye,
} from "lucide-react";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminOrders() {
    const { token } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [selectedOrder, setSelectedOrder] = useState(null);

    // =========================
    // FETCH ORDERS
    // =========================

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const response = await API.get("/orders/admin/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data;

            let orderList = [];

            if (Array.isArray(data)) {
                orderList = data;
            } else if (Array.isArray(data.orders)) {
                orderList = data.orders;
            } else if (Array.isArray(data.data)) {
                orderList = data.data;
            } else if (Array.isArray(data.data?.orders)) {
                orderList = data.data.orders;
            }

            setOrders(orderList);
        } catch (error) {
            console.error(
                "Orders fetch error:",
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    // =========================
    // UPDATE ORDER STATUS
    // =========================

    const updateOrderStatus = async (orderId, newStatus) => {
        if (!token || !orderId || !newStatus) return;

        try {
            setUpdatingId(orderId);

            await API.put(
                `/orders/admin/${orderId}/status`,
                {
                    status: newStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update table
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId
                        ? {
                              ...order,
                              status: newStatus,
                          }
                        : order
                )
            );

            // Update modal
            setSelectedOrder((prev) =>
                prev && prev._id === orderId
                    ? {
                          ...prev,
                          status: newStatus,
                      }
                    : prev
            );
        } catch (error) {
            console.error(
                "Status update error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                    "Failed to update order status."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    // =========================
    // SEARCH + FILTER
    // =========================

    const filteredOrders = useMemo(() => {
        const searchText = search.toLowerCase().trim();

        return orders.filter((order) => {
            const customerName =
                order.user?.name ||
                order.user?.username ||
                order.customer?.name ||
                order.customerName ||
                "";

            const customerEmail =
                order.user?.email ||
                order.customer?.email ||
                order.email ||
                "";

            const orderId =
                order._id ||
                order.id ||
                "";

            const status = order.status || "";

            const matchesSearch =
                !searchText ||
                customerName.toLowerCase().includes(searchText) ||
                customerEmail.toLowerCase().includes(searchText) ||
                orderId.toLowerCase().includes(searchText);

            const matchesStatus =
                statusFilter === "ALL" ||
                status.toUpperCase() === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [orders, search, statusFilter]);

    // =========================
    // STATS
    // =========================

    const stats = useMemo(() => {
        const total = orders.length;

        const pending = orders.filter((order) =>
            ["PENDING", "PROCESSING"].includes(
                (order.status || "").toUpperCase()
            )
        ).length;

        const shipped = orders.filter(
            (order) =>
                (order.status || "").toUpperCase() === "SHIPPED"
        ).length;

        const delivered = orders.filter(
            (order) =>
                (order.status || "").toUpperCase() === "DELIVERED"
        ).length;

        const cancelled = orders.filter(
            (order) =>
                (order.status || "").toUpperCase() === "CANCELLED"
        ).length;

        const revenue = orders
            .filter(
                (order) =>
                    (order.status || "").toUpperCase() !== "CANCELLED"
            )
            .reduce((totalAmount, order) => {
                return (
                    totalAmount +
                    Number(
                        order.totalAmount ??
                            order.total ??
                            order.amount ??
                            order.price ??
                            0
                    )
                );
            }, 0);

        return {
            total,
            pending,
            shipped,
            delivered,
            cancelled,
            revenue,
        };
    }, [orders]);

    // =========================
    // STATUS STYLE
    // =========================

    const getStatusStyle = (status) => {
        switch ((status || "").toUpperCase()) {
            case "DELIVERED":
                return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

            case "SHIPPED":
                return "bg-blue-500/10 text-blue-400 border-blue-500/20";

            case "PROCESSING":
                return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";

            case "PENDING":
                return "bg-amber-500/10 text-amber-400 border-amber-500/20";

            case "CANCELLED":
                return "bg-red-500/10 text-red-400 border-red-500/20";

            default:
                return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        }
    };

    // =========================
    // STATUS ICON
    // =========================

    const getStatusIcon = (status) => {
        switch ((status || "").toUpperCase()) {
            case "DELIVERED":
                return <CheckCircle size={15} />;

            case "SHIPPED":
                return <Truck size={15} />;

            case "PROCESSING":
                return <Package size={15} />;

            case "CANCELLED":
                return <XCircle size={15} />;

            default:
                return <Clock size={15} />;
        }
    };

    // =========================
    // CUSTOMER
    // =========================

    const getCustomerName = (order) => {
        return (
            order.user?.name ||
            order.customer?.name ||
            order.customerName ||
            "Guest Customer"
        );
    };

    const getCustomerEmail = (order) => {
        return (
            order.user?.email ||
            order.customer?.email ||
            order.email ||
            "No email"
        );
    };

    // =========================
    // ORDER TOTAL
    // =========================

    const getOrderTotal = (order) => {
        return Number(
            order.totalAmount ??
                order.total ??
                order.amount ??
                order.price ??
                0
        );
    };

    // =========================
    // ORDER DATE
    // =========================

    const getOrderDate = (order) => {
        const date =
            order.createdAt ||
            order.created_at ||
            order.orderDate ||
            order.date;

        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // =========================
    // ITEMS COUNT
    // =========================

    const getItemsCount = (order) => {
        if (Array.isArray(order.items)) {
            return order.items.reduce(
                (total, item) =>
                    total + Number(item.quantity || 1),
                0
            );
        }

        if (Array.isArray(order.products)) {
            return order.products.reduce(
                (total, item) =>
                    total + Number(item.quantity || 1),
                0
            );
        }

        return order.itemsCount || 0;
    };

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1600px]">

                {/* ================= HEADER ================= */}

                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                                <ShoppingCart size={23} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold sm:text-3xl">
                                    Orders
                                </h1>

                                <p className="text-sm text-slate-400">
                                    Manage and track all customer orders
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={fetchOrders}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw
                            size={18}
                            className={loading ? "animate-spin" : ""}
                        />

                        Refresh Orders
                    </button>
                </div>

                {/* ================= STATS ================= */}

                <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

                    {/* TOTAL */}

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                                <ShoppingCart size={19} />
                            </div>

                            <span className="text-xs font-medium text-slate-500">
                                ALL ORDERS
                            </span>
                        </div>

                        <p className="text-2xl font-bold">
                            {stats.total}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Total orders
                        </p>
                    </div>

                    {/* PENDING */}

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                                <Clock size={19} />
                            </div>

                            <span className="text-xs font-medium text-slate-500">
                                PENDING
                            </span>
                        </div>

                        <p className="text-2xl font-bold">
                            {stats.pending}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Pending / processing
                        </p>
                    </div>

                    {/* SHIPPED */}

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                                <Truck size={19} />
                            </div>

                            <span className="text-xs font-medium text-slate-500">
                                SHIPPED
                            </span>
                        </div>

                        <p className="text-2xl font-bold">
                            {stats.shipped}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Orders in transit
                        </p>
                    </div>

                    {/* DELIVERED */}

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                                <CheckCircle size={19} />
                            </div>

                            <span className="text-xs font-medium text-slate-500">
                                DELIVERED
                            </span>
                        </div>

                        <p className="text-2xl font-bold">
                            {stats.delivered}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Successfully delivered
                        </p>
                    </div>

                    {/* REVENUE */}

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                <IndianRupee size={19} />
                            </div>

                            <span className="text-xs font-medium text-slate-500">
                                REVENUE
                            </span>
                        </div>

                        <p className="text-2xl font-bold">
                            ₹{stats.revenue.toLocaleString("en-IN")}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Excluding cancelled
                        </p>
                    </div>
                </div>

                {/* ================= FILTER BAR ================= */}

                <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
                    <div className="flex flex-col gap-4 lg:flex-row">

                        {/* SEARCH */}

                        <div className="relative flex-1">
                            <Search
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                            />

                            <input
                                type="text"
                                placeholder="Search by customer, email or order ID..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500/50"
                            />
                        </div>

                        {/* STATUS FILTER */}

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500/50"
                        >
                            <option value="ALL">
                                All Status
                            </option>

                            <option value="PENDING">
                                Pending
                            </option>

                            <option value="PROCESSING">
                                Processing
                            </option>

                            <option value="SHIPPED">
                                Shipped
                            </option>

                            <option value="DELIVERED">
                                Delivered
                            </option>

                            <option value="CANCELLED">
                                Cancelled
                            </option>
                        </select>
                    </div>
                </div>

                {/* ================= ORDERS TABLE ================= */}

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl">
                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1100px]">

                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.03] text-left text-xs uppercase tracking-wider text-slate-500">

                                    <th className="px-6 py-4">
                                        Order
                                    </th>

                                    <th className="px-6 py-4">
                                        Customer
                                    </th>

                                    <th className="px-6 py-4">
                                        Items
                                    </th>

                                    <th className="px-6 py-4">
                                        Amount
                                    </th>

                                    <th className="px-6 py-4">
                                        Date
                                    </th>

                                    <th className="px-6 py-4">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Action
                                    </th>

                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/5">

                                {/* LOADING */}

                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-20 text-center"
                                        >
                                            <RefreshCw
                                                size={28}
                                                className="mx-auto mb-3 animate-spin text-indigo-400"
                                            />

                                            <p className="text-sm text-slate-500">
                                                Loading orders...
                                            </p>
                                        </td>
                                    </tr>
                                ) : filteredOrders.length === 0 ? (

                                    /* EMPTY */

                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-20 text-center"
                                        >
                                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-slate-600">
                                                <ShoppingCart size={28} />
                                            </div>

                                            <p className="mt-4 font-semibold text-slate-300">
                                                No orders found
                                            </p>

                                            <p className="mt-1 text-sm text-slate-600">
                                                Try changing your search or filter.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (

                                    filteredOrders.map((order) => {
                                        const status =
                                            order.status || "Pending";

                                        const orderId =
                                            order._id ||
                                            order.id ||
                                            "N/A";

                                        return (
                                            <tr
                                                key={orderId}
                                                className="transition hover:bg-white/[0.03]"
                                            >

                                                {/* ORDER */}

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                                                            <Package size={18} />
                                                        </div>

                                                        <div>
                                                            <p className="font-semibold text-white">
                                                                #
                                                                {orderId
                                                                    .toString()
                                                                    .slice(-8)
                                                                    .toUpperCase()}
                                                            </p>

                                                            <p className="mt-1 text-[11px] text-slate-600">
                                                                Order ID
                                                            </p>
                                                        </div>

                                                    </div>
                                                </td>

                                                {/* CUSTOMER */}

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 text-indigo-300">
                                                            <User size={16} />
                                                        </div>

                                                        <div>
                                                            <p className="font-medium text-slate-200">
                                                                {getCustomerName(order)}
                                                            </p>

                                                            <p className="max-w-[190px] truncate text-xs text-slate-500">
                                                                {getCustomerEmail(order)}
                                                            </p>
                                                        </div>

                                                    </div>
                                                </td>

                                                {/* ITEMS */}

                                                <td className="px-6 py-5">
                                                    <span className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
                                                        {getItemsCount(order)}{" "}
                                                        {getItemsCount(order) === 1
                                                            ? "item"
                                                            : "items"}
                                                    </span>
                                                </td>

                                                {/* AMOUNT */}

                                                <td className="px-6 py-5">
                                                    <p className="font-bold text-white">
                                                        ₹
                                                        {getOrderTotal(
                                                            order
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </p>
                                                </td>

                                                {/* DATE */}

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                                        <CalendarDays
                                                            size={15}
                                                            className="text-slate-600"
                                                        />

                                                        {getOrderDate(order)}
                                                    </div>
                                                </td>

                                                {/* STATUS */}

                                                <td className="px-6 py-5">

                                                    <select
                                                        value={status}
                                                        disabled={
                                                            updatingId ===
                                                            orderId
                                                        }
                                                        onChange={(e) =>
                                                            updateOrderStatus(
                                                                orderId,
                                                                e.target.value
                                                            )
                                                        }
                                                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold outline-none ${getStatusStyle(
                                                            status
                                                        )}`}
                                                    >

                                                        <option value="Pending">
                                                            Pending
                                                        </option>

                                                        <option value="Processing">
                                                            Processing
                                                        </option>

                                                        <option value="Shipped">
                                                            Shipped
                                                        </option>

                                                        <option value="Delivered">
                                                            Delivered
                                                        </option>

                                                        <option value="Cancelled">
                                                            Cancelled
                                                        </option>

                                                    </select>

                                                    {updatingId === orderId && (
                                                        <RefreshCw
                                                            size={13}
                                                            className="ml-2 inline animate-spin text-indigo-400"
                                                        />
                                                    )}

                                                </td>

                                                {/* ACTION */}

                                                <td className="px-6 py-5">
                                                    <div className="flex justify-end">

                                                        <button
                                                            onClick={() =>
                                                                setSelectedOrder(
                                                                    order
                                                                )
                                                            }
                                                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 transition hover:bg-indigo-500/20"
                                                            title="View Order"
                                                        >
                                                            <Eye size={16} />
                                                        </button>

                                                    </div>
                                                </td>

                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ================= RESULTS ================= */}

                {!loading && (
                    <div className="mt-4 flex justify-between text-xs text-slate-600">
                        <span>
                            Showing {filteredOrders.length} of{" "}
                            {orders.length} orders
                        </span>
                    </div>
                )}
            </div>

            {/* ================= ORDER DETAILS MODAL ================= */}

            {selectedOrder && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedOrder(null)}
                >

                    <div
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* MODAL HEADER */}

                        <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-slate-900 px-6 py-5">

                            <div>
                                <p className="text-xs uppercase tracking-wider text-indigo-400">
                                    Order Details
                                </p>

                                <h2 className="mt-1 text-xl font-bold">
                                    #
                                    {(selectedOrder._id ||
                                        selectedOrder.id ||
                                        "")
                                        .toString()
                                        .slice(-8)
                                        .toUpperCase()}
                                </h2>
                            </div>

                            <button
                                onClick={() =>
                                    setSelectedOrder(null)
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                            >
                                <XCircle size={19} />
                            </button>

                        </div>

                        <div className="space-y-6 p-6">

                            {/* CUSTOMER */}

                            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">

                                <div className="mb-4 flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                                        <User size={18} />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold">
                                            Customer
                                        </h3>

                                        <p className="text-xs text-slate-500">
                                            Customer information
                                        </p>
                                    </div>

                                </div>

                                <p className="font-medium text-white">
                                    {getCustomerName(selectedOrder)}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    {getCustomerEmail(selectedOrder)}
                                </p>

                            </div>

                            {/* ORDER INFO */}

                            <div className="grid gap-4 sm:grid-cols-2">

                                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">

                                    <p className="text-xs text-slate-500">
                                        Total Amount
                                    </p>

                                    <p className="mt-2 text-xl font-bold text-white">
                                        ₹
                                        {getOrderTotal(
                                            selectedOrder
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>

                                </div>

                                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">

                                    <p className="text-xs text-slate-500">
                                        Order Date
                                    </p>

                                    <p className="mt-2 font-semibold text-white">
                                        {getOrderDate(
                                            selectedOrder
                                        )}
                                    </p>

                                </div>

                            </div>

                            {/* STATUS */}

                            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">

                                <div className="mb-4">

                                    <p className="text-xs text-slate-500">
                                        Current Status
                                    </p>

                                    <div
                                        className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                                            selectedOrder.status
                                        )}`}
                                    >

                                        {getStatusIcon(
                                            selectedOrder.status
                                        )}

                                        {selectedOrder.status ||
                                            "Pending"}

                                    </div>

                                </div>

                                <label className="mb-2 block text-xs text-slate-500">
                                    Update Status
                                </label>

                                <select
                                    value={
                                        selectedOrder.status ||
                                        "Pending"
                                    }
                                    disabled={
                                        updatingId ===
                                        selectedOrder._id
                                    }
                                    onChange={(e) =>
                                        updateOrderStatus(
                                            selectedOrder._id,
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50"
                                >

                                    <option value="Pending">
                                        Pending
                                    </option>

                                    <option value="Processing">
                                        Processing
                                    </option>

                                    <option value="Shipped">
                                        Shipped
                                    </option>

                                    <option value="Delivered">
                                        Delivered
                                    </option>

                                    <option value="Cancelled">
                                        Cancelled
                                    </option>

                                </select>

                            </div>

                            {/* ITEMS */}

                            {Array.isArray(selectedOrder.items) && (
                                <div>

                                    <div className="mb-4 flex items-center gap-3">

                                        <Package
                                            size={18}
                                            className="text-indigo-400"
                                        />

                                        <h3 className="font-semibold">
                                            Order Items
                                        </h3>

                                    </div>

                                    <div className="space-y-3">

                                        {selectedOrder.items.map(
                                            (item, index) => (
                                                <div
                                                    key={
                                                        item._id ||
                                                        item.product?._id ||
                                                        index
                                                    }
                                                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4"
                                                >

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                                                            <Package
                                                                size={17}
                                                                className="text-slate-500"
                                                            />
                                                        </div>

                                                        <div>

                                                            <p className="font-medium text-slate-200">
                                                                {item.name ||
                                                                    item.product?.name ||
                                                                    "Product"}
                                                            </p>

                                                            <p className="text-xs text-slate-500">
                                                                Qty:{" "}
                                                                {item.quantity ||
                                                                    1}
                                                            </p>

                                                        </div>

                                                    </div>

                                                    <p className="font-semibold">
                                                        ₹
                                                        {Number(
                                                            item.price ||
                                                                item.product
                                                                    ?.price ||
                                                                0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </p>

                                                </div>
                                            )
                                        )}

                                    </div>

                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminOrders;