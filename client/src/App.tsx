import "./App.css";
import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// PUBLIC PAGES
import Home from "./pages/Home";
import CategoriesPage from "./pages/CategoriesPage";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

// STATIC PAGES
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQs from "./pages/FAQs";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

// PROTECTED BUYER PAGES
import CreateListing from "./pages/CreateListing";
import MyListings from "./pages/MyListings";
import Account from "./pages/Account";
import Profile from "./pages/Profile";
import Favourites from "./pages/Favourites";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderDetails from "./pages/OrderDetails";
import PaymentCallback from "./pages/PaymentCallback";

// SELLER PAGES
import SellerDashboard from "./pages/SellerDashboard";
import SellerBusinessHours from "./pages/SellerBusinessHours";
import SellerFinance from "./pages/SellerFinance";

// ADMIN PAGES
import AdminDashboard from "./pages/AdminDashboard";
import AdminFinance from "./pages/AdminFinance";
import AdminSettlements from "./pages/AdminSettlements";
import AdminCategories from "./pages/AdminCategories";
import AdminBanners from "./pages/AdminBanners";

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <div className="app-wrapper">
                        <Navbar />

                        <main className="app-main">
                            <Routes>
                                {/* PUBLIC ROUTES */}
                                <Route path="/" element={<Home />} />
                                <Route path="/marketplace" element={<Home />} />
                                <Route path="/categories" element={<CategoriesPage />} />
                                <Route path="/product/:id" element={<ProductDetails />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />

                                {/* STATIC ROUTES */}
                                <Route path="/about" element={<About />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/faqs" element={<FAQs />} />
                                <Route path="/terms" element={<Terms />} />
                                <Route path="/privacy" element={<Privacy />} />
                                <Route path="/safety" element={<NotFound title="Buyer Safety Centre" />} />
                                <Route path="/delivery" element={<NotFound title="Delivery Information" />} />
                                <Route path="/returns" element={<NotFound title="Return Policy" />} />
                                <Route path="/bulk" element={<NotFound title="Bulk Purchase" />} />
                                <Route path="/sitemap" element={<NotFound title="Site Map" />} />
                                <Route path="/track-order" element={<NotFound title="Track My Order" />} />
                                <Route path="/authentic" element={<NotFound title="Authentic Items Policy" />} />
                                <Route path="/affiliate" element={<NotFound title="Become an Affiliate" />} />
                                <Route path="/careers" element={<NotFound title="Careers" />} />
                                <Route path="/blog" element={<NotFound title="Our Blog" />} />

                                {/* PROTECTED BUYER ROUTES */}
                                <Route path="/create-listing" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
                                <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
                                <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                                <Route path="/favourites" element={<ProtectedRoute><Favourites /></ProtectedRoute>} />
                                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                                <Route path="/orders/:orderId/payment/callback" element={<ProtectedRoute><PaymentCallback /></ProtectedRoute>} />
                                <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />

                                {/* SELLER ROUTES */}
                                <Route path="/seller-dashboard" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
                                <Route path="/business-hours" element={<ProtectedRoute><SellerBusinessHours /></ProtectedRoute>} />
                                <Route path="/seller-finance" element={<ProtectedRoute><SellerFinance /></ProtectedRoute>} />

                                {/* ADMIN ROUTES */}
                                <Route
                                    path="/admin"
                                    element={
                                        <AdminRoute>
                                            <AdminLayout />
                                        </AdminRoute>
                                    }
                                >
                                    <Route index element={<AdminDashboard />} />
                                    <Route path="categories" element={<AdminCategories />} />
                                    <Route path="settlements" element={<AdminSettlements />} />
                                    <Route path="finance" element={<AdminFinance />} />
                                    <Route path="banners" element={<AdminBanners />} />
                                    <Route path="users" element={<AdminDashboard />} />
                                </Route>

                                {/* FALLBACK */}
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </main>

                        <Footer />
                    </div>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;