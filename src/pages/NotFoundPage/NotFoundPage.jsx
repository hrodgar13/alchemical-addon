import {Link} from "react-router"

import styles from "./not-found-page.module.css"

// Англійська фраза, записана старшим футарком (як напис навколо трикветри)
const TITLE_RUNES = "ᛚᛟᛟᚲᛊ᛫ᛚᛁᚲᛖ᛫ᛟᚾᛚᛁ᛫ᚷᛁᚾᚾᚢᛜᚨᚷᚨᛈ᛫ᛁᛊ᛫ᚦᛖᚱᛖ"
const BACK_RUNES = "ᛒᚨᚲ᛫ᛏᛟ᛫ᛗᛁᛞᚷᚨᚱᛞ"

/*
 *  Руни — aria-hidden: скрінрідер прочитав би їх як набір незрозумілих символів.
 *  Доступна назва заголовка й посилання — переклад під рунами.
 *  На «/» веде <Link>, а не кнопка з navigate: це перехід, а не дія — так працює і «відкрити в новій вкладці».
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
