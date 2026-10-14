import {formatIngredientEffect} from "./ingredient-effects.js"

/*
 *  Tags are stored as %ing:ID% (survives renaming the alchemical word) and edited as %AlchemicalWord%.
 *  A tag always resolves: a description is shown only for a potion with the same set of unique ingredients.
 * */
const STORED_TAG = /(%ing:[^%]+%)/
const STORED_TAG_ID = /^%ing:([^%]+)%$/

function findEffectById(ingredientEffects, id) {
    return ingredientEffects.find(effect => String(effect.ingredient.id) === id)
}

// %ing:2% → %Cold%
export function toEditableDescription(description, ingredientEffects) {
    return description.replace(new RegExp(STORED_TAG, "g"), tag => {
        const [, id] = tag.match(STORED_TAG_ID)
        const effect = findEffectById(ingredientEffects, id)

        return effect ? `%${effect.ingredient.alchemicalWord}%` : tag
    })
}

// %Cold% → %ing:2%. Only known words are replaced, so "50% and 20%" in the text is untouched
export function toStoredDescription(text, ingredientEffects) {
    return ingredientEffects.reduce(
        (result, {ingredient}) => result.replaceAll(`%${ingredient.alchemicalWord}%`, `%ing:${ingredient.id}%`),
        text,
    )
}

/*
 *  A typo (%Cld%) or a word from another potion won't be substituted and stays in the text as is.
 *  A tag starts with a letter, so "50% damage and 20%" or "50%, %Cold%" give no false tags.
 * */
const EDITABLE_TAG = /%(\p{L}[^%]*?)%/gu

export function findUnknownTags(text, ingredientEffects) {
    const knownWords = new Set(ingredientEffects.map(effect => effect.ingredient.alchemicalWord))
    const unknownTags = [...text.matchAll(EDITABLE_TAG)].filter(([, word]) => !knownWords.has(word)).map(([tag]) => tag)

    return [...new Set(unknownTags)]
}

/*
 *  Parts for rendering as plain JSX text (no dangerouslySetInnerHTML), e.g.
 *  [{text: 'For '}, {value: '20 minutes'}, {text: ' the creature…'}]. Unknown tags are shown as is.
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
