import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
function Home() {
    const [products, setProducts] = useState([]);

useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await API.get("/products");
            setProducts(response.data);
        } catch (error) {
            console.error("Failed to load products:", error);
        }
    };

    fetchProducts();
}, []);

const trendingProducts = products.slice(0, 4);
    return (
        <main className="min-h-screen bg-slate-950 text-white">

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950"></div>

                <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl"></div>
                <div className="absolute top-40 -right-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl"></div>

                <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-none w-full items-center px-6 py-20 lg:px-8">

                    <div className="grid w-full items-center gap-12 lg:grid-cols-2">

                        {/* Left Content */}
                        <div className="text-center lg:text-left">

                            {/* Badge */}
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-indigo-300 backdrop-blur-md">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
                                Discover Something Amazing
                            </div>

                            <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                                Welcome to{" "}
                                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    ShopEase
                                </span>
                            </h1>

                            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300 lg:mx-0">
                                Discover amazing products at great prices.
                                Shop smarter, find better deals, and enjoy a
                                seamless shopping experience.
                            </p>

                            {/* Buttons */}
                            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">

                                <Link
                                    to="/products"
                                    className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-7 py-3.5 font-semibold shadow-lg shadow-indigo-500/25 transition duration-300 hover:-translate-y-1 hover:shadow-indigo-500/40"
                                >
                                    🛍️ Shop Now
                                </Link>

                                <Link
                                    to="/products"
                                    className="rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 font-semibold backdrop-blur-md transition duration-300 hover:bg-white/10"
                                >
                                    Explore Products →
                                </Link>

                            </div>

                            {/* Trust Stats */}
                            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-7">

                                <div>
                                    <h3 className="text-2xl font-bold">10K+</h3>
                                    <p className="text-sm text-slate-400">
                                        Products
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold">5K+</h3>
                                    <p className="text-sm text-slate-400">
                                        Customers
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold">4.9★</h3>
                                    <p className="text-sm text-slate-400">
                                        Rating
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Right Visual */}
                        <div className="relative hidden lg:block">

                            <div className="relative mx-auto h-[480px] w-[480px]">

                                {/* Glow */}
                                <div className="absolute inset-10 rounded-full bg-indigo-500/20 blur-3xl"></div>

                                {/* Main Card */}
                                <div className="absolute left-1/2 top-1/2 w-80 -translate-x-1/2 -translate-y-1/2 rotate-[-5deg] rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">

                                    <div className="flex h-56 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-8xl">
                                        🛍️
                                    </div>

                                    <div className="mt-5">
                                        <div className="h-4 w-32 rounded bg-white/20"></div>
                                        <div className="mt-3 h-3 w-48 rounded bg-white/10"></div>

                                        <div className="mt-5 flex items-center justify-between">
                                            <span className="text-xl font-bold">
                                                ₹999
                                            </span>

                                            <span className="rounded-lg bg-white/10 px-3 py-2 text-sm">
                                                ⭐ 4.9
                                            </span>
                                        </div>
                                    </div>

                                </div>

                                {/* Floating Card 1 */}
                                <div className="absolute right-0 top-16 rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-xl backdrop-blur-xl">
                                    <p className="text-xs text-slate-400">
                                        Today's Deal
                                    </p>
                                    <p className="mt-1 text-lg font-bold text-green-400">
                                        40% OFF
                                    </p>
                                </div>

                                {/* Floating Card 2 */}
                                <div className="absolute bottom-14 left-0 rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-xl backdrop-blur-xl">
                                    <p className="text-xs text-slate-400">
                                        Free Delivery
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        🚚 On orders ₹499+
                                    </p>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="border-t border-white/10 bg-slate-900/60">
                <div className="mx-auto grid max-w-none w-full gap-6 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:bg-white/[0.06]">
                        <div className="mb-4 text-3xl">🚚</div>
                        <h3 className="font-bold">Fast Delivery</h3>
                        <p className="mt-2 text-sm text-slate-400">
                            Quick and reliable delivery to your doorstep.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:bg-white/[0.06]">
                        <div className="mb-4 text-3xl">🔒</div>
                        <h3 className="font-bold">Secure Payment</h3>
                        <p className="mt-2 text-sm text-slate-400">
                            Your payments and personal information stay secure.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:bg-white/[0.06]">
                        <div className="mb-4 text-3xl">💎</div>
                        <h3 className="font-bold">Best Quality</h3>
                        <p className="mt-2 text-sm text-slate-400">
                            Carefully selected products with great quality.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:bg-white/[0.06]">
                        <div className="mb-4 text-3xl">💬</div>
                        <h3 className="font-bold">24/7 Support</h3>
                        <p className="mt-2 text-sm text-slate-400">
                            We're always here to help whenever you need us.
                        </p>
                    </div>

                </div>
            </section>
            {/* Categories */}
