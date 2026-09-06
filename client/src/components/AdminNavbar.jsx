import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Tags,
    BarChart3,
    Bell,
    Settings,
    User,
    LogOut,
    Menu,
    X,
    Store,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function AdminNavbar() {
    const { user, logout } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();

    const [mobileMenu, setMobileMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navItems = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: LayoutDashboard,
        },
        {
            name: "Products",
            path: "/admin/products",
            icon: Package,
        },
        {
            name: "Orders",
            path: "/admin/orders",
            icon: ShoppingCart,
        },
        {
            name: "Users",
            path: "/admin/users",
            icon: Users,
        },
        {
            name: "Categories",
            path: "/admin/categories",
            icon: Tags,
        },
        {
            name: "Analytics",
            path: "/admin/analytics",
            icon: BarChart3,
        },
    ];

    const isActive = (path) => {
        if (path === "/admin") {
            return location.pathname === "/admin";
        }

        return location.pathname.startsWith(path);
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 text-white shadow-xl backdrop-blur-xl">

            <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">

                <div className="flex h-20 items-center justify-between">

                    {/* Logo */}
                    <Link
                        to="/admin"
                        className="flex items-center gap-3"
                        onClick={() => setMobileMenu(false)}
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                            <Store size={22} />
                        </div>

                        <div>
                            <h1 className="text-xl font-extrabold">
                                Shop
                                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    Ease
                                </span>
                            </h1>

                            <p className="text-[9px] uppercase tracking-[0.25em] text-slate-500">
                                Admin Panel
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden items-center gap-1 lg:flex">

                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                                        active
                                            ? "bg-indigo-500/15 text-indigo-300"
                                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    <Icon size={18} />

                                    {item.name}
                                </Link>
                            );
                        })}

                     
                       
                        {/* User */}
                        <div className="ml-2 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                                <User size={17} />
                            </div>

                            <div className="hidden xl:block">
                                <p className="text-[10px] text-slate-500">
                                    Administrator
                                </p>

                                <p className="max-w-28 truncate text-sm font-semibold">
                                    {user?.name || "Admin"}
                                </p>
                            </div>

                        </div>

                        {/* Logout */}
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="ml-1 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                        >
                            <LogOut size={18} />

                            Logout
                        </button>

                    </div>

                    {/* Mobile Buttons */}
                    <div className="flex items-center gap-2 lg:hidden">

                        <button
                            type="button"
                            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5"
                        >
                            <Bell size={19} />

                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-pink-500" />
                        </button>

                        <button
                            type="button"
                            onClick={() => setMobileMenu(!mobileMenu)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5"
                        >
                            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
                        </button>

                    </div>

                </div>

                {/* Mobile Menu */}
                {mobileMenu && (
                    <div className="border-t border-white/10 py-5 lg:hidden">

                        {/* Admin Info */}
                        <div className="mb-4 flex items-center gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4">

                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                                <User size={19} />
                            </div>

                            <div>
                                <p className="text-xs text-indigo-300">
                                    Administrator
                                </p>

                                <p className="font-semibold">
                                    {user?.name || "Admin"}
                                </p>
                            </div>

                        </div>

                        {/* Links */}
                        <div className="flex flex-col gap-1">

                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileMenu(false)}
                                        className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm ${
                                            active
                                                ? "bg-indigo-500/15 text-indigo-300"
                                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                                        }`}
                                    >
                                        <Icon size={19} />

                                        {item.name}
                                    </Link>
                                );
                            })}

                            <div className="my-2 h-px bg-white/10" />

                            <button
                                type="button"
                                className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-slate-400 hover:bg-white/5 hover:text-white"
                            >
                                <Settings size={19} />

                                Settings
                            </button>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex items-center gap-3 rounded-xl bg-red-500/10 px-4 py-3.5 font-semibold text-red-400 hover:bg-red-500/20"
                            >
                                <LogOut size={19} />

                                Logout
                            </button>

                        </div>

                    </div>
                )}

            </div>

        </nav>
    );
}

export default AdminNavbar;