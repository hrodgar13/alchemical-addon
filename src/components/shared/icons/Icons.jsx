// Маленькі іконки для кнопок. Колір — currentColor, тож беруть колір тексту кнопки.
// aria-hidden: підпис дає aria-label самої кнопки

export function PencilIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M4 20h4L19 9l-4-4L4 16z" />
            <path d="M13.5 6.5l4 4" />
        </svg>
    )
}

export function CheckIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M5 12.5l4.5 4.5L19 7" />
        </svg>
    )
}

export function CloseIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
        >
            <path d="M6 6l12 12M18 6L6 18" />
        </svg>
    )
}

// Іконки хедера — трохи більші, під круглу кнопку з вузлом
const SUN_RAYS = Array.from({length: 8}, (_, i) => {
    const angle = (i * Math.PI) / 4
    const [cos, sin] = [Math.cos(angle), Math.sin(angle)]

    return `M${(12 + 7 * cos).toFixed(2)} ${(12 + 7 * sin).toFixed(2)}L${(12 + 9.5 * cos).toFixed(2)} ${(12 + 9.5 * sin).toFixed(2)}`
}).join("")

export function SunIcon() {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="4" />
            <path d={SUN_RAYS} />
        </svg>
    )
}

export function MoonIcon() {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M19.5 14.5A8 8 0 1 1 9.5 4.5a6.5 6.5 0 0 0 10 10z" />
        </svg>
    )
}

/*
 *  Біфрьост — палаючий веселковий міст між Мідгардом і Асгардом. За «Молодшою Еддою» він має три кольори,
 *  тож три дуги: кольори теми (небезпека, золото, синій), щоб міст жив разом зі світлою й темною темою.
 *  Вийти з застосунку = піти мостом геть з Мідгарду.
 * */
export function BifrostIcon() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
        >
            <path d="M3 18a9 9 0 0 1 18 0" stroke="var(--color-danger)" />
            <path d="M6 18a6 6 0 0 1 12 0" stroke="var(--color-outline-accent)" />
            <path d="M9 18a3 3 0 0 1 6 0" stroke="var(--color-outline)" />
            <path d="M1.5 20.5h21" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    )
}
