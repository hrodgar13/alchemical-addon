const FIELD_INSTRUMENTS = 'fieldInstruments'
const STATION = 'station'

const BASES = [
    {
        id: 1,
        name: 'Вода',
        alchemicalWord: 'Дати',
        difficulty: 1,
        symbol: 'aqua'
    },
    {
        id: 2,
        name: 'Спирт',
        alchemicalWord: 'Забрати',
        difficulty: 2,
        symbol: 'spiritus'
    },
    {
        id: 3,
        name: 'Олія',
        alchemicalWord: 'Нанести',
        difficulty: 2,
        symbol: 'olium'
    },
    {
        id: 4,
        name: 'Вино',
        alchemicalWord: 'Змінити',
        difficulty: 3,
        symbol: 'vinum'
    }
]

const INGREDIENT_RARITIES = [
    {
        id: 1,
        name: 'Середня',
        difficulty: 0,
        dice_of_effect: 'к6',
        ground_dice_of_effect: 'к4',
        time_units_amount: 1
    },
    {
        id: 2,
        name: 'Хороша',
        difficulty: 1,
        dice_of_effect: 'к8',
        ground_dice_of_effect: 'к6',
        time_units_amount: 2
    },
    {
        id: 3,
        name: 'Нейморвірна',
        difficulty: 2,
        dice_of_effect: 'к10',
        ground_dice_of_effect: 'к8',
        time_units_amount: 4
    },
    {
        id: 4,
        name: 'Легендарна',
        difficulty: 3,
        dice_of_effect: 'к12',
        ground_dice_of_effect: 'к10',
        time_units_amount: 8
    }
]

// Множники ефекту — діють і на кількість кубиків, і на тривалість
const GROUND_INGREDIENT_MULTIPLIER = 2

const DISTILLED_MULTIPLIER = 2
const POTION_INITIAL_DIFFICULTY = 8
const LIMIT_DIFFICULTY_IN_FIELD_INSTRUMENTS = 25

const GROUND_INGREDIENT_ADDITION_TO_DIFFICULTY = 1

/*
*  Kinda new stuff to system. Some of effects cannot have dices, so their effects are measuring in time.
*  The time_units_amount in ingredients rarity shows how much time effect will works.
*  For example:
*  Ведмежий кіготь (хвилина) Легендарної якості (8) - означає, що еффект зілля з цим інградієнтом - діятиме 8 хвилин.
*
*  Putting 2 or 3 such ingredients in one potion brewing - will sum up the amounts of time (Refering to previous example, if we put 3 such ingredients - effect will be 24 minutes.
*
*  Grinding such ingredients - doubling their amount of time they will be working. For example:
*
*  Якщо взяти 3 кігтя ведмедя Легендарної якості, 1 перетерти а 2 інших = ні то зілля буде тривати: 8 * 2 + 8 + 8 = 32 хвилини
*
*  Наприклад, якщо взяти 3 Легендарні кігті ведмедя, перемолоти, - то час дії зілля буде: 8 * 2 + 8 * 2 + 8 * 2 = 48 хвилинам
*
*  4th grinded ingredient has no special rule - its time is doubled like any other: 4 кігті перетерті = 8 * 2 * 4 = 64 хвилини
*
*  Distillation makes the potion jump to the next time unit (amount stays the same): 4 кігті перетерті + дистиляція = 64 години.
*  Jump above a year = permanent effect. Critical success doubles the amount (not tracked by the app).
*
* */

const MEASURE_DICE = 'dice'
const MEASURE_TIME = 'time'

const TIME_UNIT_ROUND = 'round'
const TIME_UNIT_MINUTE = 'minute'
const TIME_UNIT_HOUR = 'hour'
const TIME_UNIT_DAY = 'day'
const TIME_UNIT_WEEK = 'week'
const TIME_UNIT_MONTH = 'month'
const TIME_UNIT_YEAR = 'year'
const TIME_UNIT_PERMANENT = 'permanent'

// Одиниці часу по зростанню — позиція в масиві і є рангом, стрибок = наступний елемент
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

// Форми для Intl.PluralRules('uk'): 1 хвилина / 2 хвилини / 5 хвилин (other — для дробів)
const TIME_UNIT_LABELS = {
    [TIME_UNIT_ROUND]: {one: 'раунд', few: 'раунди', many: 'раундів', other: 'раунду'},
    [TIME_UNIT_MINUTE]: {one: 'хвилина', few: 'хвилини', many: 'хвилин', other: 'хвилини'},
    [TIME_UNIT_HOUR]: {one: 'година', few: 'години', many: 'годин', other: 'години'},
    [TIME_UNIT_DAY]: {one: 'день', few: 'дні', many: 'днів', other: 'дня'},
    [TIME_UNIT_WEEK]: {one: 'тиждень', few: 'тижні', many: 'тижнів', other: 'тижня'},
    [TIME_UNIT_MONTH]: {one: 'місяць', few: 'місяці', many: 'місяців', other: 'місяця'},
    [TIME_UNIT_YEAR]: {one: 'рік', few: 'роки', many: 'років', other: 'року'},
}

