import styles from "./alchemical-result.module.css"
import {usePotionBrew} from "../../contexts/PotionBrewContext.jsx"
import IngredientEffect from "./IngredientEffect.jsx"
import PotionDescription from "./PotionDescription.jsx"
import CarvedFrame, {CarvedDivider} from "./CarvedFrame.jsx"
import {flushSync} from "react-dom"
import {useRef} from "react"

export default function AlchemicalResult() {
    const {base, ingredientEffects, potionEdit, changePotionEdit} = usePotionBrew()
    const textareaRef = useRef(null)
    const isEditing = potionEdit !== null

    function handleInsertTag(effect) {
        const textarea = textareaRef.current
        if (!textarea) return

        const tag = `%${effect.ingredient.alchemicalWord}%`
        const text = potionEdit.description

        const start = textarea.selectionStart
        const end = textarea.selectionEnd

        const newText = text.slice(0, start) + tag + text.slice(end)

        flushSync(() => {
            changePotionEdit({description: newText})
        })

        const cursorPosition = start + tag.length
        textarea.focus()

        textarea.setSelectionRange(cursorPosition, cursorPosition)
    }

    return (
        <div className={styles.AlchemicalResult}>
            <ul className={styles.IngredientsEffects}>
                {base && <li>"{base.alchemicalWord}"</li>}
                {/* Один рядок — один унікальний інгредієнт: однакові слоти вже складені разом */}
                {ingredientEffects.map(effect => (
                    <IngredientEffect
                        key={effect.ingredient.id}
                        canInsert={isEditing}
                        effect={effect}
                        onInsertTag={handleInsertTag}
                    />
                ))}
            </ul>
            <CarvedDivider className={styles.Divider} />
            <PotionDescription textareaRef={textareaRef} />
            <CarvedFrame />
        </div>
    )
}
