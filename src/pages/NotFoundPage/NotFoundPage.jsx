import {Link} from "react-router"

import styles from "./not-found-page.module.css"

// English phrases written in Elder Futhark
const TITLE_RUNES = "ᛚᛟᛟᚲᛊ᛫ᛚᛁᚲᛖ᛫ᛟᚾᛚᛁ᛫ᚷᛁᚾᚾᚢᛜᚨᚷᚨᛈ᛫ᛁᛊ᛫ᚦᛖᚱᛖ"
const BACK_RUNES = "ᛒᚨᚲ᛫ᛏᛟ᛫ᛗᛁᛞᚷᚨᚱᛞ"

/*
 *  Runes are aria-hidden (a screen reader would read gibberish); the translation is the accessible name.
 *  A <Link>, not a navigate button: it's navigation, so "open in new tab" works.
 * */
export default function NotFoundPage() {
    return (
        <main className={styles.NotFoundPage}>
            <h1 className={styles.Title}>
                <span className={styles.TitleRunes} aria-hidden="true">
                    {TITLE_RUNES}
                </span>
                <span className={styles.Translation}>Схоже, тут лише нічого</span>
            </h1>

            <Link to="/" className={styles.Back}>
                <span className={styles.BackRunes} aria-hidden="true">
                    {BACK_RUNES}
                </span>
                <span>Назад до Мідгарду</span>
            </Link>
        </main>
    )
}
