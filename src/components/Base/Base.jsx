import {usePotionComponents} from "../../contexts/PotionComponentsContext.jsx";
import Select from "../shared/select/Select.jsx";
import styles from './base.module.css'

export default function Base() {
    const {bases} = usePotionComponents()

    function handleOnChange(base) {
        console.log(base)
    }

    return <div className={styles.Base}>
        <h2>Оберіть Основу</h2>
        <Select items={bases} searchKeys={['name', 'alchemicalWord']} additionalDisplayKeys={['alchemicalWord']} onSelectChange={handleOnChange}/>
    </div>
}
