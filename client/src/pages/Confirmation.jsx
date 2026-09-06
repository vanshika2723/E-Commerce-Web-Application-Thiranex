
import { Link } from "react-router-dom";
import {
    CheckCircle2,
    Package,
    ShoppingBag,
    ArrowRight,
    Home,
    Truck,
    ShieldCheck,
} from "lucide-react";

function Confirmation() {
    return (
        <section className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-24 text-white sm:px-6 lg:px-8">

            {/* Background Glows */}
            <div className="pointer-events-none absolute left-0 top-20 h-80 w-80 rounded-full bg-emerald-600/10 blur-3xl" />

            <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

            <div className="relative mx-auto flex min-h-[70vh] w-full max-w-4xl items-center justify-center">

                <div className="w-full rounded-3xl border border-white/10 bg-white/[0.04] p-7 text-center shadow-2xl backdrop-blur-xl sm:p-10 lg:p-14">

                    {/* Success Icon */}
                    <div className="relative mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10 shadow-lg shadow-emerald-500/10">

                        <div className="absolute inset-0 animate-ping rounded-full border border-emerald-400/10" />

                        <CheckCircle2
                            size={52}
                            className="relative text-emerald-400"
                        />

                    </div>

                    {/* Heading */}
                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-emerald-400">
                        Order Confirmed
                    </p>

                    <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
                        Thank You for Your Order! 🎉
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                        Your order has been successfully placed. We are
                        getting everything ready and will keep you updated
                        about your delivery.
                    </p>

                    {/* Order Status */}
                    <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-emerald-400/10 bg-emerald-500/[0.04] p-5">

                        <div className="flex items-center justify-center gap-3">

                            <Package
                                size={22}
                                className="text-emerald-400"
                            />

                            <div className="text-left">

                                <p className="text-sm font-bold text-emerald-300">
                                    Your order is being processed
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    You can track your order from My Orders.
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Feature Cards */}
                    <div className="mt-8 grid gap-4 sm:grid-cols-3">

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.05]">

                            <Package
                                size={24}
                                className="mx-auto mb-3 text-indigo-400"
                            />

                            <h3 className="text-sm font-bold">
                                Order Processing
                            </h3>

                            <p className="mt-2 text-xs leading-5 text-slate-500">
                                Your order is being prepared carefully.
                            </p>

                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.05]">

                            <Truck
                                size={24}
                                className="mx-auto mb-3 text-purple-400"
                            />

                            <h3 className="text-sm font-bold">
                                Fast Delivery
                            </h3>

                            <p className="mt-2 text-xs leading-5 text-slate-500">
                                Your package will be delivered safely.
                            </p>

                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.05]">

                            <ShieldCheck
                                size={24}
                                className="mx-auto mb-3 text-emerald-400"
                            />

                            <h3 className="text-sm font-bold">
                                Secure Order
                            </h3>

                            <p className="mt-2 text-xs leading-5 text-slate-500">
                                Your order details are securely handled.
                            </p>

                        </div>

                    </div>

                    {/* Actions */}
                    <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

                        <Link
                            to="/orders"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-7 py-3.5 text-sm font-bold shadow-lg shadow-indigo-500/20 transition duration-300 hover:-translate-y-1 hover:from-indigo-400 hover:to-purple-500"
                        >
                            <Package size={18} />
                            View My Orders
                            <ArrowRight size={17} />
                        </Link>

                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-slate-300 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07] hover:text-white"
                        >
                            <ShoppingBag size={18} />
                            Continue Shopping
                        </Link>

                    </div>

                    {/* Home */}
                    <Link
                        to="/"
                        className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-white"
                    >
                        <Home size={14} />
                        Back to ShopEase Home
                    </Link>

                </div>

            </div>
        </section>
    );
}

export default Confirmation;

