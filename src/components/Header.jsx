import {useTheme} from "../hooks/useTheme.js";

function Header() {
    const {isDark, toggleTheme} = useTheme()

    return (
        <header className="app-header">
            <h1 className="logo-text">Алхімічний Аддон</h1>
            <button
                type="button"
                onClick={toggleTheme}
                className="theme-mode-btn"
                aria-label={isDark ? "Увімкнути світлу тему" : "Увімкнути темну тему"}
            >
                {isDark ? '🌙' : '☀️'}
            </button>
        </header>
    )
}

export default Header
