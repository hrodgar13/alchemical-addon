import LoginForm from "../../components/LoginForm/LoginForm.jsx"

import styles from "./login.module.css"

export default function Login() {
    return (
        <main className={styles.LoginPage}>
            <LoginForm />
        </main>
    )
}
