import {getUserItems, saveUserItem} from "./user-collections.js"

const BREWED_POTIONS = "brewedPotions"

export function getBrewedPotions(uid) {
    return getUserItems(uid, BREWED_POTIONS)
}

export function saveBrewedPotion(uid, potion) {
    return saveUserItem(uid, BREWED_POTIONS, potion)
}
