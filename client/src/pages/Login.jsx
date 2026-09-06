
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    LogIn,
    UserPlus,
    ShieldCheck,
    AlertCircle,
    Loader2,
    ShoppingBag,
} from "lucide-react";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await API.post("/auth/login", formData);

            const { token, user } = response.data;

            login(user, token);

            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Login failed. Please check your email and password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-24 text-white sm:px-6 lg:px-8">

            {/* Background Glows */}

            <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/5 blur-3xl" />

            {/* Main Container */}

            <div className="relative mx-auto flex min-h-[75vh] w-full max-w-md items-center justify-center">

                <div className="w-full">

                    {/* Branding */}

                    <div className="mb-7 text-center">

                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
                        >
                            <ShoppingBag
                                size={17}
                                className="text-indigo-400"
                            />

                            ShopEase
                        </Link>

                    </div>

                    {/* Login Card */}

                    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-7 shadow-2xl backdrop-blur-2xl sm:p-9">

                        {/* Logo */}

                        <div className="mb-6 flex justify-center">

                            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/25">

                                <div className="absolute inset-0 rounded-2xl bg-white/10" />

                                <ShoppingBag
                                    size={30}
                                    className="relative text-white"
                                />

                            </div>

                        </div>

                        {/* Heading */}

                        <div className="mb-8 text-center">

                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
                                Welcome Back
                            </p>

                            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Login to ShopEase
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                Sign in to manage your orders, wishlist,
                                and shopping activity.
                            </p>

                        </div>

                        {/* Error */}

                        {error && (
                            <div
                                role="alert"
                                className="mb-6 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                            >
                                <AlertCircle
                                    size={19}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>{error}</span>
                            </div>
                        )}

                        {/* Form */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Email */}

                            <div>

                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-semibold text-slate-200"
                                >
                                    Email Address
                                </label>

                                <div className="relative">

                                    <Mail
                                        size={19}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    />

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-600 outline-none transition duration-300 focus:border-indigo-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-indigo-500/20"
                                    />

                                </div>

                            </div>

                            {/* Password */}

                            <div>

                                <div className="mb-2 flex items-center justify-between">

                                    <label
                                        htmlFor="password"
                                        className="text-sm font-semibold text-slate-200"
                                    >
                                        Password
                                    </label>

                                    <Link
                                        to="/forgot-password"
                                        className="text-xs font-semibold text-indigo-400 transition hover:text-indigo-300"
                                    >
                                        Forgot Password?
                                    </Link>

                                </div>

                                <div className="relative">

                                    <Lock
                                        size={19}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    />

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-12 pr-12 text-sm text-white placeholder-slate-600 outline-none transition duration-300 focus:border-indigo-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-indigo-500/20"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        className="absolute right-0 top-0 flex h-full items-center px-4 text-slate-500 transition hover:text-white"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={19} />
                                        ) : (
                                            <Eye size={19} />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* Login Button */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                            >

                                {loading ? (
                                    <>
                                        <Loader2
                                            size={19}
                                            className="animate-spin"
                                        />

                                        Logging in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn size={19} />

                                        Login

                                        <span className="transition duration-300 group-hover:translate-x-1">
                                            →
                                        </span>
                                    </>
                                )}

                            </button>

                        </form>

                        {/* Trust Message */}

                        <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-500">

                            <ShieldCheck
                                size={15}
                                className="text-emerald-400"
                            />

                            Secure login powered by ShopEase

                        </div>

                        {/* Divider */}

                        <div className="my-7 flex items-center gap-4">

                            <div className="h-px flex-1 bg-white/10" />

                            <span className="text-xs font-medium text-slate-600">
                                OR
                            </span>

                            <div className="h-px flex-1 bg-white/10" />

                        </div>

                        {/* Register */}

                        <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4 text-center">

                            <p className="text-sm text-slate-400">
                                Don't have an account?
                            </p>

                            <Link
                                to="/register"
                                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-indigo-400 transition hover:text-indigo-300"
                            >
                                <UserPlus size={17} />
                                Create Account
                                <span className="transition duration-300 hover:translate-x-1">
                                    →
                                </span>
                            </Link>

                        </div>

                    </div>

                    {/* Footer */}

                    <p className="mt-6 text-center text-xs text-slate-600">
                        © {new Date().getFullYear()} ShopEase. All rights reserved.
                    </p>

                </div>

            </div>

        </section>
    );
}

export default Login;

