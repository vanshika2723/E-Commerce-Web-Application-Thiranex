
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // =========================
    // CART STATE
    // =========================
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");

        return savedCart ? JSON.parse(savedCart) : [];
    });

    // =========================
    // WISHLIST STATE
    // =========================
    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist =
            localStorage.getItem("wishlist");

        return savedWishlist
            ? JSON.parse(savedWishlist)
            : [];
    });

    // =========================
    // SAVE CART
    // =========================
    useEffect(() => {
        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );
    }, [cart]);

    // =========================
    // SAVE WISHLIST
    // =========================
    useEffect(() => {
        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );
    }, [wishlist]);

    // =========================
    // ADD TO CART
    // =========================
    const addToCart = (product) => {
        setCart((currentCart) => {
            const existingProduct = currentCart.find(
                (item) => item._id === product._id
            );

            const stock = Number(product.stock) || 0;

            if (stock <= 0) {
                return currentCart;
            }

            if (existingProduct) {
                if (existingProduct.quantity >= stock) {
                    return currentCart;
                }

                return currentCart.map((item) =>
                    item._id === product._id
                        ? {
                              ...item,
                              quantity: Math.min(
                                  item.quantity + 1,
                                  stock
                              )
                          }
                        : item
                );
            }

            return [
                ...currentCart,
                {
                    ...product,
                    quantity: 1
                }
            ];
        });
    };

    // =========================
    // REMOVE FROM CART
    // =========================
    const removeFromCart = (productId) => {
        setCart((currentCart) =>
            currentCart.filter(
                (item) => item._id !== productId
            )
        );
    };

    // =========================
    // UPDATE QUANTITY
    // =========================
    const updateQuantity = (productId, quantity) => {
        setCart((currentCart) =>
            currentCart.map((item) => {
                if (item._id !== productId) {
                    return item;
                }

                const stock = Number(item.stock) || 0;

                const safeQuantity = Math.min(
                    Math.max(1, Number(quantity)),
                    stock
                );

                return {
                    ...item,
                    quantity: safeQuantity
                };
            })
        );
    };

    // =========================
    // CLEAR CART
    // =========================
    const clearCart = () => {
        setCart([]);
    };

    // =========================
    // ADD TO WISHLIST
    // =========================
    const addToWishlist = (product) => {
        setWishlist((currentWishlist) => {
            const alreadyExists = currentWishlist.some(
                (item) => item._id === product._id
            );

            if (alreadyExists) {
                return currentWishlist;
            }

            return [
                ...currentWishlist,
                product
            ];
        });
    };

    // =========================
    // REMOVE FROM WISHLIST
    // =========================
    const removeFromWishlist = (productId) => {
        setWishlist((currentWishlist) =>
            currentWishlist.filter(
                (item) => item._id !== productId
            )
        );
    };

    // =========================
    // TOGGLE WISHLIST
    // =========================
    const toggleWishlist = (product) => {
        setWishlist((currentWishlist) => {
            const exists = currentWishlist.some(
                (item) => item._id === product._id
            );

            if (exists) {
                return currentWishlist.filter(
                    (item) => item._id !== product._id
                );
            }

            return [
                ...currentWishlist,
                product
            ];
        });
    };

    // =========================
    // CHECK WISHLIST
    // =========================
    const isInWishlist = (productId) => {
        return wishlist.some(
            (item) => item._id === productId
        );
    };

    // =========================
    // CLEAR WISHLIST
    // =========================
    const clearWishlist = () => {
        setWishlist([]);
    };

    // =========================
    // CART COUNT
    // =========================
    const cartCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    // =========================
    // WISHLIST COUNT
    // =========================
    const wishlistCount = wishlist.length;

    // =========================
    // CART TOTAL
    // =========================
    const cartTotal = cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                // Cart
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount,
                cartTotal,

                // Wishlist
                wishlist,
                addToWishlist,
                removeFromWishlist,
                toggleWishlist,
                isInWishlist,
                clearWishlist,
                wishlistCount
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCart must be used inside CartProvider"
        );
    }

    return context;
};

