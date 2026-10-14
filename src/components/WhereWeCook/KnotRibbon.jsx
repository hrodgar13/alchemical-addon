import {useId} from "react"
import styles from "./knot-ribbon.module.css"

// Two strands woven over-under between two edges; the pattern repeats, so the ribbon spans any width.
// Gaps at crossings are drawn in the page background colour.
export default function KnotRibbon({className, text}) {
    const id = useId()
    const patternId = `${id}-knot`
    const clipId = `${id}-knot-clip`

    const strandA = "M 0 12 C 10 3, 10 3, 20 12 S 30 21, 40 12"
    const strandB = "M 0 12 C 10 21, 10 21, 20 12 S 30 3, 40 12"

    return (
        <div className={`${styles.Ribbon} ${className ?? ""}`} aria-hidden="true">
            <svg className={styles.Band} height="24">
                <defs>
                    <clipPath id={clipId}>
                        <rect x="12" y="0" width="16" height="24" />
                    </clipPath>
                    <pattern id={patternId} width="40" height="24" patternUnits="userSpaceOnUse">
                        {/* Ribbon edges */}
                        <line x1="0" y1="1" x2="40" y2="1" stroke="currentColor" strokeWidth="2" />
                        <line x1="0" y1="23" x2="40" y2="23" stroke="currentColor" strokeWidth="2" />

                        {/* Strand A, then strand B with a background-coloured halo: B is on top at the pattern edges */}
                        <path d={strandA} fill="none" stroke="currentColor" strokeWidth="2.5" />
                        <path d={strandB} fill="none" stroke="var(--color-bg)" strokeWidth="7" />
                        <path d={strandB} fill="none" stroke="currentColor" strokeWidth="2.5" />

                        {/* In the middle of the pattern strand A is on top again, giving the over-under weave */}
                        <g clipPath={`url(#${clipId})`}>
                            <path d={strandA} fill="none" stroke="var(--color-bg)" strokeWidth="7" />
                            <path d={strandA} fill="none" stroke="currentColor" strokeWidth="2.5" />
                        </g>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${patternId})`} />
            </svg>

            {text && <span className={styles.Text}>{text}</span>}
        </div>
    )
}
