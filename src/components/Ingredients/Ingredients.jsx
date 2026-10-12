import styles from './ingredients.module.css'
import IngredientsItem from "./IngredientsItem.jsx";
import {usePotionBrew} from "../../contexts/PotionBrewContext.jsx";
import Button from "../shared/button/Button.jsx"
import {MAX_INGREDIENTS, MAX_UNGRIND} from "../../static/static.js";


export default function Ingredients() {
    const {ingredients, addNewIngredient, editIngredientCombination} = usePotionBrew()

    // До 3 інгредієнтів — вільно; 4-й — лише якщо всі три перетерті
    const canAddIngredient =
        ingredients.length < MAX_UNGRIND ||
        (ingredients.length === MAX_UNGRIND && ingredients.every(item => item.ground))

    // При 4 інгредієнтах усі зобов'язані бути перетертими — змінювати перетирання не можна
    const isGroundLocked = ingredients.length === MAX_INGREDIENTS

    function handleAddNewIngredient() {
        if(!canAddIngredient) return

        const ingredientCombinationId = ingredients.length + 1

        addNewIngredient(ingredientCombinationId)
    }


    return <div className={styles.Ingredients}>
        <h2>Інградієнти</h2>
        <div className={styles.IngredientsGrid}>
            {
                ingredients.map(ingredient => <IngredientsItem ingredientCombination={ingredient}
                                                               onEditIngredient={editIngredientCombination}
                                                               key={ingredient.ingredientCombinationId}
                                                               disabled={false}
                                                               isGroundLocked={isGroundLocked}
                                                               />)
            }
            {canAddIngredient && <div><Button onClick={handleAddNewIngredient}>+</Button></div>}
        </div>
    </div>
}
