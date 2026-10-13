// Алхімічний символ вибраної основи з рунічним підписом.
// Невідома або не вибрана основа — заглушка: коло з написом ᚷᛁᚾᚾᚢᚾ.
// Колір — з CSS-властивості `color` батька (currentColor), тож працює в обох темах.

const SYMBOLS = {
    aqua: {
        rune: "ᚨᚲᚢᚨ",
        shape: <polygon points="15,10 105,10 60,88" />,
    },
    spiritus: {
        rune: "ᛊᛈᛁᚱᛁᛏᚢᛊ",
        shape: (
            <>
                <polygon points="60,10 105,88 15,88" />
                <line x1="5" y1="66" x2="115" y2="66" />
            </>
        ),
    },
    olium: {
        rune: "ᛟᛚᛁᚢᛗ",
        shape: <polygon points="60,10 105,88 15,88" />,
    },
    vinum: {
        rune: "ᚢᛁᚾᚢᛗ",
        shape: (
            <>
                <polygon points="15,10 105,10 60,88" />
                <line x1="5" y1="32" x2="115" y2="32" />
            </>
        ),
    },
}

const UNKNOWN_SYMBOL = {
    rune: "ᚷᛁᚾᚾᚢᚾ",
    shape: <circle cx="60" cy="49" r="39" />,
}

export default function BaseSymbol({base, className}) {
    const symbolKey = base?.symbol
    const symbol = SYMBOLS[symbolKey] ?? UNKNOWN_SYMBOL

    return (
        <svg
            // key змінюється разом із символом — SVG перемонтовується і CSS-анімація появи грає знову
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
