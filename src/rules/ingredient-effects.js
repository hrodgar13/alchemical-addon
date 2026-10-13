import {
    DISTILLED_MULTIPLIER,
    GROUND_INGREDIENT_MULTIPLIER,
    MEASURE_DICE,
    MEASURE_TIME,
    TIME_UNIT_LABELS,
    TIME_UNIT_PERMANENT,
    TIME_UNIT_PERMANENT_LABEL,
    TIME_UNITS_ORDER
} from "../static/static.js";

/*
*  Ефекти інгредієнтів зілля — конвеєр з чистих кроків:
*  слоти → (1) внесок кожного слота → (2) групування за інгредієнтом → (3) модифікатори всього зілля
*
*  Результат — дані, а не рядки: шаблони опису братимуть звідси числа,
*  а в текст для показу перетворює окрема formatIngredientEffect.
*
*  Час: ступка (і для 4-го інгредієнта теж) та крит множать кількість, дистиляція — стрибок на наступну одиницю.
*  Крит. успіх не враховується — кидок робиться за столом, застосунок про нього не знає.
* */
export function calculateIngredientEffects({ingredients, distill}) {
    const filledSlots = ingredients.filter(slot => slot.ingredient && slot.rarity)

    const parts = filledSlots.map(calculateSlotPart)
    // Map, а не Object.groupBy: числові ключі об'єкта сортуються, а Map зберігає порядок слотів
    const groups = Map.groupBy(parts, part => part.ingredient.id)

    return Array.from(groups.values(), groupParts => {
        const [{ingredient}] = groupParts

        switch (ingredient.effect_measures_in) {
            case MEASURE_DICE:
                return mergeDice({ingredient, groupParts, distill})
            case MEASURE_TIME:
                return mergeTime({ingredient, groupParts, distill})
            default:
                throw new Error('UNKNOWN MEASURE TYPE')
        }
    })
}

// (1) Внесок одного слота, без модифікаторів усього зілля
function calculateSlotPart({ingredient, rarity, ground}) {
    if (ingredient.effect_measures_in === MEASURE_DICE) {
        // Ступка: кубик на градацію нижче, але подвоєний (к8 → 2к6) — і при 4 інгредієнтах теж
        return {
            ingredient,
            die: ground ? rarity.ground_dice_of_effect : rarity.dice_of_effect,
            count: ground ? GROUND_INGREDIENT_MULTIPLIER : 1
        }
    }

    return {ingredient, amount: rarity.time_units_amount * (ground ? GROUND_INGREDIENT_MULTIPLIER : 1)}
}

// (2) + (3) Кубики: рахуємо кількість окремо для кожного кубика — {к10: 4, к12: 1}
function mergeDice({ingredient, groupParts, distill}) {
    const multiplier = distill ? DISTILLED_MULTIPLIER : 1

    const countsByDie = groupParts.reduce((acc, {die, count}) => {
        acc[die] = (acc[die] ?? 0) + count * multiplier
        return acc
    }, {})

    // Від більшого кубика до меншого: 1к12 + 4к10
    const dice = Object.entries(countsByDie)
        .map(([die, count]) => ({die, count}))
        .sort((a, b) => dieSize(b.die) - dieSize(a.die))

    return {ingredient, measure: MEASURE_DICE, dice}
}

// (2) + (3) Час: в одного інгредієнта одна одиниця, тож просто сумуємо; дистиляція — стрибок одиниці
function mergeTime({ingredient, groupParts, distill}) {
    const amount = groupParts.reduce((acc, {amount}) => acc + amount, 0)
    const unit = distill ? nextTimeUnit(ingredient.time_units) : ingredient.time_units

    // Перманентний ефект — кількість більше не має значення
    return {ingredient, measure: MEASURE_TIME, unit, amount: unit === TIME_UNIT_PERMANENT ? null : amount}
}

// Стрибок на наступну одиницю; вище року — перманентно (останній елемент)
function nextTimeUnit(unit) {
    const nextIndex = Math.min(TIME_UNITS_ORDER.indexOf(unit) + 1, TIME_UNITS_ORDER.length - 1)

    return TIME_UNITS_ORDER[nextIndex]
}

// 'к10' → 10
function dieSize(die) {
    return Number(die.slice(1))
}

const pluralRules = new Intl.PluralRules('uk')

// (4) Текст для показу: «1к12 + 4к10», «32 хвилини», «назавжди»
export function formatIngredientEffect(effect) {
    if (effect.measure === MEASURE_DICE) {
        return effect.dice.map(({die, count}) => `${count}${die}`).join(' + ')
    }

    if (effect.unit === TIME_UNIT_PERMANENT) return TIME_UNIT_PERMANENT_LABEL

    const label = TIME_UNIT_LABELS[effect.unit][pluralRules.select(effect.amount)]

    return `${effect.amount} ${label}`
}
