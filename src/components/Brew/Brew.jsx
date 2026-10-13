import {useState} from "react"
import {Button as BaseButton} from "@base-ui/react/button"
import {usePotionBrew} from "../../contexts/PotionBrewContext.jsx"
import TriquetraSymbol from "./TriquetraSymbol.jsx"
import styles from "./brew.module.css"

// Скільки «кроків циклу» робить трикветр за одну варку: 120° — і символ знову виглядає так само
const TURN_DEGREES = 120

// Збереження зілля на сервері — лише тут. Після варки форма очищається (місце варки лишається)
export default function Brew() {
    const {canBrew, potion, brewPotion} = usePotionBrew()
    // Кількість зварених зіль за сесію — від неї залежить поворот трикветра
    const [turns, setTurns] = useState(0)

    async function handleBrew() {
        await brewPotion()
        setTurns(currentTurns => currentTurns + 1)
    }

    return (
        <div className={styles.Brew}>
            <TriquetraSymbol className={styles.Symbol} style={{rotate: `${turns * TURN_DEGREES}deg`}} />
            <BaseButton className={styles.Button} onClick={handleBrew} disabled={!canBrew}>
                {potion.isScorched ? "Записати згар" : "Зварити"}
            </BaseButton>
        </div>
    )
}
