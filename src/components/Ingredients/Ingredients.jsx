import styles from './ingredients.module.css'
import IngredientsItem from "./IngredientsItem.jsx";
import {useEffect, useState} from "react";
import {usePotionBrew} from "../../contexts/PotionBrewContext.jsx";
import Button from "../shared/button/Button.jsx"
import {MAX_INGREDIENTS} from "../../static/static.js";


export default function Ingredients() {
    const {ingredients, addNewIngredient, editIngredientCombination} = usePotionBrew()

    const [disabledIngredients, setDisabledIngredients] = useState([])

    useEffect(() => {

    }, [disabledIngredients]);

    function handleAddNewIngredient() {
        if(ingredients.length >= MAX_INGREDIENTS) return

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
                                                               disabled={!!disabledIngredients.find(item => item === ingredient.ingredientCombinationId)}/>)
            }
            {ingredients.length < MAX_INGREDIENTS && <div><Button onClick={handleAddNewIngredient}>+</Button></div>}
        </div>
    </div>
}
