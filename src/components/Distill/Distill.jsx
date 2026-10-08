import styles from './distill.module.css'
import Checkbox from "../shared/checkbox/Checkbox.jsx";
import {usePotionBrew} from "../../contexts/PotionBrewContext.jsx";
import {STATION} from "../../static/static.js";

export default function Distill() {
    const {distill, whereWeCook, setDistill} = usePotionBrew()

    return <div className={styles.Distill}>
        <h2>Дистилюємо?</h2>
        <Checkbox
            checked={distill}
            onCheckedChange={setDistill}
            disabled={whereWeCook !== STATION}
        />
    </div>
}
