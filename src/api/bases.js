import {getUserItems, saveUserItem} from "./user-collections.js"

const BASES = "bases"

// Firestore returns documents ordered by id, so sort by name for the select
export async function getBases(uid) {
    const bases = await getUserItems(uid, BASES)

    return bases.toSorted((a, b) => a.name.localeCompare(b.name, "uk"))
}

export function saveBase(uid, base) {
    return saveUserItem(uid, BASES, base)
}
