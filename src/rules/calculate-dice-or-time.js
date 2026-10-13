import {
    DISTILLED_DICE_AMOUNT,
    GROUND_INGREDIENT_DICE_AMOUNT,
    MEASURE_DICE,
    MEASURE_TIME,
    TIME_UNITS_RATING
} from "../static/static.js";

export default function calculateDiceOrTime(ingredient, rarity, ground, distilled) {
    switch (ingredient.effect_measures_in) {
        case MEASURE_DICE:
            return calculateDices(ground, rarity, distilled);
        case MEASURE_TIME:
            return calculateTime(ingredient.time_units, ground, rarity, distilled);
        default:
            return {status: 'error', message: 'Невідомий тип вимірювання'}
    }
}

function calculateDices(ground, rarity, distilled) {
    let dice = rarity.dice_of_effect

    if(ground) {
        dice = rarity.ground_dice_of_effect
    }

    const diceAmount = 1 * (ground ? GROUND_INGREDIENT_DICE_AMOUNT : 1) * (distilled ? DISTILLED_DICE_AMOUNT : 1)

    return `${diceAmount}${dice}`
}

function calculateTime(timeUnits, ground, rarity, distilled) {
    const timeAmount = rarity.time_units_amount * (ground ? GROUND_INGREDIENT_DICE_AMOUNT : 1)

    if(distilled) {
        const currentTimeUnitRating = TIME_UNITS_RATING.find(rating => rating.unit === timeUnits)

        const {unit: nextTimeUnitRating} = TIME_UNITS_RATING.find(rating => rating.place === currentTimeUnitRating.place + 1)

        timeUnits = nextTimeUnitRating
    }

    return `${timeAmount} ${timeUnits}`
}
