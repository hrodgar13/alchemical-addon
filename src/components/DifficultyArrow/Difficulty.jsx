import styles from './difficulty-arrow.module.css'
import ArrowDown from './ArrowDown.jsx'
import Cross from './Cross.jsx'
import {usePotionBrew} from "../../contexts/PotionBrewContext.jsx";


export default function Difficulty({arrowColor}) {
    const {difficulty, message} = usePotionBrew()


    return <div className={styles.DifficultyArrow}>
        <div className={styles.Arrow} role="img" aria-label={`Складність ${difficulty}`}>
            <ArrowDown className={styles.ArrowIcon} color={arrowColor}/>
            {message && <Cross className={styles.Cross} color={arrowColor}/>}
            <span className={styles.Value} aria-hidden="true">{difficulty}</span>
        </div>

        {message && <p className={styles.Message}>{message}</p>}
    </div>
}
