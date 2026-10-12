import styles from './ingredients.module.css'
import Select from "../shared/select/Select.jsx";
import Checkbox from "../shared/checkbox/Checkbox.jsx";
import {usePotionBrew} from "../../contexts/PotionBrewContext.jsx";
import {usePotionComponents} from "../../contexts/PotionComponentsContext.jsx";

function IngredientsItem({ingredientCombination, disabled = false, isGroundLocked = false, onEditIngredient}) {

    const {ingredients, ingredientRarities} = usePotionComponents()

    function handleEditIngredient(key, value) {
        onEditIngredient({...ingredientCombination, [key]: value})
    }

    return <div className={`${styles.IngredientsItem} ${disabled ? styles.DisabledIngredient : ''}`}>
        <h3 className={styles.IngredientTitle}>Інградієнт {ingredientCombination.ingredientCombinationId}</h3>
        <div>
            <h4 className={styles.subHeaderH4}>Інградієнт</h4>
            <Select
                value={ingredientCombination.ingredient}
                items={ingredients} searchKeys={['name', 'alchemicalWord']} additionalDisplayKeys={['alchemicalWord']}
                onSelectChange={(value) => handleEditIngredient('ingredient', value)}
                objectSelect={'Інградієнт'}/>
        </div>
        <div>
            <h4>Рідкість</h4>
            <Select
                value={ingredientCombination.rarity}
                items={ingredientRarities} searchKeys={['name']}
                onSelectChange={(value) => handleEditIngredient('rarity', value)}
                objectSelect={'Рідкість'}/>
        </div>

        <Checkbox checked={ingredientCombination.ground} label={'Перетираємо?'}
                  disabled={isGroundLocked}
                  onCheckedChange={(value) => handleEditIngredient('ground', value)}/>
        {isGroundLocked && (
            <p className={styles.Hint}>З 4 інгредієнтами всі мають бути перетерті. Щоб змінити — спочатку видаліть 4-й.</p>
        )}
    </div>
}

export default IngredientsItem
