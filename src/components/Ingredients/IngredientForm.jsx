import {useActionState, useState} from "react"
import Input from "../shared/input/Input.jsx"
import Button from "../shared/button/Button.jsx"
import Select from "../shared/select/Select.jsx"
import {usePotionComponents} from "../../hooks/usePotionComponents.js"
import {
    MEASURE_DICE,
    MEASURE_TIME,
    TIME_UNIT_LABELS,
    TIME_UNIT_PERMANENT,
    TIME_UNITS_ORDER,
} from "../../static/static.js"

import styles from "./ingredients.module.css"

const MEASURE_OPTIONS = [
    {id: MEASURE_DICE, name: "Кубики", hint: "к6 · к8 · к10 · к12"},
    {id: MEASURE_TIME, name: "Час", hint: "тривалість"},
]

// «Перманентно» — не стартова одиниця, а результат стрибка дистиляції вище року
const TIME_UNIT_OPTIONS = TIME_UNITS_ORDER.filter(unit => unit !== TIME_UNIT_PERMANENT).map(unit => {
    const label = TIME_UNIT_LABELS[unit].few

    return {id: unit, name: label[0].toUpperCase() + label.slice(1)}
})

const normalize = text => text.trim().toLowerCase()

const findOption = (options, id) => options.find(option => option.id === id)

/*
 *  Форма створення й редагування інгредієнта — як BaseForm.
 *  Тип ефекту й одиниця часу — керовані селекти: від типу залежить, чи показувати одиницю.
 *  Значення обох потрапляють у FormData через name.
 * */
export default function IngredientForm({prefilledName = "", existingIngredient = null, onSaved}) {
    const {ingredients, addOrEditIngredient} = usePotionComponents()
    const [measureOption, setMeasureOption] = useState(
        () => findOption(MEASURE_OPTIONS, existingIngredient?.effect_measures_in) ?? MEASURE_OPTIONS[0],
    )
    const [timeUnitOption, setTimeUnitOption] = useState(
        () => findOption(TIME_UNIT_OPTIONS, existingIngredient?.time_units) ?? TIME_UNIT_OPTIONS[0],
    )

    const isTimeMeasure = measureOption.id === MEASURE_TIME

    // Дублікати шукаємо серед інших інгредієнтів — редагований не конфліктує сам з собою
    const otherIngredients = ingredients.filter(ingredient => ingredient.id !== existingIngredient?.id)

    async function saveIngredientAction(previousState, formData) {
        const name = formData.get("name").trim()
        const alchemicalWord = formData.get("alchemicalWord").trim()
        const difficulty = Number(formData.get("difficulty"))
        const description = formData.get("description").trim()
        const effectMeasuresIn = formData.get("effect_measures_in")
        // Поле одиниці є у формі лише для часових — для кубикових get() поверне null
        const timeUnits = effectMeasuresIn === MEASURE_TIME ? formData.get("time_units") : null

        const values = {name, alchemicalWord, difficulty, description}

        if (!name) return {values, error: "Назва Інгредієнта є обов'язковим полем"}

        if (!alchemicalWord) return {values, error: "Алхімічне слово є обов'язковим полем"}

        if (!Number.isInteger(difficulty) || difficulty < 1) {
            return {values, error: "Складність має бути цілим числом, не меншим за 1"}
        }

        if (effectMeasuresIn === MEASURE_TIME && !timeUnits) {
            return {values, error: "Оберіть одиницю часу для часового ефекту"}
        }

        if (otherIngredients.some(ingredient => normalize(ingredient.name) === normalize(name))) {
            return {values, error: "Інгредієнт з такою назвою вже існує"}
        }

        // Алхімічне слово — це тег %Слово% в описах зіль, тож воно мусить бути унікальним
        if (otherIngredients.some(ingredient => normalize(ingredient.alchemicalWord) === normalize(alchemicalWord))) {
            return {values, error: "Інгредієнт з таким Алхімічним словом вже існує"}
        }

        try {
            // existingIngredient дає id і поля, яких форма не знає, — вони не загубляться при редагуванні
            const savedIngredient = await addOrEditIngredient({
                ...existingIngredient,
                name,
                alchemicalWord,
                difficulty,
                effect_measures_in: effectMeasuresIn,
                time_units: timeUnits,
                description,
            })
            onSaved(savedIngredient)
            return {values, error: null}
        } catch (err) {
            return {values, error: err.message || "Не вдалося зберегти Інгредієнт"}
        }
    }

    const [{values, error}, saveIngredient, isPending] = useActionState(saveIngredientAction, {
        values: {
            name: existingIngredient?.name ?? prefilledName,
            alchemicalWord: existingIngredient?.alchemicalWord ?? "",
            difficulty: existingIngredient?.difficulty ?? 1,
            description: existingIngredient?.description ?? "",
        },
        error: null,
    })

    const [submitLabel, pendingLabel] = existingIngredient
        ? ["Зберегти Інгредієнт", "Збереження..."]
        : ["Створити Інгредієнт", "Створення..."]

    return (
        <form className={styles.Form} action={saveIngredient}>
            <Input label="Назва Інгредієнта" name="name" defaultValue={values.name} />
            <Input label="Алхімічне слово" name="alchemicalWord" defaultValue={values.alchemicalWord} />
            <Input
                label="Складність"
                name="difficulty"
                type="number"
                min={1}
                step={1}
                defaultValue={values.difficulty}
            />

            <div className={styles.FormRow}>
                <Select
                    label="Ефект вимірюється в"
                    name="effect_measures_in"
                    items={MEASURE_OPTIONS}
                    additionalDisplayKeys={["hint"]}
                    searchable={false}
                    value={measureOption}
                    onSelectChange={setMeasureOption}
                />
                {isTimeMeasure && (
                    <Select
                        label="Одиниця часу"
                        name="time_units"
                        items={TIME_UNIT_OPTIONS}
                        searchable={false}
                        value={timeUnitOption}
                        onSelectChange={setTimeUnitOption}
                    />
                )}
            </div>

            <Input label="Опис (необов'язково)" name="description" multiline defaultValue={values.description} />

            <p className={styles.Error} role="alert">
                {error}
            </p>

            <Button type="submit" disabled={isPending}>
                {isPending ? pendingLabel : submitLabel}
            </Button>
        </form>
    )
}
