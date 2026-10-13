// Маленькі іконки для кнопок. Колір — currentColor, тож беруть колір тексту кнопки.
// aria-hidden: підпис дає aria-label самої кнопки

export function PencilIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 20h4L19 9l-4-4L4 16z"/>
            <path d="M13.5 6.5l4 4"/>
        </svg>
    )
}

export function CheckIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7"/>
        </svg>
    )
}

export function CloseIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
             strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18"/>
        </svg>
    )
}
