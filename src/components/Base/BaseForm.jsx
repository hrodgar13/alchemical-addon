import {useActionState, useState} from "react"
import Input from "../shared/input/Input.jsx"
import Button from "../shared/button/Button.jsx"
import Select from "../shared/select/Select.jsx"
import {BASE_SYMBOL_OPTIONS} from "./base-symbols.jsx"
import {usePotionComponents} from "../../hooks/usePotionComponents.js"

import styles from "./base.module.css"

const NO_SYMBOL = {id: null, name: "Без символу"}
const SYMBOL_OPTIONS = [NO_SYMBOL, ...BASE_SYMBOL_OPTIONS]

const normalize = text => text.trim().toLowerCase()

/*
 *  Форма створення й редагування основи: без existingBase — нова, з ним — редагування.
 *  Стан дії — це значення полів, а не сама основа: після сабміту React 19 скидає форму,
 *  і defaultValue з цього стану повертає введене (напр. при помилці валідації).
 * */
export default function BaseForm({prefilledName = "", existingBase = null, onSaved}) {
    const {bases, addOrEditBase} = usePotionComponents()
    // Символ — керований селект: Combobox сам кладе значення в FormData через name
    const [symbolOption, setSymbolOption] = useState(
        () => SYMBOL_OPTIONS.find(option => option.id === existingBase?.symbol) ?? NO_SYMBOL,
    )

    // Дублікати шукаємо серед інших основ — редагована не конфліктує сама з собою
    const otherBases = bases.filter(base => base.id !== existingBase?.id)

    async function saveBaseAction(previousState, formData) {
        const name = formData.get("name").trim()
        const alchemicalWord = formData.get("alchemicalWord").trim()
        const difficulty = Number(formData.get("difficulty"))
        const symbol = formData.get("symbol") || null

        const values = {name, alchemicalWord, difficulty}

        if (!name) return {values, error: "Назва Основи є обов'язковим полем"}

        if (!alchemicalWord) return {values, error: "Алхімічне слово є обов'язковим полем"}

        if (!Number.isInteger(difficulty) || difficulty < 1) {
            return {values, error: "Складність має бути цілим числом, не меншим за 1"}
        }

        if (otherBases.some(base => normalize(base.name) === normalize(name))) {
            return {values, error: "Основа з такою назвою вже існує"}
        }

        if (otherBases.some(base => normalize(base.alchemicalWord) === normalize(alchemicalWord))) {
            return {values, error: "Основа з таким Алхімічним словом вже існує"}
        }

        try {
            // existingBase дає id і поля, яких форма не знає, — вони не загубляться при редагуванні
            const savedBase = await addOrEditBase({...existingBase, name, alchemicalWord, difficulty, symbol})
            onSaved(savedBase)
            return {values, error: null}
        } catch (err) {
            return {values, error: err.message || "Не вдалося зберегти Основу"}
        }
    }

    const [{values, error}, saveBase, isPending] = useActionState(saveBaseAction, {
        values: {
            name: existingBase?.name ?? prefilledName,
            alchemicalWord: existingBase?.alchemicalWord ?? "",
            difficulty: existingBase?.difficulty ?? 1,
        },
        error: null,
    })

    const [submitLabel, pendingLabel] = existingBase
        ? ["Зберегти Основу", "Збереження..."]
        : ["Створити Основу", "Створення..."]

    return (
        <form className={styles.Form} action={saveBase}>
            <Input label="Назва Основи" name="name" defaultValue={values.name} />
            <Input label="Алхімічне слово" name="alchemicalWord" defaultValue={values.alchemicalWord} />
            <Input
                label="Складність"
                name="difficulty"
                type="number"
                min={1}
                step={1}
                defaultValue={values.difficulty}
            />
            <Select
                label="Символ для фону"
                name="symbol"
                items={SYMBOL_OPTIONS}
                additionalDisplayKeys={["rune"]}
                searchable={false}
                value={symbolOption}
                onSelectChange={setSymbolOption}
            />

            <p className={styles.Error} role="alert">
                {error}
            </p>

            <Button type="submit" disabled={isPending}>
                {isPending ? pendingLabel : submitLabel}
            </Button>
        </form>
    )
}
