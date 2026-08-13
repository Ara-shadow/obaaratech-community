import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Marketplace from "./pages/Marketplace";

import ProductDetails from "./pages/ProductDetails";

import CreateListing from "./pages/CreateListing";

import {
    AuthProvider
} from "./context/AuthContext";

import Login from "./pages/Login";

import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";

import MyListings from "./pages/MyListings";

import Account from "./pages/Account";

import Profile from "./pages/Profile";

import Favourites from "./pages/Favourites";

import Cart from "./pages/Cart";

function App() {

    return (

        <AuthProvider>

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
        path="*"
        element={<Marketplace />}
    />

<Route
    path="/login"
    element={<Login />}
/>

<Route
    path="/register"
    element={<Register />}
/>
        </Routes>

    </BrowserRouter>

</AuthProvider>



    );

}


export default App;