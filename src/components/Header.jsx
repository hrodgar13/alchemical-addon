import {useTheme} from "../hooks/useTheme.js"
import {useAuth} from "../hooks/useAuth.js"
import KnotButton from "./shared/knot-button/KnotButton.jsx"
import {BifrostIcon, MoonIcon, SunIcon} from "./shared/icons/Icons.jsx"

function Header() {
    const {isDark, toggleTheme} = useTheme()
    const {isAuthenticated, logout} = useAuth()

    return (
        <header className="app-header">
            <h1 className="logo-text">Алхімічний Аддон</h1>
            <div className="header-actions">
                {isAuthenticated && (
                    <KnotButton onClick={logout} aria-label="Вийти" title="Вийти — мостом Біфрьост">
                        <BifrostIcon />
                    </KnotButton>
                )}
                <KnotButton
                    onClick={toggleTheme}
                    aria-label={isDark ? "Увімкнути світлу тему" : "Увімкнути темну тему"}
                    title={isDark ? "Світла тема" : "Темна тема"}
                >
                    {isDark ? <MoonIcon /> : <SunIcon />}
                </KnotButton>
            </div>
        </header>
    )
}

export default Header
