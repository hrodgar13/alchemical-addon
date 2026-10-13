import {Button as BaseButton} from "@base-ui/react/button"
import styles from "./knot-button.module.css"

/*
 *  Кругла кнопка-іконка, обплетена кельтським вузлом.
 *  Вузол — дві хвилясті нитки по колу (r = R ± A·sin(Nθ)), що перетинаються 2N разів
 *  і по черзі проходять одна над одною. «Над» — це повторно намальований шматочок верхньої нитки
 *  з ореолом кольору хедера, який розриває нижню нитку (та сама техніка, що й у кутах рамки).
 *  Іконку передаємо children; підпис — через aria-label, бо тексту в кнопці немає.
 * */
const SIZE = 48
const CENTER = SIZE / 2
const RADIUS = 20.5
const AMPLITUDE = 2.2
const LOBES = 6
const OVER_HALF_ANGLE = 0.16 // на скільки радіан у кожен бік від перетину малюємо «верхній» шматок

function point(angle, strand) {
    const radius = RADIUS + strand * AMPLITUDE * Math.sin(LOBES * angle)
    const x = CENTER + radius * Math.cos(angle)
    const y = CENTER + radius * Math.sin(angle)

    return `${x.toFixed(2)} ${y.toFixed(2)}`
}

function strandPath(strand, from = 0, to = 2 * Math.PI, steps = 144) {
    const points = Array.from({length: steps + 1}, (_, i) => point(from + ((to - from) * i) / steps, strand))

    return `M ${points.join(" L ")}`
}

const STRANDS = [strandPath(1), strandPath(-1)]

// На кожному перетині (sin = 0) зверху по черзі то одна, то друга нитка — так виходить плетіння
const CROSSINGS = Array.from({length: LOBES * 2}, (_, k) => {
    const angle = (k * Math.PI) / LOBES
    const strand = k % 2 === 0 ? 1 : -1

    return strandPath(strand, angle - OVER_HALF_ANGLE, angle + OVER_HALF_ANGLE, 8)
})

export default function KnotButton({children, ...props}) {
    return (
        <BaseButton {...props} className={styles.KnotButton}>
            <svg className={styles.Knot} viewBox={`0 0 ${SIZE} ${SIZE}`} fill="none" aria-hidden="true">
                {STRANDS.map(d => (
                    <path key={d} d={d} stroke="currentColor" strokeWidth="1.4" />
                ))}
                {CROSSINGS.map(d => (
                    <g key={d}>
                        <path d={d} stroke="var(--color-header-bg)" strokeWidth="4" />
                        <path d={d} stroke="currentColor" strokeWidth="1.4" />
                    </g>
                ))}
            </svg>
            <span className={styles.Icon}>{children}</span>
        </BaseButton>
    )
}
