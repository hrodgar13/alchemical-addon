const FIELD_INSTRUMENTS = 'fieldInstruments'
const STATION = 'station'

const BASES = [
    {
        id: 1,
        name: 'Вода',
        alchemicalWord: 'Дати',
        difficulty: 1
    },
    {
        id: 2,
        name: 'Спирт',
        alchemicalWord: 'Забрати',
        difficulty: 2
    },
    {
        id: 3,
        name: 'Олія',
        alchemicalWord: 'Нанести',
        difficulty: 2
    },
    {
        id: 4,
        name: 'Вино',
        alchemicalWord: 'Змінити',
        difficulty: 3
    }
]

const INGREDIENT_RARITIES = [
    {
        id: 1,
        rarity_name: 'Середня',
        difficulty: 0,
        dice_of_effect: 'к6',
        ground_dice_of_effect: 'к4',
        time_units_amount: 1
    },
    {
        id: 2,
        rarity_name: 'Хороша',
        difficulty: 1,
        dice_of_effect: 'к8',
        ground_dice_of_effect: 'к6',
        time_units_amount: 2
    },
    {
        id: 3,
        rarity_name: 'Нейморвірна',
        difficulty: 2,
        dice_of_effect: 'к10',
        ground_dice_of_effect: 'к8',
        time_units_amount: 4
    },
    {
        id: 4,
        rarity_name: 'Легендарна',
        difficulty: 3,
        dice_of_effect: 'к12',
        ground_dice_of_effect: 'к10',
        time_units_amount: 8
    }
]

const GROUND_INGREDIENT_DICE_AMOUNT = 2
const POTION_BASE_DIFFICULTY = 8
const LIMIT_DIFFICULTY_IN_FIELD_INSTRUMENTS = 25

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
*  If add 4th grinded ingredient, instead of doubling the amount of time, the potion will jump on higher time unit instead.
*
*  Наприклад, якщо взяти 3 Легендарні кігті ведмедя, перемолоти, - то час дії зілля буде: 8 * 2 + 8 * 2 + 8 * 2 = 48 хвилинам
*
*  Та якщо додати 4й кіготь - то зілля буде працбвати: 8 + 8 + 8 + 8 = 32 години
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
        description: 'Еффект: Випивши зілля, істота на %TIME_AMOUNT% %TIME_MEASURE% завдає додаткові %DICES% шкоди Холодом заклинаннями, які наносять шкоду Холодом.',
        ingredientsIds: [3, 2],
        baseId: 1
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

export {
    FIELD_INSTRUMENTS,
    STATION,
    BASES,
    INGREDIENT_RARITIES,
    GROUND_INGREDIENT_DICE_AMOUNT,
    POTION_BASE_DIFFICULTY,
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
    BREWED_POTIONS
}
