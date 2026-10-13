import styles from "./ingredients.module.css"
import IngredientsItem from "./IngredientsItem.jsx"
import VineFrame from "./VineFrame.jsx"
import {usePotionBrew} from "../../hooks/usePotionBrew.js"
import Button from "../shared/button/Button.jsx"
import {MAX_INGREDIENTS, MAX_UNGRIND} from "../../static/static.js"

export default function Ingredients() {
    const {ingredients, addNewIngredient, editIngredientCombination, removeIngredient} = usePotionBrew()

    const areAllSlotsFilled = ingredients.every(item => item.ingredient !== null)

    // До 3 інгредієнтів — вільно; 4-й — лише якщо всі три перетерті
    const canAddIngredient =
        areAllSlotsFilled &&
        (ingredients.length < MAX_UNGRIND ||
            (ingredients.length === MAX_UNGRIND && ingredients.every(item => item.ground)))

    // При 4 інгредієнтах усі зобов'язані бути перетертими — змінювати перетирання не можна
    const isGroundLocked = ingredients.length === MAX_INGREDIENTS

    function handleAddNewIngredient() {
        if (!canAddIngredient) return

        addNewIngredient()
    }

    return (
        <div className={styles.Ingredients}>
            <VineFrame />
            <h2>Інградієнти</h2>
            <div className={styles.IngredientsGrid}>
                {ingredients.map((ingredient, index) => (
                    <IngredientsItem
                        ingredientCombination={ingredient}
                        position={index + 1}
                        onEditIngredient={editIngredientCombination}
                        onRemoveIngredient={removeIngredient}
                        key={ingredient.ingredientCombinationId}
                        disabled={false}
                        isGroundLocked={isGroundLocked}
                    />
                ))}
                {canAddIngredient && (
                    <div>
                        <Button onClick={handleAddNewIngredient}>+</Button>
                    </div>
                )}
            </div>
        </div>
    )
}
