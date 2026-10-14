import {Button as BaseButton} from "@base-ui/react/button"
import styles from "./knot-button.module.css"

/*
 *  Celtic knot: two wavy strands r = R ± A·sin(Nθ) crossing 2N times. The "over" strand is a
 *  redrawn piece with a header-coloured halo that cuts the strand beneath (same trick as the frame corners).
 *  Pass the icon as children and the label via aria-label.
 * */
const SIZE = 48
const CENTER = SIZE / 2
const RADIUS = 20.5
const AMPLITUDE = 2.2
const LOBES = 6
const OVER_HALF_ANGLE = 0.16 // radians on each side of a crossing drawn as the "over" piece

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

// At each crossing (sin = 0) the strands take turns on top, which makes the weave
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
