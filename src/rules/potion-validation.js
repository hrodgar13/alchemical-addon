import {FIELD_INSTRUMENTS, LIMIT_DIFFICULTY_IN_FIELD_INSTRUMENTS} from "../static/static.js"

export default function PotionValidation(difficulty, whereWeCook, base, ingredients) {
    if (!base) return "Оберіть основу зілля"
    if (!ingredients || !ingredients.length) return "Додайте хоча б один інгредієнт"

    const isIngredientsCompeted = ingredients.every(item => item.ingredient !== null)

    if (!isIngredientsCompeted) return "Не всі інгредієнти обрано. Перевірте, чи вибрано інгредієнт у кожному слоті"

    if (whereWeCook === FIELD_INSTRUMENTS && difficulty >= LIMIT_DIFFICULTY_IN_FIELD_INSTRUMENTS) {
        return `Складність завелика для похідного набору! У ньому можна зварити лише зілля зі складністю, меншою за ${LIMIT_DIFFICULTY_IN_FIELD_INSTRUMENTS}. Для складніших потрібна лабораторія`
    }

    return null
}
