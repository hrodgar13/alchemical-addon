import {useEffect, useState} from "react";

function getInitialIsDark() {
    const storedTheme = localStorage.getItem('theme')

    if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme === 'dark'
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function useTheme() {
    const [isDark, setIsDark] = useState(getInitialIsDark)

    function toggleTheme() {
        setIsDark(isDark => !isDark)
    }

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark)
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
    }, [isDark]);

    return {isDark, toggleTheme}
}
