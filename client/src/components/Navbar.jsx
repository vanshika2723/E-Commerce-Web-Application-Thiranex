
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
    ShoppingCart,
    Heart,
    User,
    LogOut,
    Package,
    Menu,
    X,
    Store,
} from "lucide-react";

import { useState } from "react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { cartCount, wishlistCount } = useCart();
    const { user, isAuthenticated, logout } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const [mobileMenu, setMobileMenu] = useState(false);

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {
        logout();
        setMobileMenu(false);
        navigate("/login");
    };

    // =========================
    // CLOSE MOBILE MENU
    // =========================

    const closeMobileMenu = () => {
        setMobileMenu(false);
    };

    // =========================
    // ACTIVE ROUTE
    // =========================

    const isActive = (path) => {
        if (path === "/") {
            return location.pathname === "/";
        }

        return location.pathname.startsWith(path);
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 text-white shadow-xl backdrop-blur-xl">

            <div className="mx-auto w-full max-w-none px-4 sm:px-6 lg:px-8">

                {/* ================================================= */}
                {/* NAVBAR MAIN */}
                {/* ================================================= */}

                <div className="flex h-20 items-center justify-between">

                    {/* ================================================= */}
                    {/* LOGO */}
                    {/* ================================================= */}

                    <Link
                        to="/"
                        onClick={closeMobileMenu}
                        className="group flex items-center gap-3"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 transition duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/40">
                            <Store size={22} />
                        </div>

                        <div>
                            <h1 className="text-xl font-extrabold tracking-tight">
                                Shop
                                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    Ease
                                </span>
                            </h1>

                            <p className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 sm:block">
                                Smart Shopping
                            </p>
                        </div>
                    </Link>


                    {/* ================================================= */}
                    {/* DESKTOP NAVIGATION */}
                    {/* ================================================= */}

                    <div className="hidden items-center gap-1.5 lg:flex">

                        {/* ================= HOME ================= */}

                        <Link
                            to="/"
                            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition duration-200 ${
                                isActive("/")
                                    ? "bg-indigo-500/15 text-indigo-300"
                                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            Home
                        </Link>


                        {/* ================= PRODUCTS ================= */}

                        <Link
                            to="/products"
                            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition duration-200 ${
                                isActive("/products")
                                    ? "bg-indigo-500/15 text-indigo-300"
                                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            Products
                        </Link>


                        {/* ================= WISHLIST ================= */}

                        <Link
                            to="/wishlist"
                            className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition duration-200 ${
                                isActive("/wishlist")
                                    ? "bg-pink-500/10 text-pink-300"
                                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <Heart
                                size={18}
                                className={
                                    wishlistCount > 0
                                        ? "text-pink-400"
                                        : ""
                                }
                                fill={
                                    wishlistCount > 0
                                        ? "currentColor"
                                        : "none"
                                }
                            />

                            Wishlist

                            {wishlistCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-pink-500/20">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>


                        {/* ================= CART ================= */}

                        <Link
                            to="/cart"
                            className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition duration-200 ${
                                isActive("/cart")
                                    ? "bg-indigo-500/15 text-indigo-300"
                                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <ShoppingCart size={18} />

                            Cart

                            {cartCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-red-500/20">
                                    {cartCount}
                                </span>
                            )}
                        </Link>


                        {/* ================= DIVIDER ================= */}

                        {isAuthenticated && (
                            <div className="mx-2 h-7 w-px bg-white/10" />
                        )}


                        {/* ================================================= */}
                        {/* GUEST USER */}
                        {/* ================================================= */}

                        {!isAuthenticated ? (
                            <>
                                {/* LOGIN */}

                                <Link
                                    to="/login"
                                    className="ml-1 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition duration-300 hover:bg-white/10"
                                >
                                    <User size={18} />

                                    Login
                                </Link>


                                {/* REGISTER */}

                                <Link
                                    to="/register"
                                    className="flex items-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-indigo-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-indigo-500/40"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (

                            /* ================================================= */
                            /* AUTHENTICATED USER */
                            /* ================================================= */

                            <>
                                {/* ================= ORDERS ================= */}

                                <Link
                                    to="/orders"
                                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition duration-200 ${
                                        isActive("/orders")
                                            ? "bg-indigo-500/15 text-indigo-300"
                                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    <Package size={18} />

                                    Orders
                                </Link>


                                {/* ================= USER ================= */}

                                <div className="ml-1 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">

                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20">
                                        <User size={16} />
                                    </div>

                                    <div className="hidden xl:block">

                                        <p className="text-[10px] text-slate-500">
                                            Welcome
                                        </p>

                                        <p className="max-w-24 truncate text-sm font-semibold text-white">
                                            {user?.name || "User"}
                                        </p>

                                    </div>

                                </div>


                                {/* ================= LOGOUT ================= */}

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition duration-300 hover:bg-red-500/20 hover:text-red-300"
                                >
                                    <LogOut size={18} />

                                    Logout
                                </button>

                            </>
                        )}

                    </div>


                    {/* ================================================= */}
                    {/* MOBILE BUTTONS */}
                    {/* ================================================= */}

                    <div className="flex items-center gap-2 lg:hidden">

                        {/* ================= MOBILE WISHLIST ================= */}

                        <Link
                            to="/wishlist"
                            onClick={closeMobileMenu}
                            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
                        >
                            <Heart
                                size={20}
                                className={
                                    wishlistCount > 0
                                        ? "text-pink-400"
                                        : ""
                                }
                                fill={
                                    wishlistCount > 0
                                        ? "currentColor"
                                        : "none"
                                }
                            />

                            {wishlistCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-1 text-[10px] font-bold text-white">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>


                        {/* ================= MOBILE CART ================= */}

                        <Link
                            to="/cart"
                            onClick={closeMobileMenu}
                            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
                        >
                            <ShoppingCart size={20} />

                            {cartCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-1 text-[10px] font-bold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>


                        {/* ================= MOBILE MENU ================= */}

                        <button
                            type="button"
                            aria-label={
                                mobileMenu
                                    ? "Close menu"
                                    : "Open menu"
                            }
                            aria-expanded={mobileMenu}
                            onClick={() =>
                                setMobileMenu(!mobileMenu)
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition duration-200 hover:bg-white/10"
                        >
                            {mobileMenu ? (
                                <X size={22} />
                            ) : (
                                <Menu size={22} />
                            )}
                        </button>

                    </div>

                </div>


                {/* ================================================= */}
                {/* MOBILE MENU */}
                {/* ================================================= */}

                {mobileMenu && (
                    <div className="border-t border-white/10 py-5 lg:hidden">

                        <div className="flex flex-col gap-2">

                            {/* ================= HOME ================= */}

                            <Link
                                to="/"
                                onClick={closeMobileMenu}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                                    isActive("/")
                                        ? "bg-indigo-500/15 text-indigo-300"
                                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                <span className="text-lg">
                                    🏠
                                </span>

                                Home
                            </Link>


                            {/* ================= PRODUCTS ================= */}

                            <Link
                                to="/products"
                                onClick={closeMobileMenu}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                                    isActive("/products")
                                        ? "bg-indigo-500/15 text-indigo-300"
                                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                <span className="text-lg">
                                    🛍️
                                </span>

                                Products
                            </Link>


                            {/* ================= WISHLIST ================= */}

                            <Link
                                to="/wishlist"
                                onClick={closeMobileMenu}
                                className={`flex items-center justify-between rounded-xl px-4 py-3 transition ${
                                    isActive("/wishlist")
                                        ? "bg-pink-500/10 text-pink-300"
                                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                <span className="flex items-center gap-3">

                                    <Heart
                                        size={18}
                                        className={
                                            wishlistCount > 0
                                                ? "text-pink-400"
                                                : ""
                                        }
                                        fill={
                                            wishlistCount > 0
                                                ? "currentColor"
                                                : "none"
                                        }
                                    />

                                    Wishlist

                                </span>

                                {wishlistCount > 0 && (
                                    <span className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-2 py-0.5 text-xs font-bold text-white">
                                        {wishlistCount}
                                    </span>
                                )}

                            </Link>


                            {/* ================= CART ================= */}

                            <Link
                                to="/cart"
                                onClick={closeMobileMenu}
                                className={`flex items-center justify-between rounded-xl px-4 py-3 transition ${
                                    isActive("/cart")
                                        ? "bg-indigo-500/15 text-indigo-300"
                                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                <span className="flex items-center gap-3">

                                    <ShoppingCart size={18} />

                                    Cart

                                </span>

                                {cartCount > 0 && (
                                    <span className="rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-2 py-0.5 text-xs font-bold text-white">
                                        {cartCount}
                                    </span>
                                )}

                            </Link>


                            {/* ================= DIVIDER ================= */}

                            <div className="my-2 h-px bg-white/10" />


                            {/* ================================================= */}
                            {/* GUEST MOBILE */}
                            {/* ================================================= */}

                            {!isAuthenticated ? (
                                <>
                                    {/* LOGIN */}

                                    <Link
                                        to="/login"
                                        onClick={closeMobileMenu}
                                        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
                                    >
                                        <User size={18} />

                                        Login
                                    </Link>


                                    {/* REGISTER */}

                                    <Link
                                        to="/register"
                                        onClick={closeMobileMenu}
                                        className="flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 font-semibold shadow-lg shadow-indigo-500/20"
                                    >
                                        Register
                                    </Link>
                                </>
                            ) : (

                                /* ================================================= */
                                /* AUTHENTICATED MOBILE */
                                /* ================================================= */

                                <>
                                    {/* ================= USER ================= */}

                                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20">
                                            <User size={18} />
                                        </div>

                                        <div className="min-w-0">

                                            <p className="text-xs text-slate-500">
                                                Welcome
                                            </p>

                                            <p className="truncate font-semibold text-white">
                                                {user?.name || "User"}
                                            </p>

                                        </div>

                                    </div>


                                    {/* ================= ORDERS ================= */}

                                    <Link
                                        to="/orders"
                                        onClick={closeMobileMenu}
                                        className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                                            isActive("/orders")
                                                ? "bg-indigo-500/15 text-indigo-300"
                                                : "text-slate-300 hover:bg-white/5 hover:text-white"
                                        }`}
                                    >
                                        <Package size={18} />

                                        Orders
                                    </Link>


                                    {/* ================= LOGOUT ================= */}

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 font-semibold text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
                                    >
                                        <LogOut size={18} />

                                        Logout
                                    </button>

                                </>
                            )}

                        </div>

                    </div>
                )}

            </div>
        </nav>
    );
}

export default Navbar;

