import {useActionState} from "react"
import {Navigate} from "react-router"
import {useAuth} from "../../hooks/useAuth.js"
import Button from "../shared/button/Button.jsx"
import Input from "../shared/input/Input.jsx"
import CarvedFrame from "../shared/carved-frame/CarvedFrame.jsx"

import styles from "./login-form.module.css"

/*
 *  React 19 після завершення action скидає неконтрольовану форму до defaultValue.
 *  Тому введений логін повертаємо в стані action і підставляємо назад — при помилці він не зникне.
 *  Пароль навмисно не повертаємо.
 * */
const initialState = {error: null, login: "Hrodgar13"}

export default function LoginForm() {
    const {isAuthenticated, login} = useAuth()

    const [{error, login: enteredLogin}, formAction, isPending] = useActionState(async (previousState, formData) => {
        const loginField = formData.get("login")
        const password = formData.get("password")

        if (!loginField || !password) return {error: "Login and password are required", login: loginField}

        try {
            await login(loginField, password)
            return {error: null, login: loginField}
        } catch (err) {
            return {error: err.message || "Invalid credentials", login: loginField}
        }
    }, initialState)

    // Вже увійшли (або щойно увійшли) — одразу на головну, без useEffect
    if (isAuthenticated) return <Navigate to="/" replace />

    return (
        <form className={styles.Form} action={formAction}>
            <CarvedFrame />

            <h2 className={styles.Title}>Вхід до майстерні</h2>

            <Input label="Login" name="login" defaultValue={enteredLogin} autoComplete="username" />
            <Input
                label="Password"
                type="password"
                name="password"
                defaultValue="qwerty123!"
                autoComplete="current-password"
            />

            <p className={styles.Error} role="alert">
                {error}
            </p>

            <Button type="submit" disabled={isPending}>
                {isPending ? "Logging in..." : "Login"}
            </Button>
        </form>
    )
}
