
import { useEffect, useState } from "react";
import {
    Search,
    SlidersHorizontal,
    X,
    ShoppingBag,
    PackageSearch,
    ShoppingCart,
    Heart,
    Check
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import API from "../services/api";
import { useCart } from "../context/CartContext";

function Products() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [searchParams] = useSearchParams();
    const categoryFromUrl = searchParams.get("category");

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("default");

    const [visibleCount, setVisibleCount] = useState(8);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // UX FEEDBACK STATES
    const [addedProductId, setAddedProductId] = useState(null);
    const [wishlistAnimationId, setWishlistAnimationId] = useState(null);

    const {
        addToCart,
        toggleWishlist,
        isInWishlist
    } = useCart();

    // =========================
    // FETCH PRODUCTS
    // =========================

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await API.get("/products");

                setProducts(response.data);
                setFilteredProducts(response.data);
            } catch (error) {
                console.error(error);
                setError("Failed to load products.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // =========================
    // URL CATEGORY FILTER
    // =========================

    useEffect(() => {
        if (
            categoryFromUrl &&
            products.some(
                (product) => product.category === categoryFromUrl
            )
        ) {
            setCategory(categoryFromUrl);
        }
    }, [categoryFromUrl, products]);

    // =========================
    // FILTER + SORT PRODUCTS
    // =========================

    useEffect(() => {
        let result = [...products];

        if (search.trim()) {
            result = result.filter((product) =>
                product.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        if (category !== "All") {
            result = result.filter(
                (product) => product.category === category
            );
        }

        if (maxPrice) {
            result = result.filter(
                (product) =>
                    Number(product.price) <= Number(maxPrice)
            );
        }

        switch (sortBy) {
            case "newest":
                result.sort(
                    (a, b) =>
                        new Date(b.createdAt || 0) -
                        new Date(a.createdAt || 0)
                );
                break;

            case "price-low":
                result.sort(
                    (a, b) =>
                        Number(a.price) - Number(b.price)
                );
                break;

            case "price-high":
                result.sort(
                    (a, b) =>
                        Number(b.price) - Number(a.price)
                );
                break;

            case "rating":
                result.sort(
                    (a, b) =>
                        Number(b.rating || 0) -
                        Number(a.rating || 0)
                );
                break;

            case "name":
                result.sort((a, b) =>
                    (a.name || "").localeCompare(
                        b.name || ""
                    )
                );
                break;

            default:
                break;
        }

        setFilteredProducts(result);
        setVisibleCount(8);
    }, [
        search,
        category,
        maxPrice,
        sortBy,
        products
    ]);

    // =========================
    // CATEGORIES
    // =========================

    const categories = [
        "All",
        ...new Set(
            products
                .map((product) => product.category)
                .filter(Boolean)
        )
    ];

    // =========================
    // CLEAR FILTERS
    // =========================

    const clearFilters = () => {
        setSearch("");
        setCategory("All");
        setMaxPrice("");
        setSortBy("default");
        setVisibleCount(8);
    };

    // =========================
    // LOAD MORE
    // =========================

    const visibleProducts = filteredProducts.slice(
        0,
        visibleCount
    );

    const hasMoreProducts =
        visibleCount < filteredProducts.length;

    const loadMoreProducts = () => {
        setVisibleCount((currentCount) =>
            Math.min(
                currentCount + 8,
                filteredProducts.length
            )
        );
    };

    // =========================
    // ADD TO CART FEEDBACK
    // =========================

    const handleAddToCart = (product) => {
        if (Number(product.stock) === 0) {
            return;
        }

        addToCart(product);

        setAddedProductId(product._id);

        setTimeout(() => {
            setAddedProductId(null);
        }, 1500);
    };

    // =========================
    // WISHLIST FEEDBACK
    // =========================

    const handleWishlist = (product) => {
        toggleWishlist(product);

        setWishlistAnimationId(product._id);

        setTimeout(() => {
            setWishlistAnimationId(null);
        }, 500);
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-950 px-6 py-24 text-white">

                <div className="mx-auto flex max-w-none w-full flex-col items-center justify-center py-32">

                    <div className="mb-5 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-indigo-500"></div>

                    <p className="text-lg font-medium text-slate-300">
                        Loading products...
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Please wait a moment
                    </p>

                </div>

            </main>
        );
    }

    // =========================
    // ERROR
    // =========================

    if (error) {
        return (
            <main className="min-h-screen bg-slate-950 px-6 py-24 text-white">

                <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-red-500/20 bg-red-500/5 p-10 text-center">

                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl">
                        ⚠️
                    </div>

                    <h2 className="text-2xl font-bold">
                        Something went wrong
                    </h2>

                    <p className="mt-2 text-slate-400">
                        {error}
                    </p>

                </div>

            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6 lg:px-8">

            {/* Background */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

                <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl"></div>

                <div className="absolute -right-40 top-96 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl"></div>

            </div>

            <div className="mx-auto max-w-none w-full">

                {/* HEADER */}
                <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

                    <div>

                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">

                            <ShoppingBag size={15} />

                            ShopEase Collection

                        </div>

                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">

                            Explore{" "}

                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Products
                            </span>

                        </h1>

                        <p className="mt-3 max-w-xl text-slate-400">
                            Find the perfect products for you at amazing
                            prices.
                        </p>

                    </div>

                    {/* Product Count */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 shadow-xl backdrop-blur-xl">

                        <p className="text-xs uppercase tracking-wider text-slate-500">
                            Showing
                        </p>

                        <p className="mt-1 text-2xl font-bold">

                            {visibleProducts.length}

                            <span className="ml-1 text-sm font-normal text-slate-400">
                                of {filteredProducts.length} products
                            </span>

                        </p>

                    </div>

                </div>

                {/* FILTER PANEL */}
                <div className="mb-10 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl sm:p-6">

                    <div className="mb-5 flex items-center justify-between">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                                <SlidersHorizontal size={19} />
                            </div>

                            <div>

                                <h2 className="font-bold">
                                    Filters
                                </h2>

                                <p className="text-xs text-slate-500">
                                    Find exactly what you're looking for
                                </p>

                            </div>

                        </div>

                        {(search ||
                            category !== "All" ||
                            maxPrice ||
                            sortBy !== "default") && (

                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                            >

                                <X size={15} />

                                Clear

                            </button>
                        )}

                    </div>

                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

                        {/* Search */}
                        <div className="lg:col-span-2">

                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Search Products
                            </label>

                            <div className="relative">

                                <Search
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                />

                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                                />

                            </div>

                        </div>

                        {/* Category */}
                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Category
                            </label>

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }
                                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-sm text-white outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                            >

                                {categories.map((item) => (
                                    <option
                                        key={item}
                                        value={item}
                                        className="bg-slate-900"
                                    >
                                        {item}
                                    </option>
                                ))}

                            </select>

                        </div>

                        {/* Price */}
                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Maximum Price
                            </label>

                            <div className="relative">

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Max price"
                                    value={maxPrice}
                                    onChange={(e) =>
                                        setMaxPrice(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3.5 pl-9 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                                />

                            </div>

                        </div>

                        {/* Sort */}
                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Sort By
                            </label>

                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(e.target.value)
                                }
                                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-sm text-white outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                            >

                                <option
                                    value="default"
                                    className="bg-slate-900"
                                >
                                    Default
                                </option>

                                <option
                                    value="newest"
                                    className="bg-slate-900"
                                >
                                    Newest
                                </option>

                                <option
                                    value="price-low"
                                    className="bg-slate-900"
                                >
                                    Price: Low → High
                                </option>

                                <option
                                    value="price-high"
                                    className="bg-slate-900"
                                >
                                    Price: High → Low
                                </option>

                                <option
                                    value="rating"
                                    className="bg-slate-900"
                                >
                                    Rating: High → Low
                                </option>

                                <option
                                    value="name"
                                    className="bg-slate-900"
                                >
                                    Name: A → Z
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

                {/* NO PRODUCTS */}
                {filteredProducts.length === 0 ? (

                    <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-24 text-center">

                        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-slate-500">
                            <PackageSearch size={38} />
                        </div>

                        <h2 className="text-2xl font-bold">
                            No products found
                        </h2>

                        <p className="mt-2 max-w-md text-slate-500">
                            We couldn't find products matching your
                            search or filters. Try changing your
                            criteria.
                        </p>

                        <button
                            onClick={clearFilters}
                            className="mt-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 font-semibold shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5"
                        >
                            Clear Filters
                        </button>

                    </div>

                ) : (

                    <>

                        {/* PRODUCTS GRID */}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                            {visibleProducts.map((product) => {

                                const wishlisted = isInWishlist(
                                    product._id
                                );

                                const isAdded =
                                    addedProductId === product._id;

                                const isAnimatingWishlist =
                                    wishlistAnimationId === product._id;

                                const stock =
                                    Number(product.stock) || 0;

                                return (
                                    <div
                                        key={product._id}
                                        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-indigo-400/30 hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-indigo-500/10"
                                    >

                                        {/* Image */}
                                        <div className="relative h-64 overflow-hidden bg-slate-900">

                                            {product.image ? (

                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display =
                                                            "none";

                                                        if (
                                                            e.currentTarget
                                                                .nextElementSibling
                                                        ) {
                                                            e.currentTarget
                                                                .nextElementSibling
                                                                .style.display =
                                                                "flex";
                                                        }
                                                    }}
                                                />

                                            ) : null}

                                            {/* Image Fallback */}
                                            <div
                                                className={`${
                                                    product.image
                                                        ? "hidden"
                                                        : "flex"
                                                } h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950`}
                                            >

                                                <div className="text-center">

                                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-500">
                                                        <PackageSearch size={32} />
                                                    </div>

                                                    <p className="text-sm font-semibold text-slate-400">
                                                        Image unavailable
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-600">
                                                        Product preview not available
                                                    </p>

                                                </div>

                                            </div>

                                            {/* Image Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent opacity-80"></div>

                                            {/* Category */}
                                            <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs font-semibold text-indigo-300 shadow-lg backdrop-blur-md">
                                                {product.category}
                                            </span>

                                            {/* Wishlist Button */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleWishlist(product)
                                                }
                                                aria-label={
                                                    wishlisted
                                                        ? "Remove from wishlist"
                                                        : "Add to wishlist"
                                                }
                                                title={
                                                    wishlisted
                                                        ? "Remove from wishlist"
                                                        : "Add to wishlist"
                                                }
                                                className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 ${
                                                    wishlisted
                                                        ? "border-pink-400/30 bg-pink-500/15 text-pink-400 shadow-lg shadow-pink-500/20"
                                                        : "border-white/10 bg-slate-950/70 text-white hover:scale-110 hover:border-pink-400/30 hover:bg-pink-500/10 hover:text-pink-400"
                                                } ${
                                                    isAnimatingWishlist
                                                        ? "scale-125"
                                                        : ""
                                                }`}
                                            >

                                                <Heart
                                                    size={18}
                                                    fill={
                                                        wishlisted
                                                            ? "currentColor"
                                                            : "none"
                                                    }
                                                />

                                            </button>

                                            {/* Stock */}
                                            <span
                                                className={`absolute right-4 top-16 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-md ${
                                                    stock === 0
                                                        ? "border-red-400/20 bg-red-500/10 text-red-300"
                                                        : stock <= 5
                                                        ? "border-yellow-400/20 bg-yellow-500/10 text-yellow-300"
                                                        : "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                                                }`}
                                            >
                                                {stock === 0
                                                    ? "Out of Stock"
                                                    : stock <= 5
                                                    ? `Only ${stock} left`
                                                    : "In Stock"}
                                            </span>

                                        </div>

                                        {/* Content */}
                                        <div className="p-5">

                                            {/* Product Name */}
                                            <h3 className="truncate text-lg font-bold transition-colors duration-300 group-hover:text-indigo-300">
                                                {product.name}
                                            </h3>

                                            {/* Description */}
                                            <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-500">
                                                {product.description ||
                                                    "Discover this amazing product at ShopEase."}
                                            </p>

                                            {/* Rating */}
                                            <div className="mt-3 flex items-center gap-2">

                                                <div className="flex items-center gap-1">

                                                    <span className="text-base text-yellow-400">
                                                        ★
                                                    </span>

                                                    <span className="text-sm font-bold text-white">
                                                        {Number(
                                                            product.rating || 0
                                                        ).toFixed(1)}
                                                    </span>

                                                </div>

                                                <span className="text-xs text-slate-500">
                                                    •
                                                </span>

                                                <span className="text-xs text-slate-400">
                                                    {product.reviewCount || 0} reviews
                                                </span>

                                            </div>

                                            {/* Bottom */}
                                            <div className="mt-5 flex flex-col gap-3">

                                                <div className="flex items-center justify-between gap-3">

                                                    {/* Price */}
                                                    <div>

                                                        <p className="text-xs uppercase tracking-wide text-slate-600">
                                                            Price
                                                        </p>

                                                        <strong className="text-2xl font-extrabold tracking-tight text-white">
                                                            ₹{product.price}
                                                        </strong>

                                                    </div>

                                                    {/* View Details */}
                                                    <Link
                                                        to={`/products/${product._id}`}
                                                        className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-indigo-500/40"
                                                    >
                                                        View Details
                                                    </Link>

                                                </div>

                                                {/* Add To Cart */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleAddToCart(product)
                                                    }
                                                    disabled={stock === 0}
                                                    className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition-all duration-300 ${
                                                        stock === 0
                                                            ? "cursor-not-allowed border-white/5 bg-slate-900 text-slate-600"
                                                            : isAdded
                                                            ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300 shadow-lg shadow-emerald-500/10"
                                                            : "border-indigo-400/20 bg-indigo-500/10 text-indigo-300 hover:-translate-y-0.5 hover:border-indigo-400/40 hover:bg-indigo-500/20 hover:text-white hover:shadow-lg hover:shadow-indigo-500/10"
                                                    }`}
                                                >

                                                    {stock === 0 ? (
                                                        <>
                                                            <PackageSearch size={17} />
                                                            Out of Stock
                                                        </>
                                                    ) : isAdded ? (
                                                        <>
                                                            <Check
                                                                size={17}
                                                                className="animate-pulse"
                                                            />
                                                            Added to Cart
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ShoppingCart size={17} />
                                                            Add to Cart
                                                        </>
                                                    )}

                                                </button>

                                            </div>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                        {/* LOAD MORE */}
                        {hasMoreProducts && (

                            <div className="mt-12 flex flex-col items-center">

                                <p className="mb-4 text-sm text-slate-500">
                                    Showing {visibleProducts.length} of{" "}
                                    {filteredProducts.length} products
                                </p>

                                <button
                                    type="button"
                                    onClick={loadMoreProducts}
                                    className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-8 py-3.5 text-sm font-bold text-indigo-300 shadow-lg shadow-indigo-500/10 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:bg-indigo-500/20 hover:text-white hover:shadow-indigo-500/20"
                                >
                                    Load More Products
                                </button>

                            </div>

                        )}

                        {!hasMoreProducts &&
                            filteredProducts.length > 8 && (

                            <div className="mt-12 text-center">

                                <p className="text-sm text-slate-600">
                                    ✨ You've reached the end of the collection.
                                </p>

                            </div>
                        )}

                    </>
                )}

            </div>
        </main>
    );
}

export default Products;

