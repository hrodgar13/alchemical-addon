import Button from "../shared/button/Button.jsx"
import {formatIngredientEffect} from "../../rules/ingredient-effects.js"

import styles from "./alchemical-result.module.css"

export default function IngredientEffect({effect, onInsertTag, canInsert}) {
    return (
        <li className={styles.IngredientEffect}>
            "{effect.ingredient.alchemicalWord}"
            <Button
                disabled={!canInsert}
                onClick={() => onInsertTag(effect)}
                title={canInsert ? `Вставити %${effect.ingredient.alchemicalWord}% в опис` : undefined}
            >
                {formatIngredientEffect(effect)}
            </Button>
        </li>
    )
}
