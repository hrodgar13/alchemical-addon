import {
    DISTILLED_MULTIPLIER,
    GROUND_INGREDIENT_MULTIPLIER,
    MEASURE_DICE,
    MEASURE_TIME,
    TIME_UNIT_LABELS,
    TIME_UNIT_PERMANENT,
    TIME_UNIT_PERMANENT_LABEL,
    TIME_UNITS_ORDER,
} from "../static/static.js"

/*
 *  Pipeline: slots → (1) per-slot part → (2) group by ingredient → (3) whole-potion modifiers.
 *  Time: grinding (4th ingredient too) multiplies the amount, distillation jumps to the next unit.
 *  Critical success is ignored: it is rolled at the table and the app doesn't know about it.
 * */
export function calculateIngredientEffects({ingredients, distill}) {
    const filledSlots = ingredients.filter(slot => slot.ingredient && slot.rarity)

    const parts = filledSlots.map(calculateSlotPart)
    // Map rather than Object.groupBy: numeric object keys get sorted, Map keeps the slot order
    const groups = Map.groupBy(parts, part => part.ingredient.id)

    return Array.from(groups.values(), groupParts => {
        const [{ingredient}] = groupParts

        switch (ingredient.effect_measures_in) {
            case MEASURE_DICE:
                return mergeDice({ingredient, groupParts, distill})
            case MEASURE_TIME:
                return mergeTime({ingredient, groupParts, distill})
            default:
                throw new Error("UNKNOWN MEASURE TYPE")
        }
    })
}

// (1) One slot's part, before whole-potion modifiers
function calculateSlotPart({ingredient, rarity, ground}) {
    if (ingredient.effect_measures_in === MEASURE_DICE) {
        // Grinding: one die step lower but doubled (d8 → 2d6), with 4 ingredients too
        return {
            ingredient,
            die: ground ? rarity.ground_dice_of_effect : rarity.dice_of_effect,
            count: ground ? GROUND_INGREDIENT_MULTIPLIER : 1,
        }
    }

    return {ingredient, amount: rarity.time_units_amount * (ground ? GROUND_INGREDIENT_MULTIPLIER : 1)}
}

// (2) + (3) Dice: count each die size separately, e.g. {d10: 4, d12: 1}
function mergeDice({ingredient, groupParts, distill}) {
    const multiplier = distill ? DISTILLED_MULTIPLIER : 1

    const countsByDie = groupParts.reduce((acc, {die, count}) => {
        acc[die] = (acc[die] ?? 0) + count * multiplier
        return acc
    }, {})

    const dice = Object.entries(countsByDie)
        .map(([die, count]) => ({die, count}))
        .sort((a, b) => dieSize(b.die) - dieSize(a.die))

    return {ingredient, measure: MEASURE_DICE, dice}
}

// (2) + (3) Time: an ingredient has a single unit, so amounts just add up; distillation jumps the unit
function mergeTime({ingredient, groupParts, distill}) {
    const amount = groupParts.reduce((acc, {amount}) => acc + amount, 0)
    const unit = distill ? nextTimeUnit(ingredient.time_units) : ingredient.time_units

    // A permanent effect has no amount
    return {ingredient, measure: MEASURE_TIME, unit, amount: unit === TIME_UNIT_PERMANENT ? null : amount}
}

// Above a year it becomes permanent (the last element)
function nextTimeUnit(unit) {
    const nextIndex = Math.min(TIME_UNITS_ORDER.indexOf(unit) + 1, TIME_UNITS_ORDER.length - 1)

    return TIME_UNITS_ORDER[nextIndex]
}

function dieSize(die) {
    return Number(die.slice(1))
}

const pluralRules = new Intl.PluralRules("uk")

// (4) Display text: "1d12 + 4d10", "32 minutes", "forever"
export function formatIngredientEffect(effect) {
    if (effect.measure === MEASURE_DICE) {
        return effect.dice.map(({die, count}) => `${count}${die}`).join(" + ")
    }

    if (effect.unit === TIME_UNIT_PERMANENT) return TIME_UNIT_PERMANENT_LABEL

    const label = TIME_UNIT_LABELS[effect.unit][pluralRules.select(effect.amount)]

    return `${effect.amount} ${label}`
}
