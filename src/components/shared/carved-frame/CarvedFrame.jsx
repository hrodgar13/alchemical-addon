import {useId} from "react"
import styles from "./carved-frame.module.css"

/*
 *  Різьблена рамка блоку зілля: дві паралельні лінії з косими розрізами,
 *  у кутах лінії разом утворюють стрічку, що зав'язується в петлю «над-під».
 *  Напис ᚨᛚᚢ (alu) — рунічне «магічне» слово з амулетів; одне з тлумачень — ель, ритуальний напій.
 *
 *  Розрізи — не пробіли, а скошені кінці відрізків (паралелограми), тож вони прозорі на будь-якому фоні.
 *  Плитка візерунка довга, а розрізи на «непарних» позиціях — щоб око не помічало повтору.
 *  Колір — з CSS-властивості `color` (currentColor).
 * */

// Лінії стрічки: зовнішня й внутрішня, обидві по 1.5px. Кут і краї використовують ті самі відступи
const OUTER_LINE = {from: 0.25, to: 1.75}
const INNER_LINE = {from: 4.75, to: 6.25}
const BAND = 6.5

const TILE = 190
const SLANT = 3 // наскільки скошений розріз
const GAP = 3 // ширина розрізу
const OUTER_CUTS = [37, 131]
const INNER_CUTS = [84, 168]

// Відрізки лінії між розрізами; крайні виходять за плитку, щоб сусідні плитки зливалися в одну лінію
function cutSegments(cuts, {from, to}) {
    const edges = [-SLANT - 1, ...cuts.flatMap(cut => [cut, cut + GAP]), TILE + 1]
    const segments = []

    for (let i = 0; i < edges.length; i += 2) {
        const [start, end] = [edges[i], edges[i + 1]]
        segments.push(`${start + SLANT},${from} ${end + SLANT},${from} ${end},${to} ${start},${to}`)
    }

    return segments
}

const OUTER_SEGMENTS = cutSegments(OUTER_CUTS, OUTER_LINE)
const INNER_SEGMENTS = cutSegments(INNER_CUTS, INNER_LINE)

export default function CarvedFrame() {
    // Унікальні id для <pattern> — щоб не конфліктували, якщо рамка буде на сторінці не одна
    const id = useId()
    const horizontalPatternId = `${id}-carved-h`
    const verticalPatternId = `${id}-carved-v`

    return (
        <div className={styles.Frame} aria-hidden="true">
            <KnotCorner className={`${styles.Corner} ${styles.TopLeft}`} />
            <KnotCorner className={`${styles.Corner} ${styles.TopRight}`} />
            <KnotCorner className={`${styles.Corner} ${styles.BottomLeft}`} />
            <KnotCorner className={`${styles.Corner} ${styles.BottomRight}`} />

            <svg className={`${styles.EdgeHorizontal} ${styles.Top}`}>
                <defs>
                    <pattern id={horizontalPatternId} width={TILE} height={BAND} patternUnits="userSpaceOnUse">
                        <CarvedLines />
                    </pattern>
                    {/* Той самий візерунок, але x і y поміняні місцями — вертикальна сторона */}
                    <pattern
                        id={verticalPatternId}
                        width={TILE}
                        height={BAND}
                        patternUnits="userSpaceOnUse"
                        patternTransform="matrix(0 1 1 0 0 0)"
                    >
                        <CarvedLines />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${horizontalPatternId})`} />
            </svg>
            <svg className={`${styles.EdgeHorizontal} ${styles.Bottom}`}>
                <rect width="100%" height="100%" fill={`url(#${horizontalPatternId})`} />
            </svg>
            <svg className={`${styles.EdgeVertical} ${styles.Left}`}>
                <rect width="100%" height="100%" fill={`url(#${verticalPatternId})`} />
            </svg>
            <svg className={`${styles.EdgeVertical} ${styles.Right}`}>
                <rect width="100%" height="100%" fill={`url(#${verticalPatternId})`} />
            </svg>

            <span className={styles.Title}>ᚨᛚᚢ</span>
        </div>
    )
}

// Вертикальний розділювач усередині блоку: одна лінія з розрізами, як у рамки
const DIVIDER_SEGMENTS = cutSegments([61, 149], {from: 3.25, to: 4.75})

export function CarvedDivider({className}) {
    const patternId = `${useId()}-carved-divider`

    return (
        <svg className={className} width="8" aria-hidden="true">
            <defs>
                <pattern
                    id={patternId}
                    width={TILE}
                    height="8"
                    patternUnits="userSpaceOnUse"
                    patternTransform="matrix(0 1 1 0 0 0)"
                >
                    {DIVIDER_SEGMENTS.map(points => (
                        <polygon key={points} points={points} fill="currentColor" />
                    ))}
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
    )
}

function CarvedLines() {
    return (
        <g fill="currentColor">
            {OUTER_SEGMENTS.map(points => (
                <polygon key={points} points={points} />
            ))}
            {INNER_SEGMENTS.map(points => (
                <polygon key={points} points={points} />
            ))}
        </g>
    )
}

/*
 *  Лівий верхній кут; інші — його дзеркальні відображення через CSS.
 *  Стрічка (обидві лінії разом) приходить згори, закручується в петлю і йде вниз,
 *  проходячи над собою. Стрічка = широка лінія кольору + вужча лінія кольору фону посередині.
 * */
const CORNER = 32
const RIBBON_CENTER = (OUTER_LINE.from + INNER_LINE.to) / 2
const RIBBON_WIDTH = INNER_LINE.to - OUTER_LINE.from
const RIBBON_GAP = INNER_LINE.from - OUTER_LINE.to
// Петля симетрична відносно діагоналі кута: перша половина — до найдальшої точки петлі, друга — назад
const C = RIBBON_CENTER
const LOOP_IN = `M ${CORNER} ${C} H 26 Q 13 ${C} 13 19 Q 13 27 20 27 Q 27 27 27 20`
const LOOP_OUT = `M 27 20 Q 27 13 19 13 Q ${C} 13 ${C} 26 V ${CORNER}`
// Точка, де стрічка перетинає сама себе
const CROSSING = {x: 13.5, y: 13.5, r: 7}

function KnotCorner({className}) {
    const clipId = `${useId()}-knot-clip`

    return (
        <svg className={className} viewBox={`0 0 ${CORNER} ${CORNER}`} fill="none">
            <defs>
                <clipPath id={clipId}>
                    <circle cx={CROSSING.x} cy={CROSSING.y} r={CROSSING.r} />
                </clipPath>
            </defs>

            <Ribbon d={LOOP_IN} />
            <Ribbon d={LOOP_OUT} />

            {/* На перетині друга половина стрічки проходить зверху: малюємо її ще раз з «ореолом» фону */}
            <g clipPath={`url(#${clipId})`}>
                <path d={LOOP_OUT} stroke="var(--color-bg)" strokeWidth={RIBBON_WIDTH + 3} />
                <Ribbon d={LOOP_OUT} />
            </g>
        </svg>
    )
}

function Ribbon({d}) {
    return (
        <>
            <path d={d} stroke="currentColor" strokeWidth={RIBBON_WIDTH} />
            <path d={d} stroke="var(--color-bg)" strokeWidth={RIBBON_GAP} />
        </>
    )
}
