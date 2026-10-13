import {Navigate} from "react-router"
import {useAuth} from "../hooks/useAuth.js"

/*
 *  Редирект прямо під час рендеру, а не в useEffect: захищена сторінка не встигає відмалюватись,
 *  а replace замінює запис в історії — «Назад» не поверне на сторінку, що знову перекине на вхід.
 * */
export default function ProtectedRoute({children}) {
    const {isAuthenticated} = useAuth()

    if (!isAuthenticated) return <Navigate to="/login" replace />

    return children
}
