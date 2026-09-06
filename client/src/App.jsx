import {
    BrowserRouter,
    Routes,
    Route,
    useLocation
} from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminCategories from "./pages/AdminCategories";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";


function AppContent() {

    const location = useLocation();

    const isAdminPage =
        location.pathname.startsWith("/admin");


    return (
        <>

            {/* Navbar */}
            {isAdminPage ? (
                <AdminNavbar />
            ) : (
                <Navbar />
            )}


            <main>

                <Routes>

                    {/* ================= HOME ================= */}

                    <Route
                        path="/"
                        element={<Home />}
                    />


                    {/* ================= PRODUCTS ================= */}

                    <Route
                        path="/products"
                        element={<Products />}
                    />

                    <Route
                        path="/products/:id"
                        element={<ProductDetails />}
                    />


                    {/* ================= AUTH ================= */}

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />

                    <Route
                        path="/reset-password/:token"
                        element={<ResetPassword />}
                    />


                    {/* ================= CART ================= */}

                    <Route
                        path="/cart"
                        element={<Cart />}
                    />

                    <Route
                        path="/wishlist"
                        element={<Wishlist />}
                    />


                    {/* ================= USER PROTECTED ================= */}

                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute>
                                <Checkout />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/confirmation"
                        element={
                            <ProtectedRoute>
                                <Confirmation />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute>
                                <Orders />
                            </ProtectedRoute>
                        }
                    />


                    {/* ================= ADMIN ================= */}

                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        }
                    />
                    <Route
    path="/admin/products"
    element={
        <AdminRoute>
            <AdminProducts />
        </AdminRoute>
    }
/>
<Route
    path="/admin/orders"
    element={
        <AdminRoute>
            <AdminOrders />
        </AdminRoute>
    }
/>
<Route
    path="/admin/users"
    element={
        <AdminRoute>
            <AdminUsers />
        </AdminRoute>
    }
/>
<Route
    path="/admin/categories"
    element={
        <AdminRoute>
            <AdminCategories />
        </AdminRoute>
    }
/>
<Route
    path="/admin/analytics"
    element={
        <AdminRoute>
            <AdminAnalytics />
        </AdminRoute>
    }
/>

                </Routes>

            </main>

        </>
    );
}


function App() {

    return (
        <BrowserRouter>

            <AppContent />

        </BrowserRouter>
    );
}


export default App;