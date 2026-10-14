/*
 *  A potion is a base plus a set of unique ingredients (order and count don't matter),
 *  so "Snowdrop + 2 Claws" and "2 Snowdrops + Claw" get the same key.
 * */
function buildRecipeKey({baseId, ingredientsIds}) {
    const uniqueIds = [...new Set(ingredientsIds.map(String))].sort()

    return `${baseId}:${uniqueIds.join(",")}`
}

// null while the recipe is incomplete (no base or an empty slot)
export function getRecipeKey({base, ingredients}) {
    const isComplete = base && ingredients.length > 0 && ingredients.every(slot => slot.ingredient)

    if (!isComplete) return null

    return buildRecipeKey({baseId: base.id, ingredientsIds: ingredients.map(slot => slot.ingredient.id)})
}

export function findBrewedPotion({recipeKey, brewedPotions}) {
    if (!recipeKey) return null

    return brewedPotions.find(potion => buildRecipeKey(potion) === recipeKey) ?? null
}

// The base word followed by the unique ingredient words, e.g. "Give Strength Cold"
export function buildAlchemicalSentence({base, ingredientEffects}) {
    if (!base) return ""

    return [base.alchemicalWord, ...ingredientEffects.map(effect => effect.ingredient.alchemicalWord)].join(" ")
}
