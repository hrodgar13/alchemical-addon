import {Navigate} from "react-router"
import {useAuth} from "../hooks/useAuth.js"
import SpinnerFullPage from "./SpinnerFullPage/SpinnerFullPage.jsx"

/*
 *  Wait for isAuthReady: until Firebase restores the session user is null and would be bounced to /login.
 *  Redirect during render, not in useEffect, so the page never paints; replace keeps "Back" from looping.
 * */
export default function ProtectedRoute({children}) {
    const {isAuthenticated, isAuthReady} = useAuth()

    if (!isAuthReady) return <SpinnerFullPage />

    if (!isAuthenticated) return <Navigate to="/login" replace />

    return children
}
