// Алхімічні символи основ: ключ (зберігається в основі як `symbol`) → латинська назва, руни й форма.
// Окремий файл, бо його читають і BaseSymbol (малює), і форма основи (список для вибору),
// а файл компонента для Fast Refresh має експортувати лише компоненти.

export const BASE_SYMBOLS = {
    aqua: {
        name: "Aqua",
        rune: "ᚨᚲᚢᚨ",
        shape: <polygon points="15,10 105,10 60,88" />,
    },
    spiritus: {
        name: "Spiritus",
        rune: "ᛊᛈᛁᚱᛁᛏᚢᛊ",
        shape: (
            <>
                <polygon points="60,10 105,88 15,88" />
                <line x1="5" y1="66" x2="115" y2="66" />
            </>
        ),
    },
    olium: {
        name: "Olium",
        rune: "ᛟᛚᛁᚢᛗ",
        shape: <polygon points="60,10 105,88 15,88" />,
    },
    vinum: {
        name: "Vinum",
        rune: "ᚢᛁᚾᚢᛗ",
        shape: (
            <>
                <polygon points="15,10 105,10 60,88" />
                <line x1="5" y1="32" x2="115" y2="32" />
            </>
        ),
    },
}

// Для селекта у формі: {id, name, rune}
export const BASE_SYMBOL_OPTIONS = Object.entries(BASE_SYMBOLS).map(([id, {name, rune}]) => ({id, name, rune}))
