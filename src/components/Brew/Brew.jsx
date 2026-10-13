import {Button as BaseButton} from "@base-ui/react/button"
import {usePotionBrew} from "../../contexts/PotionBrewContext.jsx"
import styles from "./brew.module.css"

// Збереження зілля на сервері — лише тут. Після варки форма очищається (місце варки лишається)
export default function Brew() {
    const {canBrew, potion, brewPotion} = usePotionBrew()

    return (
        <div className={styles.Brew}>
            <BaseButton className={styles.Button} onClick={brewPotion} disabled={!canBrew}>
                {potion.isScorched ? "Записати згар" : "Зварити"}
            </BaseButton>
        </div>
    )
}
