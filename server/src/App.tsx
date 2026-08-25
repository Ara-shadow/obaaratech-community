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

import Marketplace from "./pages/Marketplace";
import ProductDetails from "./pages/ProductDetails";
import CreateListing from "./pages/CreateListing";
import MyListings from "./pages/MyListings";
import Account from "./pages/Account";
import Profile from "./pages/Profile";
import Favourites from "./pages/Favourites";
import Cart from "./pages/Cart";
import OrderDetails from "./pages/OrderDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SellerDashboard from "./pages/SellerDashboard";
import PaymentCallback from "./pages/PaymentCallback";


function App() {

    return (

        <AuthProvider>

            <CartProvider>

                <BrowserRouter>

                    <Navbar />

                    <Routes>

                        <Route
                            path="/"
                            element={<Marketplace />}
                        />

                        <Route
                            path="/marketplace"
                            element={<Marketplace />}
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
    path="/orders/:id/payment/callback"
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
                            path="/login"
                            element={<Login />}
                        />

                        <Route
                            path="/register"
                            element={<Register />}
                        />

                        <Route
                            path="*"
                            element={<Marketplace />}
                        />

                    </Routes>

                </BrowserRouter>

            </CartProvider>

        </AuthProvider>

    );

}


export default App;