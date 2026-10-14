import {Navigate} from "react-router"
import {useAuth} from "../hooks/useAuth.js"
import SpinnerFullPage from "./SpinnerFullPage/SpinnerFullPage.jsx"

/*
 *  Поки Firebase відновлює сесію після перезавантаження, user ще null — без цієї перевірки
 *  залогіненого користувача на мить викидало б на /login. Тому спершу чекаємо isAuthReady.
 *
 *  Редирект прямо під час рендеру, а не в useEffect: захищена сторінка не встигає відмалюватись,
 *  а replace замінює запис в історії — «Назад» не поверне на сторінку, що знову перекине на вхід.
 * */
export default function ProtectedRoute({children}) {
    const {isAuthenticated, isAuthReady} = useAuth()

    if (!isAuthReady) return <SpinnerFullPage />

    if (!isAuthenticated) return <Navigate to="/login" replace />

    return children
}
