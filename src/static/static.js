const FIELD_INSTRUMENTS = "fieldInstruments"
const STATION = "station"

const INGREDIENT_RARITIES = [
    {
        id: 1,
        name: "Середня",
        difficulty: 0,
        dice_of_effect: "к6",
        ground_dice_of_effect: "к4",
        time_units_amount: 1,
    },
    {
        id: 2,
        name: "Хороша",
        difficulty: 1,
        dice_of_effect: "к8",
        ground_dice_of_effect: "к6",
        time_units_amount: 2,
    },
    {
        id: 3,
        name: "Неймовірна",
        difficulty: 2,
        dice_of_effect: "к10",
        ground_dice_of_effect: "к8",
        time_units_amount: 4,
    },
    {
        id: 4,
        name: "Легендарна",
        difficulty: 3,
        dice_of_effect: "к12",
        ground_dice_of_effect: "к10",
        time_units_amount: 8,
    },
]

// Apply to both dice count and duration
const GROUND_INGREDIENT_MULTIPLIER = 2

const DISTILLED_MULTIPLIER = 2
const POTION_INITIAL_DIFFICULTY = 8
const LIMIT_DIFFICULTY_IN_FIELD_INSTRUMENTS = 25

const GROUND_INGREDIENT_ADDITION_TO_DIFFICULTY = 1

const MEASURE_DICE = "dice"
const MEASURE_TIME = "time"

const TIME_UNIT_ROUND = "round"
const TIME_UNIT_MINUTE = "minute"
const TIME_UNIT_HOUR = "hour"
const TIME_UNIT_DAY = "day"
const TIME_UNIT_WEEK = "week"
const TIME_UNIT_MONTH = "month"
const TIME_UNIT_YEAR = "year"
const TIME_UNIT_PERMANENT = "permanent"

// Ascending: the index is the rank, a distillation jump moves to the next unit
const TIME_UNITS_ORDER = [
    TIME_UNIT_ROUND,
    TIME_UNIT_MINUTE,
    TIME_UNIT_HOUR,
    TIME_UNIT_DAY,
    TIME_UNIT_WEEK,
    TIME_UNIT_MONTH,
    TIME_UNIT_YEAR,
    TIME_UNIT_PERMANENT,
]

// Plural forms for Intl.PluralRules("uk"); "other" is used for fractions
const TIME_UNIT_LABELS = {
    [TIME_UNIT_ROUND]: {one: "раунд", few: "раунди", many: "раундів", other: "раунду"},
    [TIME_UNIT_MINUTE]: {one: "хвилина", few: "хвилини", many: "хвилин", other: "хвилини"},
    [TIME_UNIT_HOUR]: {one: "година", few: "години", many: "годин", other: "години"},
    [TIME_UNIT_DAY]: {one: "день", few: "дні", many: "днів", other: "дня"},
    [TIME_UNIT_WEEK]: {one: "тиждень", few: "тижні", many: "тижнів", other: "тижня"},
    [TIME_UNIT_MONTH]: {one: "місяць", few: "місяці", many: "місяців", other: "місяця"},
    [TIME_UNIT_YEAR]: {one: "рік", few: "роки", many: "років", other: "року"},
}

const TIME_UNIT_PERMANENT_LABEL = "назавжди"

const MAX_INGREDIENTS = 4
const MAX_UNGRIND = 3

const STATION_DIFFICULTY_BENEFIT = 1

const DISTILLATION_DIFFICULTY = 5

export {
    FIELD_INSTRUMENTS,
    STATION,
    INGREDIENT_RARITIES,
    GROUND_INGREDIENT_MULTIPLIER,
    POTION_INITIAL_DIFFICULTY,
    LIMIT_DIFFICULTY_IN_FIELD_INSTRUMENTS,
    MEASURE_DICE,
    MEASURE_TIME,
    TIME_UNIT_PERMANENT,
    MAX_INGREDIENTS,
    GROUND_INGREDIENT_ADDITION_TO_DIFFICULTY,
    STATION_DIFFICULTY_BENEFIT,
    MAX_UNGRIND,
    DISTILLATION_DIFFICULTY,
    DISTILLED_MULTIPLIER,
    TIME_UNITS_ORDER,
    TIME_UNIT_LABELS,
    TIME_UNIT_PERMANENT_LABEL,
}