<section className="border-t border-white/10 bg-slate-950">
    <div className="mx-auto w-full px-6 py-24 lg:px-8">

        <div className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">
                Explore Collections
            </span>

            <h2 className="mt-3 text-4xl font-extrabold sm:text-5xl">
                Shop by Category
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
                Explore our popular categories and discover products
                made for every lifestyle.
            </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <a
                href="/products?category=Electronics"
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-2 hover:border-indigo-500/40 hover:bg-white/[0.06]"
            >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-4xl transition group-hover:scale-110">
                    💻
                </div>

                <h3 className="text-xl font-bold">Electronics</h3>
                <p className="mt-2 text-sm text-slate-400">
                    Latest gadgets and smart technology.
                </p>

                <span className="mt-5 inline-block text-sm font-semibold text-indigo-400">
                    Explore →
                </span>
            </a>

            <a
                href="/products?category=Fashion"
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-2 hover:border-purple-500/40 hover:bg-white/[0.06]"
            >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-4xl transition group-hover:scale-110">
                    👕
                </div>

                <h3 className="text-xl font-bold">Fashion</h3>
                <p className="mt-2 text-sm text-slate-400">
                    Trendy styles for every occasion.
                </p>

                <span className="mt-5 inline-block text-sm font-semibold text-purple-400">
                    Explore →
                </span>
            </a>

            <a
                href="/products?category=Home"
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-2 hover:border-pink-500/40 hover:bg-white/[0.06]"
            >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-500/10 text-4xl transition group-hover:scale-110">
                    🏠
                </div>

                <h3 className="text-xl font-bold">Home & Living</h3>
                <p className="mt-2 text-sm text-slate-400">
                    Make your home stylish and comfortable.
                </p>

                <span className="mt-5 inline-block text-sm font-semibold text-pink-400">
                    Explore →
                </span>
            </a>

            <a
                href="/products?category=Beauty"
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-2 hover:border-emerald-500/40 hover:bg-white/[0.06]"
            >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-4xl transition group-hover:scale-110">
                    ✨
                </div>

                <h3 className="text-xl font-bold">Beauty</h3>
                <p className="mt-2 text-sm text-slate-400">
                    Beauty essentials for your everyday needs.
                </p>

                <span className="mt-5 inline-block text-sm font-semibold text-emerald-400">
                    Explore →
                </span>
            </a>

        </div>
    </div>
