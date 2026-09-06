import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    UserPlus,
    ShieldCheck,
    AlertCircle,
    Loader2,
    ShoppingBag,
    CheckCircle2,
} from "lucide-react";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [role, setRole] = useState("user");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [agreeTerms, setAgreeTerms] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // =========================
    // INPUT CHANGE
    // =========================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    // =========================
    // REGISTER
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const name = formData.name.trim();
        const email = formData.email.trim().toLowerCase();
        const password = formData.password;
        const confirmPassword = formData.confirmPassword;

        if (!name) {
            setError("Please enter your full name.");
            return;
        }

        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!agreeTerms) {
            setError("Please accept the Terms & Conditions.");
            return;
        }

        try {
            setLoading(true);

            const response = await API.post("/auth/register", {
                name,
                email,
                password,
                role,
            });

            const { token, user } = response.data;

            // Save authentication
            login(user, token);

            // Redirect according to role
            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
            {/* Background Glow */}
            <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

            <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-2">

                {/* =========================
                    LEFT SIDE
                ========================= */}

                <div className="hidden lg:block">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300">
                        <ShoppingBag size={16} />
                        Welcome to ShopEase
                    </div>

                    <h1 className="max-w-xl text-5xl font-black leading-tight tracking-tight">
                        Create your
                        <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            ShopEase Account
                        </span>
                    </h1>

                    <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
                        Join ShopEase and enjoy a smarter, faster and more
                        secure shopping experience.
                    </p>

                    <div className="mt-10 space-y-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                                <CheckCircle2 size={22} />
                            </div>

                            <div>
                                <p className="font-semibold">
                                    Easy Shopping
                                </p>
                                <p className="text-sm text-slate-500">
                                    Discover products with ease.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                <ShieldCheck size={22} />
                            </div>

                            <div>
                                <p className="font-semibold">
                                    Secure Account
                                </p>
                                <p className="text-sm text-slate-500">
                                    Your account stays protected.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400">
                                <UserPlus size={22} />
                            </div>

                            <div>
                                <p className="font-semibold">
                                    Personalized Experience
                                </p>
                                <p className="text-sm text-slate-500">
                                    Manage your shopping in one place.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =========================
                    REGISTER CARD
                ========================= */}

                <div className="mx-auto w-full max-w-xl">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">

                        {/* Header */}
                        <div className="mb-7 text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                                <UserPlus size={27} />
                            </div>

                            <h2 className="text-3xl font-bold">
                                Create Account
                            </h2>

                            <p className="mt-2 text-sm text-slate-400">
                                Choose your account type and get started
                            </p>
                        </div>

                        {/* =========================
                            ROLE SELECTION
                        ========================= */}

                        <div className="mb-6">
                            <p className="mb-3 text-sm font-semibold text-slate-300">
                                Select Account Type
                            </p>

                            <div className="grid gap-3 sm:grid-cols-2">

                                {/* USER */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setRole("user");
                                        setError("");
                                    }}
                                    className={`group rounded-2xl border p-4 text-left transition-all duration-300 ${
                                        role === "user"
                                            ? "border-indigo-400/60 bg-indigo-500/10 ring-2 ring-indigo-500/20"
                                            : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                                                role === "user"
                                                    ? "bg-indigo-500 text-white"
                                                    : "bg-white/10 text-slate-400 group-hover:text-white"
                                            }`}
                                        >
                                            <User size={21} />
                                        </div>

                                        <div>
                                            <p className="font-semibold">
                                                User
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                Shop & manage orders
                                            </p>
                                        </div>
                                    </div>

                                    {role === "user" && (
                                        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-indigo-300">
                                            <CheckCircle2 size={14} />
                                            Selected
                                        </div>
                                    )}
                                </button>

                                {/* ADMIN */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setRole("admin");
                                        setError("");
                                    }}
                                    className={`group rounded-2xl border p-4 text-left transition-all duration-300 ${
                                        role === "admin"
                                            ? "border-purple-400/60 bg-purple-500/10 ring-2 ring-purple-500/20"
                                            : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                                                role === "admin"
                                                    ? "bg-purple-500 text-white"
                                                    : "bg-white/10 text-slate-400 group-hover:text-white"
                                            }`}
                                        >
                                            <ShieldCheck size={21} />
                                        </div>

                                        <div>
                                            <p className="font-semibold">
                                                Admin
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                Manage ShopEase
                                            </p>
                                        </div>
                                    </div>

                                    {role === "admin" && (
                                        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-purple-300">
                                            <CheckCircle2 size={14} />
                                            Selected
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                                <AlertCircle
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* =========================
                            FORM
                        ========================= */}

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* NAME */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Full Name
                                </label>

                                <div className="relative">
                                    <User
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    />

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-indigo-500/60 focus:bg-white/[0.06]"
                                    />
                                </div>
                            </div>

                            {/* EMAIL */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-indigo-500/60 focus:bg-white/[0.06]"
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Password
                                </label>

                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    />

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Minimum 6 characters"
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-600 focus:border-indigo-500/60 focus:bg-white/[0.06]"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Confirm Password
                                </label>

                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    />

                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Re-enter your password"
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-600 focus:border-indigo-500/60 focus:bg-white/[0.06]"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* TERMS */}
                            <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-400">
                                <input
                                    type="checkbox"
                                    checked={agreeTerms}
                                    onChange={(e) =>
                                        setAgreeTerms(e.target.checked)
                                    }
                                    className="mt-1 h-4 w-4 accent-indigo-500"
                                />

                                <span>
                                    I agree to the{" "}
                                    <span className="font-medium text-indigo-400">
                                        Terms & Conditions
                                    </span>{" "}
                                    and Privacy Policy.
                                </span>
                            </label>

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
                                    role === "admin"
                                        ? "bg-gradient-to-r from-purple-600 to-pink-600 shadow-purple-500/20 hover:from-purple-500 hover:to-pink-500"
                                        : "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500"
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2
                                            size={19}
                                            className="animate-spin"
                                        />
                                        Creating Account...
                                    </>
                                ) : role === "admin" ? (
                                    <>
                                        <ShieldCheck size={19} />
                                        Create Admin Account
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={19} />
                                        Create User Account
                                    </>
                                )}
                            </button>
                        </form>

                        {/* LOGIN */}
                        <div className="mt-7 text-center text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-indigo-400 transition hover:text-indigo-300"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;