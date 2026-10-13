// Стрілка вниз (контур). Колір — проп `color` або (за замовчуванням) CSS-властивість `color` батька через currentColor
export default function ArrowDown({color = "currentColor", className}) {
    return (
        <svg className={className} viewBox="0 0 100 120" fill="none" aria-hidden="true">
            <polygon
                points="30,6 70,6 70,58 94,58 50,114 6,58 30,58"
                fill="none"
                stroke={color}
                strokeWidth="6"
                strokeLinejoin="round"
            />
        </svg>
    )
}
