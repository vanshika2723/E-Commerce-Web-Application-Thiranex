
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    MapPin,
    Phone,
    User,
    ShoppingBag,
    ShieldCheck,
    Truck,
    CreditCard,
    CheckCircle2,
    Loader2,
} from "lucide-react";

import API from "../services/api";
import { useCart } from "../context/CartContext";

function Checkout() {
    const navigate = useNavigate();

    const {
        cart,
        cartTotal,
        clearCart
    } = useCart();

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const orderItems = cart.map((item) => ({
                product: item._id,
                quantity: item.quantity
            }));

            await API.post(
                "/orders",
                {
                    items: orderItems,
                    shippingAddress: formData
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            clearCart();

            // Order successful → Confirmation page
            navigate("/confirmation");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to place order"
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // EMPTY CART
    // =========================

    if (cart.length === 0) {
        return (
            <section className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-24 text-white">

                <div className="pointer-events-none absolute left-0 top-20 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />

                <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />

                <div className="relative mx-auto flex min-h-[65vh] max-w-none w-full items-center justify-center">

                    <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center shadow-2xl backdrop-blur-xl">

                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-500/10">
                            <ShoppingBag
                                size={48}
                                className="text-indigo-400"
                            />
                        </div>

                        <h1 className="text-3xl font-extrabold">
                            Your Cart is Empty
                        </h1>

                        <p className="mt-3 text-slate-400">
                            Add some products before proceeding to checkout.
                        </p>

                        <Link
                            to="/products"
                            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-7 py-3.5 font-bold shadow-lg shadow-indigo-500/20 transition hover:-translate-y-1"
                        >
                            <ShoppingBag size={19} />
                            Shop Now
                        </Link>

                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-24 text-white sm:px-6 lg:px-8">

            {/* Background Glows */}
            <div className="pointer-events-none absolute left-0 top-20 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />

            <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />

            <div className="relative mx-auto max-w-none w-full">

                {/* Header */}
                <div className="mb-10">

                    <Link
                        to="/cart"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
                    >
                        <ArrowLeft size={17} />
                        Back to Cart
                    </Link>

                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">
                        Secure Checkout
                    </p>

                    <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
                        Complete Your Order
                    </h1>

                    <p className="mt-3 text-slate-400">
                        Enter your delivery details and place your order.
                    </p>

                </div>

                {/* Error */}
                {error && (
                    <div className="mb-7 flex items-center gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500/10 font-bold">
                            !
                        </span>

                        {error}
                    </div>
                )}

                {/* Main Layout */}
                <div className="grid gap-8 lg:grid-cols-[1fr_400px]">

                    {/* SHIPPING FORM */}
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10"
                    >

                        {/* Form Header */}
                        <div className="mb-8 flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
                                <MapPin
                                    size={23}
                                    className="text-indigo-400"
                                />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold">
                                    Shipping Information
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Where should we deliver your order?
                                </p>
                            </div>

                        </div>

                        <div className="space-y-6">

                            {/* Full Name */}
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
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Phone Number
                                </label>

                                <div className="relative">
                                    <Phone
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    />

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Delivery Address
                                </label>

                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="House number, street, area..."
                                    required
                                    rows="4"
                                    className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                                />
                            </div>

                            {/* City + State */}
                            <div className="grid gap-5 sm:grid-cols-2">

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-300">
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Enter city"
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-300">
                                        State
                                    </label>

                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="Enter state"
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                                    />
                                </div>

                            </div>

                            {/* Pincode */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Pincode
                                </label>

                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    placeholder="Enter 6-digit pincode"
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                                />
                            </div>

                        </div>

                        {/* Place Order */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 font-bold shadow-lg shadow-indigo-500/20 transition duration-300 hover:-translate-y-1 hover:from-indigo-400 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        size={20}
                                        className="animate-spin"
                                    />
                                    Placing Order...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={20} />
                                    Place Order
                                </>
                            )}
                        </button>

                    </form>

                    {/* ORDER SUMMARY */}
                    <div className="lg:sticky lg:top-24 lg:h-fit">

                        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-7">

                            {/* Summary Header */}
                            <div className="mb-6 flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10">
                                    <ShoppingBag
                                        size={21}
                                        className="text-purple-400"
                                    />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold">
                                        Order Summary
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        {cart.length} product
                                        {cart.length !== 1 ? "s" : ""}
                                    </p>
                                </div>

                            </div>

                            {/* Products */}
                            <div className="max-h-[350px] space-y-4 overflow-y-auto pr-1">

                                {cart.map((item) => (

                                    <div
                                        key={item._id}
                                        className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3"
                                    >

                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-900">

                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full object-contain p-1"
                                                />
                                            ) : (
                                                <ShoppingBag
                                                    size={24}
                                                    className="text-slate-600"
                                                />
                                            )}

                                        </div>

                                        <div className="min-w-0 flex-1">

                                            <h3 className="truncate text-sm font-semibold text-white">
                                                {item.name}
                                            </h3>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Qty: {item.quantity}
                                            </p>

                                        </div>

                                        <strong className="text-sm font-bold text-slate-200">
                                            ₹{(
                                                item.price *
                                                item.quantity
                                            ).toFixed(2)}
                                        </strong>

                                    </div>

                                ))}

                            </div>

                            <div className="my-6 h-px bg-white/10" />

                            {/* Subtotal */}
                            <div className="space-y-4">

                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">
                                        Subtotal
                                    </span>

                                    <span className="font-semibold">
                                        ₹{cartTotal.toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">
                                        Shipping
                                    </span>

                                    <span className="font-semibold text-emerald-400">
                                        Free
                                    </span>
                                </div>

                            </div>

                            <div className="my-6 h-px bg-white/10" />

                            {/* Total */}
                            <div className="flex items-center justify-between">

                                <span className="text-base font-semibold text-slate-300">
                                    Total
                                </span>

                                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-2xl font-extrabold text-transparent">
                                    ₹{cartTotal.toFixed(2)}
                                </span>

                            </div>

                            {/* Security */}
                            <div className="mt-7 space-y-3 border-t border-white/10 pt-6">

                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                    <ShieldCheck
                                        size={17}
                                        className="text-indigo-400"
                                    />
                                    Secure checkout
                                </div>

                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                    <Truck
                                        size={17}
                                        className="text-purple-400"
                                    />
                                    Free delivery
                                </div>

                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                    <CreditCard
                                        size={17}
                                        className="text-emerald-400"
                                    />
                                    Safe payment processing
                                </div>

                            </div>

                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}

export default Checkout;

