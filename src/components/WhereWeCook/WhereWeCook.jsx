import {ToggleGroup} from '@base-ui/react/toggle-group'
import {Toggle} from '@base-ui/react/toggle'
import styles from './where-we-cook.module.css';
import alchemyTableImg from '../../assets/AkhemyTable.png';
import alchemistSuppliesImg from '../../assets/AlchemistSupplies.png';
import {usePotion, FIELD_INSTRUMENTS, STATION} from "../../contexts/PotionContext.jsx";


export default function WhereWeCook() {
    const {whereWeCook, setWhereWeCook} = usePotion()
    const isStation = whereWeCook === STATION

    function handleWhereWeCookChange(groupValue) {
        // Повторний клік по вже вибраному пункту повертає [] — ігноруємо, один варіант завжди вибраний
        const [newWhereWeCook] = groupValue
        if (newWhereWeCook) setWhereWeCook(newWhereWeCook)
    }

    function handleTrackClick() {
        setWhereWeCook(isStation ? FIELD_INSTRUMENTS : STATION)
    }

    return <div className={styles.WhereWeCook}>
        <h2 className={styles.Title} id="where-we-cook-title">Де готуємо зілля?</h2>
        <ToggleGroup
            value={[whereWeCook]}
            onValueChange={handleWhereWeCookChange}
            className={styles.Group}
            aria-labelledby="where-we-cook-title"
        >
            <Toggle value={FIELD_INSTRUMENTS} className={styles.Option}>
                Алхімічний набір
            </Toggle>
            <span
                className={styles.Track}
                data-station={isStation || undefined}
                onClick={handleTrackClick}
                aria-hidden="true"
            >
                <span className={styles.Thumb}>
                    <img className={styles.ThumbImage} src={isStation ? alchemyTableImg : alchemistSuppliesImg} alt="" />
                </span>
            </span>
            <Toggle value={STATION} className={styles.Option}>
                Повноцінна станція
            </Toggle>
        </ToggleGroup>
    </div>
}
