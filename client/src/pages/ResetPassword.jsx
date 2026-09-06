
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    Lock,
    Eye,
    EyeOff,
    KeyRound,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    Loader2,
    ShoppingBag,
    ArrowLeft,
    Check,
} from "lucide-react";

import API from "../services/api";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!token) {
            setError("Invalid or missing password reset token.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await API.post(
                `/auth/reset-password/${token}`,
                {
                    password,
                }
            );

            setSuccess(
                response.data?.message ||
                    "Password reset successfully."
            );

            setPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 1800);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Unable to reset password. The link may be expired or invalid."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
            {/* Background Glows */}
            <div className="pointer-events-none absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-indigo-600/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-40 -right-40 h-[450px] w-[450px] rounded-full bg-purple-600/20 blur-3xl" />

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/5 blur-3xl" />

            {/* Decorative Circles */}
            <div className="pointer-events-none absolute right-10 top-24 hidden h-24 w-24 rounded-full border border-white/10 sm:block" />

            <div className="pointer-events-none absolute bottom-20 left-10 hidden h-16 w-16 rounded-full border border-white/10 sm:block" />

            <div className="relative mx-auto flex min-h-[80vh] w-full max-w-lg items-center justify-center">
                <div className="w-full">

                    {/* Brand */}
                    <div className="mb-6 text-center">
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

                    {/* Card */}
                    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-7 shadow-2xl backdrop-blur-2xl sm:p-9">

                        {/* Icon */}
                        <div className="mb-6 flex justify-center">
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-indigo-500/25">
                                <div className="absolute inset-0 rounded-2xl bg-white/10" />

                                <KeyRound
                                    size={30}
                                    className="relative text-white"
                                />
                            </div>
                        </div>

                        {/* Heading */}
                        <div className="mb-7 text-center">
                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
                                Secure Recovery
                            </p>

                            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Reset Password
                            </h1>

                            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
                                Create a new secure password for your
                                ShopEase account.
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

                        {/* Success */}
                        {success && (
                            <div
                                role="status"
                                className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
                            >
                                <CheckCircle2
                                    size={19}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>{success}</span>
                            </div>
                        )}

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* New Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-semibold text-slate-200"
                                >
                                    New Password
                                </label>

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
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);

                                            if (error) {
                                                setError("");
                                            }
                                        }}
                                        placeholder="Enter new password"
                                        autoComplete="new-password"
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
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={19} />
                                        ) : (
                                            <Eye size={19} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="mb-2 block text-sm font-semibold text-slate-200"
                                >
                                    Confirm New Password
                                </label>

                                <div className="relative">
                                    <Lock
                                        size={19}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    />

                                    <input
                                        id="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(
                                                e.target.value
                                            );

                                            if (error) {
                                                setError("");
                                            }
                                        }}
                                        placeholder="Confirm new password"
                                        autoComplete="new-password"
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-12 pr-12 text-sm text-white placeholder-slate-600 outline-none transition duration-300 focus:border-indigo-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-indigo-500/20"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide confirm password"
                                                : "Show confirm password"
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={19} />
                                        ) : (
                                            <Eye size={19} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Password Requirements */}
                            <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Password Requirements
                                </p>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Check
                                            size={14}
                                            className={
                                                password.length >= 6
                                                    ? "text-emerald-400"
                                                    : "text-slate-600"
                                            }
                                        />

                                        At least 6 characters
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Check
                                            size={14}
                                            className={
                                                password &&
                                                password ===
                                                    confirmPassword
                                                    ? "text-emerald-400"
                                                    : "text-slate-600"
                                            }
                                        />

                                        Passwords must match
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
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
                                        Updating Password...
                                    </>
                                ) : (
                                    <>
                                        <KeyRound size={19} />
                                        Reset Password

                                        <span className="transition duration-300 group-hover:translate-x-1">
                                            →
                                        </span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Security */}
                        <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-500">
                            <ShieldCheck
                                size={15}
                                className="text-emerald-400"
                            />

                            Your new password is securely encrypted
                        </div>

                        {/* Login Link */}
                        <div className="my-7 flex items-center gap-4">
                            <div className="h-px flex-1 bg-white/10" />

                            <span className="text-xs font-medium text-slate-600">
                                REMEMBERED YOUR PASSWORD?
                            </span>

                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4 text-center">
                            <p className="text-sm text-slate-400">
                                You can login to your account now.
                            </p>

                            <Link
                                to="/login"
                                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-indigo-400 transition hover:text-indigo-300"
                            >
                                <ArrowLeft size={17} />
                                Back to Login
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

export default ResetPassword;

