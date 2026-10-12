import {
    DISTILLATION_DIFFICULTY,
    FIELD_INSTRUMENTS,
    GROUND_INGREDIENT_ADDITION_TO_DIFFICULTY, POTION_INITIAL_DIFFICULTY, STATION,
    STATION_DIFFICULTY_BENEFIT
} from "../static/static.js";

export default function difficultyCalculator(whereWeCook, base, ingredients, distill) {
    const baseDifficulty = base ? whereWeCook === FIELD_INSTRUMENTS ? base.difficulty : base.difficulty - STATION_DIFFICULTY_BENEFIT : 0

    const ingredientsDifficulty = ingredients.reduce((acc, currentValue) => {
        const ingredientDifficulty = currentValue.ingredient ? currentValue.ingredient.difficulty : 0
        const ingredientRarity = currentValue.rarity ? currentValue.rarity.difficulty : 0
        const ingredientGrind = currentValue.ground ? GROUND_INGREDIENT_ADDITION_TO_DIFFICULTY : 0
        const stationBenefit = whereWeCook === STATION && currentValue.ingredient ? STATION_DIFFICULTY_BENEFIT : 0

        return acc + ingredientDifficulty + ingredientRarity + ingredientGrind - stationBenefit
    }, 0)

    const distillDifficulty = distill && whereWeCook === STATION ? DISTILLATION_DIFFICULTY : 0

    return POTION_INITIAL_DIFFICULTY + baseDifficulty + ingredientsDifficulty + distillDifficulty

}
