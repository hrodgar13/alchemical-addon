import styles from './ingredients.module.css'
import Select from "../shared/select/Select.jsx";
import Checkbox from "../shared/checkbox/Checkbox.jsx";
import {usePotionBrew} from "../../contexts/PotionBrewContext.jsx";
import {usePotionComponents} from "../../contexts/PotionComponentsContext.jsx";

function IngredientsItem({ingredientCombination, disabled = false, onSelectIngredient, onSelectRarity, onChangeGrind}) {

    const {ingredients, ingredientRarities} = usePotionComponents()

    function handleIngredientChange(ingredient) {
        onSelectIngredient({...ingredientCombination, ingredient})
    }
    function handleRarityChange(rarity) {
        onSelectRarity({...ingredientCombination, rarity})
    }
    function handleGrindChange(ground) {
        onChangeGrind({...ingredientCombination, ground})
    }

    return <div className={`${styles.IngredientsItem} ${disabled ? styles.DisabledIngredient : ''}`}>
        <h3 className={styles.IngredientTitle}>Інградієнт {ingredientCombination.ingredientCombinationId}</h3>
        <div>
            <h4 className={styles.subHeaderH4}>Інградієнт</h4>
            <Select
                value={ingredientCombination.ingredient}
                items={ingredients} searchKeys={['name', 'alchemicalWord']} additionalDisplayKeys={['alchemicalWord']}
                onSelectChange={handleIngredientChange}
                objectSelect={'Інградієнт'}/>
        </div>
        <div>
            <h4>Рідкість</h4>
            <Select
                value={ingredientCombination.rarity}
                items={ingredientRarities} searchKeys={['name']}
                onSelectChange={handleRarityChange}
                objectSelect={'Рідкість'}/>
        </div>

        <Checkbox checked={ingredientCombination.ground} label={'Перетираємо?'} onCheckedChange={handleGrindChange}/>
    </div>
}

export default IngredientsItem
