/*
*  Зілля визначається основою + набором унікальних інгредієнтів (без порядку й кількості).
*  Тому ключ рецепту — id основи і відсортовані унікальні id інгредієнтів:
*  «Підсніжник + 2 кігті» і «2 підсніжники + кіготь» дають однаковий ключ.
* */
export function buildRecipeKey({baseId, ingredientsIds}) {
    const uniqueIds = [...new Set(ingredientsIds.map(String))].sort()

    return `${baseId}:${uniqueIds.join(',')}`
}

// Ключ поточного рецепту; null — поки рецепт неповний (немає основи або є порожній слот)
export function getRecipeKey({base, ingredients}) {
    const isComplete = base && ingredients.length > 0 && ingredients.every(slot => slot.ingredient)

    if (!isComplete) return null

    return buildRecipeKey({baseId: base.id, ingredientsIds: ingredients.map(slot => slot.ingredient.id)})
}

export function findBrewedPotion({recipeKey, brewedPotions}) {
    if (!recipeKey) return null

    return brewedPotions.find(potion => buildRecipeKey(potion) === recipeKey) ?? null
}

// «Дати Сила Холод» — слово основи і слова унікальних інгредієнтів
export function buildAlchemicalSentence({base, ingredientEffects}) {
    if (!base) return ''

    return [base.alchemicalWord, ...ingredientEffects.map(effect => effect.ingredient.alchemicalWord)].join(' ')
}
