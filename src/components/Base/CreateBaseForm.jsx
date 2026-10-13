import Input from "../shared/input/Input.jsx"
import Button from "../shared/button/Button.jsx"
import {useActionState} from "react"

import styles from "./base.module.css"
import {usePotionComponents} from "../../hooks/usePotionComponents.js"

const initialState = {
    name: null,
    alchemicalWord: null,
    difficulty: 1,
    symbol: null,
    error: null,
}

export default function CreateBaseForm({prefilledBaseName, existingBaseId = null, onSuccessfulSave}) {
    const {bases, addOrEditBase} = usePotionComponents()

    async function reducerAction(previousState, formData) {
        const name = formData.get("name").trim()
        const alchemicalWord = formData.get("alchemicalWord").trim()
        const difficulty = +formData.get("difficulty")
        const symbol = formData.get("symbol") || null

        const formObj = {name, alchemicalWord, difficulty, symbol, error: null}

        if (!name) {
            return {...formObj, error: "Назва Основи є обов'язковим полем"}
        }

        if (!alchemicalWord) {
            return {...formObj, error: "Алхімічне слово є обов'язковим полем"}
        }

        if (!difficulty || difficulty <= 0) {
            return {
                ...formObj,
                difficulty: difficulty <= 0 ? 1 : difficulty,
                error: "Складність є обов'язковим полем і не може бути меншим за 1",
            }
        }

        if (!existingBaseId) {
            const isNameTaken = bases.some(base => base.name.toLowerCase().trim() === name.toLowerCase())

            if (isNameTaken) return {...formObj, error: "Основа з подібною назвою вже існує"}

            const isAlchemicalWordTaken = bases.some(
                base => base.alchemicalWord.toLowerCase().trim() === alchemicalWord.toLowerCase(),
            )

            if (isAlchemicalWordTaken) return {...formObj, error: "Основа з подібним Алхімічним словом вже існує"}
        }

        try {
            await addOrEditBase(formObj)
            onSuccessfulSave()
            return formObj
        } catch (err) {
            return {...formObj, error: err.message || "Unexpected error occurred"}
        }
    }

    const [{name, alchemicalWord, difficulty, symbol, error}, dispatchAction, isPending] = useActionState(
        reducerAction,
        initialState,
    )

    return (
        <form className={styles.Form} action={dispatchAction}>
            <Input label="Назва Основи" name="name" defaultValue={name ?? prefilledBaseName} />
            <Input label="Алхімічне слово" name="alchemicalWord" defaultValue={alchemicalWord ?? ""} />
            <Input label="Складність" name="difficulty" type="number" defaultValue={difficulty} />
            <Input label="Символ для бекграунду (необов'язково)" name="symbol" defaultValue={symbol ?? ""} />

            <p className={styles.Error} role="alert">
                {error}
            </p>

            <Button type="submit" disabled={isPending}>
                {isPending ? "Створення..." : "Створити Основу"}
            </Button>
        </form>
    )
}
