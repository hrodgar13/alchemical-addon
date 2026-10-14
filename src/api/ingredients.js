import {getUserItems, saveUserItem} from "./user-collections.js"

const INGREDIENTS = "ingredients"

// Firestore returns documents ordered by id, so sort by name for the select
export async function getIngredients(uid) {
    const ingredients = await getUserItems(uid, INGREDIENTS)

    return ingredients.toSorted((a, b) => a.name.localeCompare(b.name, "uk"))
}

export function saveIngredient(uid, ingredient) {
    return saveUserItem(uid, INGREDIENTS, ingredient)
}
