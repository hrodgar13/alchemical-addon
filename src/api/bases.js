import {getUserItems, saveUserItem} from "./user-collections.js"

const BASES = "bases"

// Firestore віддає документи в порядку id — для селекта сортуємо за назвою
export async function getBases(uid) {
    const bases = await getUserItems(uid, BASES)

    return bases.toSorted((a, b) => a.name.localeCompare(b.name, "uk"))
}

export function saveBase(uid, base) {
    return saveUserItem(uid, BASES, base)
}
