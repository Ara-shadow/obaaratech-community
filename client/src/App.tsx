import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Navbar from "./components/Navbar";

import {
    AuthProvider
} from "./context/AuthContext";

import {
    CartProvider
} from "./context/CartContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import CreateListing from "./pages/CreateListing";
import MyListings from "./pages/MyListings";
import Account from "./pages/Account";
import Profile from "./pages/Profile";
import Favourites from "./pages/Favourites";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderDetails from "./pages/OrderDetails";
import PaymentCallback from "./pages/PaymentCallback";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SellerDashboard from "./pages/SellerDashboard";
import SellerBusinessHours from "./pages/SellerBusinessHours";

function App() {

    return (

        <AuthProvider>

            <CartProvider>

                <BrowserRouter>

                    <Navbar />

                    <Routes>

                        <Route
                            path="/"
                            element={<Home />}
                        />

                        <Route
                            path="/marketplace"
                            element={<Home />}
                        />

                        <Route
                            path="/product/:id"
                            element={<ProductDetails />}
                        />

                        <Route
                            path="/create-listing"
                            element={
                                <ProtectedRoute>
                                    <CreateListing />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/my-listings"
                            element={
                                <ProtectedRoute>
                                    <MyListings />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/account"
                            element={
                                <ProtectedRoute>
                                    <Account />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/favourites"
                            element={
                                <ProtectedRoute>
                                    <Favourites />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/cart"
                            element={
                                <ProtectedRoute>
                                    <Cart />
                                </ProtectedRoute>
                            }
                        />
                           <Route
    path="/checkout"
    element={
        <ProtectedRoute>
            <Checkout />
        </ProtectedRoute>
    }
/>
                       <Route
    path="/orders/:orderId/payment/callback"
    element={
        <ProtectedRoute>
            <PaymentCallback />
        </ProtectedRoute>
    }
/>

<Route
    path="/orders/:id"
    element={
        <ProtectedRoute>
            <OrderDetails />
        </ProtectedRoute>
    }
/>


                        <Route
                            path="/seller-dashboard"
                            element={
                                <ProtectedRoute>
                                    <SellerDashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/business-hours"
                            element={
                                <ProtectedRoute>
                                    <SellerBusinessHours />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/login"
                            element={<Login />}
                        />

                        <Route
                            path="/register"
                            element={<Register />}
                        />

                        <Route
                            path="*"
                            element={<Home />}
                        />

                    </Routes>

                </BrowserRouter>

            </CartProvider>

        </AuthProvider>

    );

}

export default App;
