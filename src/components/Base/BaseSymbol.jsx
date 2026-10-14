import {BASE_SYMBOLS} from "./base-symbols.jsx"

const UNKNOWN_SYMBOL = {
    rune: "ᚷᛁᚾᚾᚢᚾ",
    shape: <circle cx="60" cy="49" r="39" />,
}

export default function BaseSymbol({base, className}) {
    const symbolKey = base?.symbol
    const symbol = BASE_SYMBOLS[symbolKey] ?? UNKNOWN_SYMBOL

    return (
        <svg
            // key changes with the symbol so the SVG remounts and the appear animation replays
            key={symbolKey ?? "unknown"}
            className={className}
            viewBox="0 0 120 140"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {symbol.shape}
            <text
                x="60"
                y="128"
                fill="currentColor"
                stroke="none"
                fontFamily="'Noto Sans Runic', 'Segoe UI Historic', sans-serif"
                fontSize="18"
                letterSpacing="2"
                textAnchor="middle"
            >
                {symbol.rune}
            </text>
        </svg>
    )
}
