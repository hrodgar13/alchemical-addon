import {ToggleGroup} from "@base-ui/react/toggle-group"
import {Toggle} from "@base-ui/react/toggle"
import styles from "./where-we-cook.module.css"
import alchemyTableImg from "../../assets/AkhemyTable.png"
import alchemistSuppliesImg from "../../assets/AlchemistSupplies.png"
import {usePotionBrew} from "../../hooks/usePotionBrew.js"
import {FIELD_INSTRUMENTS, STATION} from "../../static/static.js"
import KnotRibbon from "./KnotRibbon.jsx"

export default function WhereWeCook() {
    const {whereWeCook, setWhereWeCook} = usePotionBrew()
    const isStation = whereWeCook === STATION

    function handleWhereWeCookChange(groupValue) {
        // Clicking the selected option again yields []; ignore it so one option always stays selected
        const [newWhereWeCook] = groupValue
        if (newWhereWeCook) setWhereWeCook(newWhereWeCook)
    }

    function handleTrackClick() {
        setWhereWeCook(isStation ? FIELD_INSTRUMENTS : STATION)
    }

    return (
        <div className={styles.WhereWeCook} data-station={isStation || undefined}>
            {/* Sky: night with aurora (field kit) or warm candlelight (lab station) */}
            <div className={styles.Sky} aria-hidden="true">
                <div className={`${styles.SkyLayer} ${styles.Night}`} />
                <div className={`${styles.SkyLayer} ${styles.Candle}`} />
            </div>

            <h2 className={styles.Title} id="where-we-cook-title">
                Де готуємо зілля?
            </h2>
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
                        <img
                            className={styles.ThumbImage}
                            src={isStation ? alchemyTableImg : alchemistSuppliesImg}
                            alt=""
                        />
                    </span>
                </span>
                <Toggle value={STATION} className={styles.Option}>
                    Повноцінна станція
                </Toggle>
            </ToggleGroup>

            <KnotRibbon className={styles.Ribbon} text="ᚺᛟᚹ ᛃᛟᚢ ᚷᛟᚾᚾᚨ ᚹᛟᚾᛞᛖᚱ ᚹᛟᚱᛚᛞ ᛏᛟᛞᚨᛃ?" />
        </div>
    )
}
