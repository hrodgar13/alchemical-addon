import {usePotionComponents} from "../../contexts/PotionComponentsContext.jsx";
import Select from "../shared/select/Select.jsx";
import styles from './base.module.css'
import {usePotionBrew} from "../../contexts/PotionBrewContext.jsx";

export default function Base() {
    const {bases} = usePotionComponents()
    const {base, setBase} = usePotionBrew()

    function handleOnChange(newBase) {
        setBase(newBase)
    }

    return <div className={styles.Base}>
        <h2>Оберіть Основу</h2>
        <Select items={bases} searchKeys={['name', 'alchemicalWord']} additionalDisplayKeys={['alchemicalWord']}
                onSelectChange={handleOnChange} value={base}/>
    </div>
}
