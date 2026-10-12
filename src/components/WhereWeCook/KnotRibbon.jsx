import {useId} from "react";

// Нордична стрічка: дві нитки, що переплітаються «через одну» (над-під), між двома краями.
// Візерунок повторюється, а не розтягується — тому стрічка тягнеться на будь-яку ширину.
// Колір — з CSS-властивості `color` (currentColor). Розриви на перетинах малюються кольором фону сторінки.
export default function KnotRibbon({className}) {
    const id = useId()
    const patternId = `${id}-knot`
    const clipId = `${id}-knot-clip`

    const strandA = "M 0 12 C 10 3, 10 3, 20 12 S 30 21, 40 12"
    const strandB = "M 0 12 C 10 21, 10 21, 20 12 S 30 3, 40 12"

    return (
        <svg className={className} height="24" aria-hidden="true">
            <defs>
                <clipPath id={clipId}>
                    <rect x="12" y="0" width="16" height="24"/>
                </clipPath>
                <pattern id={patternId} width="40" height="24" patternUnits="userSpaceOnUse">
                    {/* Краї стрічки */}
                    <line x1="0" y1="1" x2="40" y2="1" stroke="currentColor" strokeWidth="2"/>
                    <line x1="0" y1="23" x2="40" y2="23" stroke="currentColor" strokeWidth="2"/>

                    {/* Нитка A, поверх неї нитка B з «ореолом» кольору фону — B зверху на краях візерунка */}
                    <path d={strandA} fill="none" stroke="currentColor" strokeWidth="2.5"/>
                    <path d={strandB} fill="none" stroke="var(--color-bg)" strokeWidth="7"/>
                    <path d={strandB} fill="none" stroke="currentColor" strokeWidth="2.5"/>

                    {/* У середині візерунка нитка A знову зверху — так виходить переплетення «над-під» */}
                    <g clipPath={`url(#${clipId})`}>
                        <path d={strandA} fill="none" stroke="var(--color-bg)" strokeWidth="7"/>
                        <path d={strandA} fill="none" stroke="currentColor" strokeWidth="2.5"/>
                    </g>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`}/>
        </svg>
    )
}
