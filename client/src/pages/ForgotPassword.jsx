
import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Mail,
    ArrowLeft,
    Send,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    Loader2,
    ShoppingBag,
    KeyRound,
} from "lucide-react";

import API from "../services/api";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setError("Please enter your email address.");
            return;
        }

        setLoading(true);

        try {
            const response = await API.post("/auth/forgot-password", {
                email: trimmedEmail,
            });

            setSuccess(
                response.data?.message ||
                    "If an account exists with this email, a password reset link has been sent."
            );

            setEmail("");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Unable to send reset link. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">

            {/* Background Glow */}
            <div className="pointer-events-none absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-indigo-600/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-40 -right-40 h-[450px] w-[450px] rounded-full bg-purple-600/20 blur-3xl" />

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/5 blur-3xl" />

            {/* Decorative Elements */}
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
                                Account Recovery
                            </p>

                            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Forgot Password?
                            </h1>

                            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
                                Enter your registered email address and we'll
                                send you a password reset link.
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
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);

                                            if (error) {
                                                setError("");
                                            }

                                            if (success) {
                                                setSuccess("");
                                            }
                                        }}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-600 outline-none transition duration-300 focus:border-indigo-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-indigo-500/20"
                                    />
                                </div>
                            </div>

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
                                        Sending Reset Link...
                                    </>
                                ) : (
                                    <>
                                        <Send size={19} />
                                        Send Reset Link

                                        <span className="transition duration-300 group-hover:translate-x-1">
                                            →
                                        </span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Security Info */}
                        <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-500">
                            <ShieldCheck
                                size={15}
                                className="text-emerald-400"
                            />

                            Your password reset request is securely handled
                        </div>

                        {/* Divider */}
                        <div className="my-7 flex items-center gap-4">
                            <div className="h-px flex-1 bg-white/10" />

                            <span className="text-xs font-medium text-slate-600">
                                REMEMBERED YOUR PASSWORD?
                            </span>

                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        {/* Back to Login */}
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

export default ForgotPassword;

