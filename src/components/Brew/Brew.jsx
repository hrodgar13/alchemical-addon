import {useState} from "react"
import {Button as BaseButton} from "@base-ui/react/button"
import {usePotionBrew} from "../../hooks/usePotionBrew.js"
import TriquetraSymbol from "./TriquetraSymbol.jsx"
import styles from "./brew.module.css"

// The triquetra has threefold symmetry, so a 120° turn per brew leaves it looking the same
const TURN_DEGREES = 120

// The only place a potion is saved. After brewing the recipe is cleared (the brewing place stays)
export default function Brew() {
    const {canBrew, potion, brewPotion} = usePotionBrew()
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
