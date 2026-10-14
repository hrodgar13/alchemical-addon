// Same viewBox as ArrowDown, so the two overlay exactly
export default function Cross({color = "currentColor", className}) {
    return (
        <svg className={className} viewBox="0 0 100 120" fill="none" aria-hidden="true">
            <line x1="10" y1="10" x2="90" y2="110" stroke={color} strokeWidth="8" strokeLinecap="round" />
            <line x1="90" y1="10" x2="10" y2="110" stroke={color} strokeWidth="8" strokeLinecap="round" />
        </svg>
    )
}
