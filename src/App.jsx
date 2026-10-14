import Header from "./components/Header.jsx"
import {BrowserRouter, Route, Routes} from "react-router"
import {lazy, Suspense} from "react"
import {AuthProvider} from "./contexts/auth/AuthContext.jsx"
import ProtectedRoute from "./pages/ProtectedRoute.jsx"
import SpinnerFullPage from "./pages/SpinnerFullPage/SpinnerFullPage.jsx"
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx"

const AlchemicalTable = lazy(() => import("./pages/AlchemicalTable.jsx"))
const Login = lazy(() => import("./pages/Login/Login.jsx"))

// Router is outermost so the header can use <Link> and useNavigate
function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="app">
                    <Header />
                    <Suspense fallback={<SpinnerFullPage />}>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <AlchemicalTable />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/login" element={<Login />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </Suspense>
                </div>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
