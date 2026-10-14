export default function RetortSymbol({className}) {
    return (
        <svg
            className={className}
            viewBox="12 42 172 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {/* Flask: circle arc clockwise from the top to where the neck's lower edge joins */}
            <path d="M 140 50 A 38 38 0 1 1 109 66" />

            {/* Neck: two straight edges converging slightly toward the spout */}
            <line x1="140" y1="50" x2="24" y2="78" />
            <line x1="109" y1="66" x2="30" y2="93" />

            {/* Spout opening */}
            <ellipse cx="27" cy="85.5" rx="3.5" ry="8" transform="rotate(18 27 85.5)" />

            {/* Liquid: wavy surface filled to the bottom */}
            <path
                d="M 104 100 Q 122 95 140 100 T 176 100 A 38 38 0 0 1 104 100 Z"
                fill="currentColor"
                fillOpacity="0.35"
            />

            {/* Vapour */}
            <g strokeWidth="3">
                <path d="M 128 92 q -4 -5 0 -10 t 0 -10" />
                <path d="M 140 90 q -4 -5 0 -10 t 0 -10 t 0 -8" />
                <path d="M 152 92 q -4 -5 0 -10 t 0 -10" />
            </g>

            {/* Drip from the spout */}
            <path
                d="M 27 100 C 27 100 20 109 20 113 A 7 7 0 0 0 34 113 C 34 109 27 100 27 100 Z"
                fill="currentColor"
                stroke="none"
            />
        </svg>
    )
}
