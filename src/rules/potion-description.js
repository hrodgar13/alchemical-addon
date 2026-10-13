import {formatIngredientEffect} from "./ingredient-effects.js"

/*
 *  Шаблон опису зілля з тегами інгредієнтів.
 *
 *  У даних тег посилається на id: %ing:2% — не ламається, якщо ГМ змінить алхімічне слово.
 *  У редакторі ГМ бачить і пише слово: %Холод% — читабельно.
 *  У звичайному режимі на місці тегу — ефект з поточного рецепту: «4к10 + 1к12», «20 хвилин».
 *
 *  Тег завжди знаходить значення: опис показується лише для зілля з тим самим набором
 *  унікальних інгредієнтів, змінюється тільки їх кількість і якість.
 * */
const STORED_TAG = /(%ing:[^%]+%)/
const STORED_TAG_ID = /^%ing:([^%]+)%$/

function findEffectById(ingredientEffects, id) {
    return ingredientEffects.find(effect => String(effect.ingredient.id) === id)
}

// %ing:2% → %Холод%
export function toEditableDescription(description, ingredientEffects) {
    return description.replace(new RegExp(STORED_TAG, "g"), tag => {
        const [, id] = tag.match(STORED_TAG_ID)
        const effect = findEffectById(ingredientEffects, id)

        return effect ? `%${effect.ingredient.alchemicalWord}%` : tag
    })
}

// %Холод% → %ing:2%. Шукаємо лише відомі слова, тож «50% і 20%» у тексті не зачепить
export function toStoredDescription(text, ingredientEffects) {
    return ingredientEffects.reduce(
        (result, {ingredient}) => result.replaceAll(`%${ingredient.alchemicalWord}%`, `%ing:${ingredient.id}%`),
        text,
    )
}

/*
 *  Теги в тексті редактора, яких немає серед інгредієнтів цього зілля: опечатка (%Холд%)
 *  або слово з іншого зілля. Такий тег не підставиться і лишиться в описі як є.
 *  Тег починається з літери — тож «50% шкоди і 20%» чи «50%, %Холод%» не дають хибних тегів.
 * */
const EDITABLE_TAG = /%(\p{L}[^%]*?)%/gu

export function findUnknownTags(text, ingredientEffects) {
    const knownWords = new Set(ingredientEffects.map(effect => effect.ingredient.alchemicalWord))
    const unknownTags = [...text.matchAll(EDITABLE_TAG)].filter(([, word]) => !knownWords.has(word)).map(([tag]) => tag)

    return [...new Set(unknownTags)]
}

/*
 *  Розбиває шаблон на частини для рендеру як текст у JSX (без dangerouslySetInnerHTML):
 *  [{text: 'Випивши зілля, істота протягом '}, {value: '20 хвилин'}, {text: ' завдає…'}]
 *  split з capture-групою лишає теги в масиві. Невідомий тег показується як є.
 * */
export function parseDescription(description, ingredientEffects) {
    return description
        .split(STORED_TAG)
        .filter(part => part !== "")
        .map(part => {
            const [, id] = part.match(STORED_TAG_ID) ?? []
            const effect = id && findEffectById(ingredientEffects, id)

            return effect ? {value: formatIngredientEffect(effect)} : {text: part}
        })
}
