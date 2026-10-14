import {getUserItems, saveUserItem} from "./user-collections.js"

const INGREDIENTS = "ingredients"

// Firestore віддає документи в порядку id — для селекта сортуємо за назвою
export async function getIngredients(uid) {
    const ingredients = await getUserItems(uid, INGREDIENTS)

    return ingredients.toSorted((a, b) => a.name.localeCompare(b.name, "uk"))
}

export function saveIngredient(uid, ingredient) {
    return saveUserItem(uid, INGREDIENTS, ingredient)
}
