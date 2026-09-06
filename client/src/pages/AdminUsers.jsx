import { useEffect, useMemo, useState } from "react";
import {
    Search,
    Users,
    User,
    ShieldCheck,
    Mail,
    CalendarDays,
    RefreshCw,
    Eye,
    Trash2,
    X,
} from "lucide-react";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminUsers() {
    const { token } = useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [selectedUser, setSelectedUser] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // =========================
    // FETCH USERS
    // =========================

  const fetchUsers = async () => {
    try {
        setLoading(true);

        const response = await API.get("/auth/users", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Users API Response:", response.data);

        const data = response.data;

        let userList = [];

        if (Array.isArray(data)) {
            userList = data;
        } else if (Array.isArray(data.users)) {
            userList = data.users;
        } else if (Array.isArray(data.data)) {
            userList = data.data;
        } else if (Array.isArray(data.data?.users)) {
            userList = data.data.users;
        }

        setUsers(userList);

    } catch (error) {
        console.error(
            "Users fetch error:",
            error.response?.data || error.message
        );
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [token]);

    // =========================
    // DELETE USER
    // =========================

    const deleteUser = async (userId) => {
        if (!userId || !token) return;

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) return;

        try {
            setDeletingId(userId);

            await API.delete(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUsers((prev) =>
                prev.filter((user) => user._id !== userId)
            );

            setSelectedUser(null);
        } catch (error) {
            console.error(
                "Delete user error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                    "Failed to delete user."
            );
        } finally {
            setDeletingId(null);
        }
    };

    // =========================
    // FILTER USERS
    // =========================

    const filteredUsers = useMemo(() => {
        const text = search.toLowerCase().trim();

        return users.filter((user) => {
            const name = user.name || "";
            const email = user.email || "";
            const role = user.role || "";

            const matchesSearch =
                !text ||
                name.toLowerCase().includes(text) ||
                email.toLowerCase().includes(text);

            const matchesRole =
                roleFilter === "ALL" ||
                role.toLowerCase() === roleFilter.toLowerCase();

            return matchesSearch && matchesRole;
        });
    }, [users, search, roleFilter]);

    // =========================
    // STATS
    // =========================

    const stats = useMemo(() => {
        const total = users.length;

        const admins = users.filter(
            (user) =>
                (user.role || "").toLowerCase() === "admin"
        ).length;

        const customers = users.filter(
            (user) =>
                (user.role || "").toLowerCase() === "user" ||
                (user.role || "").toLowerCase() === "customer"
        ).length;

        return {
            total,
            admins,
            customers,
        };
    }, [users]);

    // =========================
    // DATE
    // =========================

    const getDate = (user) => {
        const date =
            user.createdAt ||
            user.created_at ||
            user.registeredAt;

        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // =========================
    // ROLE STYLE
    // =========================

    const getRoleStyle = (role) => {
        if ((role || "").toLowerCase() === "admin") {
            return "border-purple-500/20 bg-purple-500/10 text-purple-400";
        }

        return "border-indigo-500/20 bg-indigo-500/10 text-indigo-400";
    };

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1600px]">

                {/* ================= HEADER ================= */}

                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                            <Users size={23} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                Users
                            </h1>

                            <p className="text-sm text-slate-400">
                                Manage all registered users
                            </p>
                        </div>

                    </div>

                    <button
                        onClick={fetchUsers}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                    >
                        <RefreshCw
                            size={18}
                            className={
                                loading ? "animate-spin" : ""
                            }
                        />

                        Refresh Users
                    </button>

                </div>

                {/* ================= STATS ================= */}

                <div className="mb-8 grid gap-4 sm:grid-cols-3">

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                            <Users size={19} />
                        </div>

                        <p className="text-2xl font-bold">
                            {stats.total}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Total Users
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                            <ShieldCheck size={19} />
                        </div>

                        <p className="text-2xl font-bold">
                            {stats.admins}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Administrators
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                            <User size={19} />
                        </div>

                        <p className="text-2xl font-bold">
                            {stats.customers}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Customers
                        </p>
                    </div>

                </div>

                {/* ================= FILTER ================= */}

                <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">

                    <div className="flex flex-col gap-4 lg:flex-row">

                        <div className="relative flex-1">

                            <Search
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                            />

                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500/50"
                            />

                        </div>

                        <select
                            value={roleFilter}
                            onChange={(e) =>
                                setRoleFilter(e.target.value)
                            }
                            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500/50"
                        >
                            <option value="ALL">
                                All Roles
                            </option>

                            <option value="admin">
                                Admin
                            </option>

                            <option value="user">
                                User
                            </option>

                            <option value="customer">
                                Customer
                            </option>
                        </select>

                    </div>

                </div>

                {/* ================= TABLE ================= */}

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[900px]">

                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.03] text-left text-xs uppercase tracking-wider text-slate-500">

                                    <th className="px-6 py-4">
                                        User
                                    </th>

                                    <th className="px-6 py-4">
                                        Email
                                    </th>

                                    <th className="px-6 py-4">
                                        Role
                                    </th>

                                    <th className="px-6 py-4">
                                        Joined
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>

                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/5">

                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-20 text-center"
                                        >
                                            <RefreshCw
                                                size={28}
                                                className="mx-auto mb-3 animate-spin text-indigo-400"
                                            />

                                            <p className="text-sm text-slate-500">
                                                Loading users...
                                            </p>
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-20 text-center"
                                        >
                                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-slate-600">
                                                <Users size={28} />
                                            </div>

                                            <p className="mt-4 font-semibold text-slate-300">
                                                No users found
                                            </p>

                                            <p className="mt-1 text-sm text-slate-600">
                                                Try changing your search or filter.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr
                                            key={user._id}
                                            className="transition hover:bg-white/[0.03]"
                                        >

                                            {/* USER */}

                                            <td className="px-6 py-5">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-bold">
                                                        {(
                                                            user.name ||
                                                            "U"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold text-white">
                                                            {user.name ||
                                                                "Unnamed User"}
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-600">
                                                            ID:{" "}
                                                            {user._id
                                                                ?.toString()
                                                                .slice(-8)}
                                                        </p>
                                                    </div>

                                                </div>

                                            </td>

                                            {/* EMAIL */}

                                            <td className="px-6 py-5">

                                                <div className="flex items-center gap-2 text-sm text-slate-400">

                                                    <Mail
                                                        size={15}
                                                        className="text-slate-600"
                                                    />

                                                    {user.email ||
                                                        "No email"}

                                                </div>

                                            </td>

                                            {/* ROLE */}

                                            <td className="px-6 py-5">

                                                <span
                                                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getRoleStyle(
                                                        user.role
                                                    )}`}
                                                >
                                                    <ShieldCheck
                                                        size={14}
                                                    />

                                                    {user.role ||
                                                        "User"}
                                                </span>

                                            </td>

                                            {/* DATE */}

                                            <td className="px-6 py-5">

                                                <div className="flex items-center gap-2 text-sm text-slate-400">

                                                    <CalendarDays
                                                        size={15}
                                                        className="text-slate-600"
                                                    />

                                                    {getDate(user)}

                                                </div>

                                            </td>

                                            {/* ACTIONS */}

                                            <td className="px-6 py-5">

                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        onClick={() =>
                                                            setSelectedUser(
                                                                user
                                                            )
                                                        }
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 transition hover:bg-indigo-500/20"
                                                        title="View User"
                                                    >
                                                        <Eye
                                                            size={16}
                                                        />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            deleteUser(
                                                                user._id
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            user._id
                                                        }
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                                                        title="Delete User"
                                                    >
                                                        {deletingId ===
                                                        user._id ? (
                                                            <RefreshCw
                                                                size={16}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <Trash2
                                                                size={16}
                                                            />
                                                        )}
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

                {/* ================= RESULTS ================= */}

                {!loading && (
                    <div className="mt-4 text-xs text-slate-600">
                        Showing {filteredUsers.length} of{" "}
                        {users.length} users
                    </div>
                )}

            </div>

            {/* ================= USER MODAL ================= */}

            {selectedUser && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedUser(null)}
                >

                    <div
                        className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 shadow-2xl"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* HEADER */}

                        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

                            <div>
                                <p className="text-xs uppercase tracking-wider text-indigo-400">
                                    User Details
                                </p>

                                <h2 className="mt-1 text-xl font-bold">
                                    {selectedUser.name ||
                                        "User"}
                                </h2>
                            </div>

                            <button
                                onClick={() =>
                                    setSelectedUser(null)
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                            >
                                <X size={19} />
                            </button>

                        </div>

                        <div className="space-y-5 p-6">

                            {/* PROFILE */}

                            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">

                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold">
                                    {(
                                        selectedUser.name ||
                                        "U"
                                    )
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold">
                                        {selectedUser.name ||
                                            "Unnamed User"}
                                    </h3>

                                    <p className="text-sm text-slate-500">
                                        {selectedUser.email ||
                                            "No email"}
                                    </p>
                                </div>

                            </div>

                            {/* DETAILS */}

                            <div className="space-y-3">

                                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                    <span className="text-sm text-slate-500">
                                        Role
                                    </span>

                                    <span
                                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getRoleStyle(
                                            selectedUser.role
                                        )}`}
                                    >
                                        {selectedUser.role ||
                                            "User"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                    <span className="text-sm text-slate-500">
                                        Email
                                    </span>

                                    <span className="max-w-[220px] truncate text-sm text-slate-300">
                                        {selectedUser.email ||
                                            "No email"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                    <span className="text-sm text-slate-500">
                                        Joined
                                    </span>

                                    <span className="text-sm text-slate-300">
                                        {getDate(
                                            selectedUser
                                        )}
                                    </span>
                                </div>

                            </div>

                            {/* DELETE */}

                            <button
                                onClick={() =>
                                    deleteUser(
                                        selectedUser._id
                                    )
                                }
                                disabled={
                                    deletingId ===
                                    selectedUser._id
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                            >
                                {deletingId ===
                                selectedUser._id ? (
                                    <RefreshCw
                                        size={17}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Trash2 size={17} />
                                )}

                                Delete User
                            </button>

                        </div>

                    </div>

                </div>
            )}
        </div>
    );
}

export default AdminUsers;