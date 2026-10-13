import calculateDiceOrTime from "../../rules/calculate-dice-or-time.js";
import Button from "../shared/button/Button.jsx";

import styles from './alchemical-result.module.css'

export default function IngredientEffect({ingredientCombination, distilled}) {
    const {ingredient, rarity, ground} = ingredientCombination

    const diceOrTime = calculateDiceOrTime(ingredient, rarity, ground, distilled)

    return <div className={styles.IngredientEffect}>
        "{ingredient.alchemicalWord}"
        <Button>{diceOrTime}</Button>
    </div>
}
