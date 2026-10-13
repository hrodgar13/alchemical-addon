import styles from './alchemical-result.module.css'
import {usePotionBrew} from "../../contexts/PotionBrewContext.jsx";
import IngredientEffect from "./IngredientEffect.jsx";

export default function AlchemicalResult() {
    const {whereWeCook, base, ingredients, distill} = usePotionBrew()

    console.log({whereWeCook, base, ingredients, distill})

    return <div className={styles.AlchemicalResult}>
        <ul className={styles.IngredientsEffects}>
            {base && <li>"{base.alchemicalWord}"</li>}
            {ingredients && ingredients.map(ingredientCombination => ingredientCombination.ingredient && <IngredientEffect key={ingredientCombination.ingredientCombinationId} ingredientCombination={ingredientCombination} distilled={distill}/>)}
        </ul>
        <div>Description with name</div>
    </div>
}
