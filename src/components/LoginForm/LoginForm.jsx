import {useActionState} from "react"
import {Navigate} from "react-router"
import {useAuth} from "../../hooks/useAuth.js"
import Button from "../shared/button/Button.jsx"
import CarvedFrame from "../shared/carved-frame/CarvedFrame.jsx"
import Spinner from "../shared/spinner/Spinner.jsx"

import styles from "./login-form.module.css"

// The user closed the Google popup or opened another one: not an error, show nothing
const SILENT_ERROR_CODES = ["auth/popup-closed-by-user", "auth/cancelled-popup-request"]

const ERROR_MESSAGES = {
    "auth/popup-blocked": "Браузер заблокував вікно входу. Дозвольте спливні вікна для цього сайту.",
    "auth/unauthorized-domain": "Вхід з цієї адреси не дозволено в налаштуваннях Firebase.",
    "auth/network-request-failed": "Немає з'єднання з мережею. Спробуйте ще раз.",
}

function toErrorMessage(err) {
    if (SILENT_ERROR_CODES.includes(err.code)) return null

    return ERROR_MESSAGES[err.code] ?? "Не вдалося увійти. Спробуйте ще раз."
}

export default function LoginForm() {
    const {isAuthenticated, isAuthReady, login} = useAuth()

    // No fields: the action only opens the Google popup, and isPending disables the button while it is open
    const [error, formAction, isPending] = useActionState(async () => {
        try {
            await login()
            return null
        } catch (err) {
            return toErrorMessage(err)
        }
    }, null)

    // Until the saved session is known, don't show the sign-in button to someone already signed in
    if (!isAuthReady) return <Spinner />

    if (isAuthenticated) return <Navigate to="/" replace />

    return (
        <form className={styles.Form} action={formAction}>
            <CarvedFrame />

            <h2 className={styles.Title}>Вхід до майстерні</h2>
            <p className={styles.Hint}>Перший вхід створить вашу майстерню — окремо для кожного акаунта Google.</p>

            <p className={styles.Error} role="alert">
                {error}
            </p>

            <Button type="submit" disabled={isPending}>
                {isPending ? "Чекаємо на Google..." : "Увійти через Google"}
            </Button>
        </form>
    )
}
