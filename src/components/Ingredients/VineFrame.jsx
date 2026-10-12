import {useId} from "react";
import styles from './vine-frame.module.css'

// Рамка з лози навколо блоку інгредієнтів з написом ᛦᚷᚷᛞᚱᚨᛋᛁᛚ угорі.
// Кути — фіксованого розміру (не деформуються), краї — візерунок, що повторюється (не розтягується),
// тому рамка підлаштовується під будь-який розмір блоку.
// Колір — з CSS-властивості `color` (currentColor), тож працює в обох темах.
export default function VineFrame() {
    // Унікальні id для <pattern> — щоб не конфліктували, якщо рамка буде на сторінці не одна
    const id = useId()
    const horizontalPatternId = `${id}-vine-h`
    const verticalPatternId = `${id}-vine-v`

    return (
        <div className={styles.Frame} aria-hidden="true">
            <VineCorner className={`${styles.Corner} ${styles.TopLeft}`}/>
            <VineCorner className={`${styles.Corner} ${styles.TopRight}`}/>
            <VineCorner className={`${styles.Corner} ${styles.BottomLeft}`}/>
            <VineCorner className={`${styles.Corner} ${styles.BottomRight}`}/>

            <svg className={`${styles.EdgeHorizontal} ${styles.Top}`}>
                <defs>
                    <pattern id={horizontalPatternId} width="48" height="12" patternUnits="userSpaceOnUse">
                        <path d="M 0 6 Q 12 0 24 6 T 48 6" fill="none" stroke="currentColor" strokeWidth="2.5"/>
                        <path d="M 24 6 q 4 -6 10 -5 q -2 6 -10 5 Z" fill="currentColor"/>
                    </pattern>
                    <pattern id={verticalPatternId} width="12" height="48" patternUnits="userSpaceOnUse">
                        <path d="M 6 0 Q 0 12 6 24 T 6 48" fill="none" stroke="currentColor" strokeWidth="2.5"/>
                        <path d="M 6 24 q -6 4 -5 10 q 6 -2 5 -10 Z" fill="currentColor"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${horizontalPatternId})`}/>
            </svg>
            <svg className={`${styles.EdgeHorizontal} ${styles.Bottom}`}>
                <rect width="100%" height="100%" fill={`url(#${horizontalPatternId})`}/>
            </svg>
            <svg className={`${styles.EdgeVertical} ${styles.Left}`}>
                <rect width="100%" height="100%" fill={`url(#${verticalPatternId})`}/>
            </svg>
            <svg className={`${styles.EdgeVertical} ${styles.Right}`}>
                <rect width="100%" height="100%" fill={`url(#${verticalPatternId})`}/>
            </svg>

            <span className={styles.Title}>ᛦᚷᚷᛞᚱᚨᛋᛁᛚ</span>
        </div>
    )
}

// Лівий верхній кут; інші кути — його дзеркальні відображення через CSS
function VineCorner({className}) {
    return (
        <svg
            className={className}
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* Основна лоза: вгору по лівому краю, заокруглення в куті, далі по верхньому */}
            <path d="M 6 64 L 6 30 Q 6 6 30 6 L 64 6"/>

            {/* Вусик-завиток, що росте з кута всередину */}
            <path d="M 13 13 q 6 6 13 4 q 5 -2 2 -7 q -3 -3 -6 0"/>

            {/* Листки */}
            <path d="M 6 46 q 10 -2 12 -10 q -10 0 -12 10 Z" fill="currentColor" stroke="none"/>
            <path d="M 46 6 q -2 10 -10 12 q 0 -10 10 -12 Z" fill="currentColor" stroke="none"/>
            <path d="M 9 24 q 7 1 10 -4 q -7 -2 -10 4 Z" fill="currentColor" stroke="none"/>
        </svg>
    )
}
