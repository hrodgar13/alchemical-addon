import styles from './alchemical-result.module.css'
import {usePotionBrew} from "../../contexts/PotionBrewContext.jsx";
import IngredientEffect from "./IngredientEffect.jsx";
import PotionDescription from "./PotionDescription.jsx";

export default function AlchemicalResult() {
    const {base, ingredientEffects} = usePotionBrew()

    return <div className={styles.AlchemicalResult}>
        <ul className={styles.IngredientsEffects}>
            {base && <li>"{base.alchemicalWord}"</li>}
            {/* Один рядок — один унікальний інгредієнт: однакові слоти вже складені разом */}
            {ingredientEffects.map(effect =>
                <IngredientEffect key={effect.ingredient.id} effect={effect}/>
            )}
        </ul>
        <PotionDescription/>
    </div>
}