const TIME_UNIT_PERMANENT_LABEL = 'назавжди'


const MOCK_INGREDIENTS = [
    {
        id: 1,
        name: 'Календула',
        alchemicalWord: 'Життя',
        difficulty: 1,
        effect_measures_in: MEASURE_DICE,
        time_units: null,
        description: 'Найпростіший Іградієнт, використовується для зіль лікувань і простих ядів'
    },
    {
        id: 2,
        name: 'Підсніжники',
        alchemicalWord: 'Холод',
        difficulty: 2,
        effect_measures_in: MEASURE_DICE,
        time_units: null,
        description: 'Може використовуватись для наділення зброї і отрути уроном холодом. У звязці з іншими інградіжнтами - еффект може бути іншим.'
    },
    {
        id: 3,
        name: 'Ведмежий кіготь',
        alchemicalWord: 'Сила',
        difficulty: 2,
        effect_measures_in: MEASURE_TIME,
        time_units: TIME_UNIT_MINUTE,
        description: 'Використовується для підсилення еффекту інших інградієнтів, або надання особливостей атакам заклинача. У самостійному використанні - дає фізичну силу'
    },
    {
        id: 4,
        name: 'Сок Кактуса',
        alchemicalWord: 'Параліч',
        difficulty: 3,
        effect_measures_in: MEASURE_TIME,
        time_units: TIME_UNIT_ROUND,
        description: 'Маніпулює з Паралічем, повторне додавання інградієнта у зілля - підвищує його еффективнісить'
    },
    {
        id: 5,
        name: 'Сонний Мак',
        alchemicalWord: 'Сон',
        difficulty: 3,
        effect_measures_in: MEASURE_TIME,
        time_units: TIME_UNIT_HOUR,
        description: 'Маніпулює зі сном істоти, повторне додавання інградієнта у зілля - підивщує його ефективність'
    },
    {
        id: 6,
        name: 'Корінь Болота',
        alchemicalWord: 'Бадьорість',
        difficulty: 2,
        effect_measures_in: MEASURE_TIME,
        time_units: TIME_UNIT_HOUR,
        description: 'Маніпулює зі Бадьорістю істоти, є антиподом Сонного Мака. Повторне додавання Інградієнта - підвищує його еффективність'
    },
]

const BREWED_POTIONS = [
    {
        id: 1,
        name: 'Зілля Сили Холоду',
        // %ing:3% — тег інгредієнта за id; у звичайному режимі на його місці число з поточного рецепту
        description: 'Випивши зілля, істота протягом %ing:3% завдає додаткові %ing:2% шкоди Холодом заклинаннями, які наносять шкоду Холодом.',
        ingredientsIds: [3, 2],
        baseId: 1,
        isScorched: false
    }
]

/*
*  Я тут поставив %___% не просто так. По факту, одне і те саме зілля можна зварити з інградієнтами різної якості і кількості (наприклад взяти 2 кігтя і 1 підсніжник
*  або 1 підсніжник і два кігтя) Суті зілля це не поміняє, але поміняє його кількість шкоди і кількість часу яке воно буде активне. Тому у тегах %___% будуть підставлятись
*  суми часу інградієнтів, типи часу інградієнтів, дайси і тд, але ці теги вставляються вручну, при створенні описа майстром новгого зілля, і видимі лише в режимі редагування
*  у звичайному режимі вони показують час і кубики.
*
*
* */


const MAX_INGREDIENTS = 4
const MAX_UNGRIND = 3

const STATION_DIFFICULTY_BENEFIT = 1

const DISTILLATION_DIFFICULTY = 5

export {
    FIELD_INSTRUMENTS,
    STATION,
    BASES,
    INGREDIENT_RARITIES,
    GROUND_INGREDIENT_MULTIPLIER,
    POTION_INITIAL_DIFFICULTY,
    LIMIT_DIFFICULTY_IN_FIELD_INSTRUMENTS,
    MEASURE_DICE,
    MEASURE_TIME,
    TIME_UNIT_ROUND,
    TIME_UNIT_MINUTE,
    TIME_UNIT_HOUR,
    TIME_UNIT_DAY,
    TIME_UNIT_WEEK,
    TIME_UNIT_MONTH,
    TIME_UNIT_YEAR,
    TIME_UNIT_PERMANENT,
    MOCK_INGREDIENTS,
    BREWED_POTIONS,
    MAX_INGREDIENTS,
    GROUND_INGREDIENT_ADDITION_TO_DIFFICULTY,
    STATION_DIFFICULTY_BENEFIT,
    MAX_UNGRIND,
    DISTILLATION_DIFFICULTY,
    DISTILLED_MULTIPLIER,
    TIME_UNITS_ORDER,
    TIME_UNIT_LABELS,
    TIME_UNIT_PERMANENT_LABEL
}
