import Button from "../shared/button/Button.jsx";
import {formatIngredientEffect} from "../../rules/ingredient-effects.js";

import styles from './alchemical-result.module.css'

export default function IngredientEffect({effect}) {

    return <li className={styles.IngredientEffect}>
        "{effect.ingredient.alchemicalWord}"
        <Button>{formatIngredientEffect(effect)}</Button>
    </li>
}
