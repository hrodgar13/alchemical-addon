import {useId} from "react"

/*
 *  Ring text in Elder Futhark: "We are all gonna become ingredients for something new"
 *  (TH → ᚦ, NG → ᛜ, ᛫ is the word separator).
 *  Triquetra: three arcs of radius 46 centred 27 from the symbol centre, running vertex to vertex;
 *  the three crossings are woven over-under.
 * */
const PHRASE = "ᚹᛖ᛫ᚨᚱᛖ᛫ᚨᛚᛚ᛫ᚷᛟᚾᚾᚨ᛫ᛒᛖᚲᛟᛗᛖ᛫ᛁᚾᚷᚱᛖᛞᛁᛖᚾᛏᛊ᛫ᚠᛟᚱ᛫ᛊᛟᛗᛖᚦᛁᛜ᛫ᚾᛖᚹ᛫"

const ARCS = [
    "M 46 26.56 A 46 46 0 0 0 -46 26.56",
    "M -46 26.56 A 46 46 0 0 0 0 -53.11",
    "M 0 -53.11 A 46 46 0 0 0 46 26.56",
]

// At each crossing a different arc passes on top, so the weave alternates over-under
const CROSSINGS = [
    {x: 22.62, y: -13.06, over: 1},
    {x: 0, y: 26.11, over: 2},
    {x: -22.62, y: -13.06, over: 0},
]

const RING_RADIUS = 84
const RING_PATH = `M 0 ${-RING_RADIUS} A ${RING_RADIUS} ${RING_RADIUS} 0 1 1 0 ${RING_RADIUS} A ${RING_RADIUS} ${RING_RADIUS} 0 1 1 0 ${-RING_RADIUS}`
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

export default function TriquetraSymbol({className, style}) {
    const id = useId()
    const ringId = `${id}-ring`

    return (
        <svg className={className} style={style} viewBox="-100 -100 200 200" aria-hidden="true">
            <defs>
                <path id={ringId} d={RING_PATH} />
                {CROSSINGS.map((crossing, index) => (
                    <clipPath key={index} id={`${id}-crossing-${index}`}>
                        <circle cx={crossing.x} cy={crossing.y} r="8" />
                    </clipPath>
                ))}
            </defs>

            <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
                {ARCS.map(d => (
                    <path key={d} d={d} />
                ))}

                {/* Top arc at a crossing: a background-coloured halo hides the arc below, then the arc itself */}
                {CROSSINGS.map((crossing, index) => (
                    <g key={index} clipPath={`url(#${id}-crossing-${index})`}>
                        <path d={ARCS[crossing.over]} stroke="var(--color-bg)" strokeWidth="11" />
                        <path d={ARCS[crossing.over]} />
                    </g>
                ))}
            </g>

            <text fill="currentColor" fontSize="15" dominantBaseline="middle">
                <textPath href={`#${ringId}`} textLength={RING_LENGTH} lengthAdjust="spacing">
                    {PHRASE}
                </textPath>
            </text>
        </svg>
    )
}
