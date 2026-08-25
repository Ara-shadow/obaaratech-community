import {
    Navigate,
    useLocation
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";


interface Props {

    children: React.ReactNode;

}


export default function ProtectedRoute({

    children

}: Props) {

    const {
        isAuthenticated,
        loading
    } = useAuth();


    const location =
        useLocation();


    // =====================================================
    // AUTHENTICATION IS STILL BEING RESTORED
    // =====================================================

    if (loading) {

        return (

            <div className="protected-route-loading">

                Loading...

            </div>

        );

    }


    // =====================================================
    // USER IS NOT AUTHENTICATED
    // =====================================================

    if (!isAuthenticated) {

        return (

            <Navigate
                to="/login"
                replace
                state={{
                    from:
                        location.pathname +
                        location.search +
                        location.hash
                }}
            />

        );

    }


    // =====================================================
    // USER IS AUTHENTICATED
    // =====================================================

    return children;

}