</section>
{/* Trending Products */}
<section className="border-t border-white/10 bg-slate-900/60">
    <div className="mx-auto w-full px-6 py-24 lg:px-8">

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-purple-400">
                    Customer Favorites
                </span>

                <h2 className="mt-3 text-4xl font-extrabold sm:text-5xl">
                    Trending Products 🔥
                </h2>

                <p className="mt-4 max-w-2xl text-slate-400">
                    Check out some of our most popular products.
                </p>
            </div>

            <Link
                to="/products"
                className="w-fit rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
            >
                View All Products →
            </Link>
        </div>

        {trendingProducts.length > 0 && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {trendingProducts.map((product) => (
                    <Link
                        key={product._id}
                        to={`/products/${product._id}`}
                        className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-2 hover:border-indigo-500/40 hover:bg-white/[0.06]"
                    >
                        <div className="relative h-56 overflow-hidden bg-slate-800">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />

                            <span className="absolute left-4 top-4 rounded-full bg-indigo-500/90 px-3 py-1 text-xs font-semibold">
                                {product.category}
                            </span>
                        </div>

                        <div className="p-5">
                            <h3 className="truncate text-lg font-bold">
                                {product.name}
                            </h3>

                            <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                                {product.description}
                            </p>

                            <div className="mt-5 flex items-center justify-between">
                                <span className="text-xl font-extrabold">
                                    ₹{product.price}
                                </span>

                                <span className="rounded-xl bg-indigo-500/10 px-3 py-2 text-sm font-semibold text-indigo-400">
                                    View →
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        )}

    </div>
</section>
{/* Special Offer */}
<section className="relative overflow-hidden border-t border-white/10 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20">
    <div className="absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-3xl"></div>

    <div className="absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-pink-500/20 blur-3xl"></div>

    <div className="relative mx-auto w-full px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-8 shadow-2xl backdrop-blur-xl sm:p-12">

            <div className="grid items-center gap-10 lg:grid-cols-2">

                {/* Left */}
                <div>
                    <span className="inline-flex rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-semibold text-green-400">
                        🔥 Limited Time Offer
                    </span>

                    <h2 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
                        Get Up To{" "}
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            50% OFF
                        </span>
                    </h2>

                    <p className="mt-5 max-w-xl leading-7 text-slate-300">
                        Don't miss out on our exclusive deals. Grab your
                        favorite products before the offer ends!
                    </p>

                    <Link
                        to="/products"
                        className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-7 py-3.5 font-semibold shadow-lg shadow-indigo-500/25 transition duration-300 hover:-translate-y-1 hover:shadow-indigo-500/40"
                    >
                        Shop the Deal →
                    </Link>
                </div>

                {/* Right */}
                <div className="flex justify-center lg:justify-end">
                    <div className="relative flex h-52 w-52 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] shadow-2xl">
                        
                        <div className="absolute inset-4 rounded-full border border-dashed border-purple-400/30"></div>

                        <div className="text-center">
                            <p className="text-sm uppercase tracking-widest text-slate-400">
                                Save
                            </p>

                            <p className="mt-1 text-6xl font-black bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                                50%
                            </p>

                            <p className="text-sm font-semibold text-white">
                                OFF
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</section>
{/* Testimonials */}
<section className="border-t border-white/10 bg-slate-950">
    <div className="mx-auto w-full px-6 py-24 lg:px-8">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">
                Customer Love
            </span>

            <h2 className="mt-3 text-4xl font-extrabold sm:text-5xl">
                What Our Customers Say 💬
            </h2>

            <p className="mt-5 text-slate-400">
                Thousands of happy customers trust ShopEase for quality
                products and a smooth shopping experience.
            </p>
        </div>

        {/* Reviews */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">

            {/* Review 1 */}
            <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-2 hover:border-indigo-500/30 hover:bg-white/[0.06]">
                <div className="flex items-center gap-1 text-yellow-400">
                    ★★★★★
                </div>

                <p className="mt-5 leading-7 text-slate-300">
                    "Amazing shopping experience! The product quality was
                    excellent and delivery was super fast."
                </p>

                <div className="mt-7 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold">
                        A
                    </div>

                    <div>
                        <h3 className="font-bold">Ananya Sharma</h3>
                        <p className="text-sm text-slate-500">
                            Verified Customer
                        </p>
                    </div>
                </div>
            </div>

            {/* Review 2 */}
            <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-2 hover:border-purple-500/30 hover:bg-white/[0.06]">
                <div className="flex items-center gap-1 text-yellow-400">
                    ★★★★★
                </div>

                <p className="mt-5 leading-7 text-slate-300">
                    "I found exactly what I was looking for at a great price.
                    The entire checkout process was simple and smooth."
                </p>

                <div className="mt-7 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-lg font-bold">
                        R
                    </div>

                    <div>
                        <h3 className="font-bold">Rahul Mehta</h3>
                        <p className="text-sm text-slate-500">
                            Verified Customer
                        </p>
                    </div>
                </div>
            </div>

            {/* Review 3 */}
            <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-2 hover:border-pink-500/30 hover:bg-white/[0.06]">
                <div className="flex items-center gap-1 text-yellow-400">
                    ★★★★★
                </div>

                <p className="mt-5 leading-7 text-slate-300">
                    "Excellent service and beautiful products. ShopEase has
                    quickly become my favorite online store."
                </p>

                <div className="mt-7 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-lg font-bold">
                        P
                    </div>

                    <div>
                        <h3 className="font-bold">Priya Verma</h3>
                        <p className="text-sm text-slate-500">
                            Verified Customer
                        </p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</section>
{/* Newsletter */}
<section className="border-t border-white/10 bg-slate-900/60">
    <div className="mx-auto w-full px-6 py-20 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-pink-600/20 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">

            <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl"></div>

            <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl"></div>

            <div className="relative mx-auto max-w-2xl">

                <span className="text-4xl">📧</span>

                <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">
                    Stay in the Loop
                </h2>

                <p className="mt-4 text-slate-400">
                    Subscribe to our newsletter and get exclusive deals,
                    new product updates, and special offers directly in
                    your inbox.
                </p>

                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
                >
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/70 px-5 py-3.5 text-white outline-none placeholder:text-slate-500 transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                    />

                    <button
                        type="submit"
                        className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-7 py-3.5 font-semibold shadow-lg shadow-indigo-500/20 transition duration-300 hover:-translate-y-1 hover:shadow-indigo-500/40"
                    >
                        Subscribe →
                    </button>
                </form>

                <p className="mt-4 text-xs text-slate-500">
                    🔒 We respect your privacy. No spam, ever.
                </p>

            </div>
        </div>
    </div>
</section>
{/* Final CTA */}
<section className="border-t border-white/10 bg-slate-950">
    <div className="mx-auto w-full px-6 py-20 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-14 text-center shadow-2xl sm:px-12">

            <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-white/10 blur-3xl"></div>

            <div className="relative mx-auto max-w-3xl">

                <span className="text-4xl">🛍️</span>

                <h2 className="mt-5 text-3xl font-extrabold sm:text-5xl">
                    Ready to Find Something Amazing?
                </h2>

                <p className="mx-auto mt-5 max-w-2xl text-indigo-100/80">
                    Explore our collection, discover great deals, and make
                    your next purchase with ShopEase.
                </p>

                <Link
                    to="/products"
                    className="mt-8 inline-flex rounded-xl bg-white px-7 py-3.5 font-bold text-indigo-700 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-slate-100"
                >
                    Explore Products →
                </Link>

            </div>
        </div>
    </div>
</section>

        </main>
    );
}

export default Home;