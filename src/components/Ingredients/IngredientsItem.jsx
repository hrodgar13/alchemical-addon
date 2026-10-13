import {useState} from "react"
import styles from "./ingredients.module.css"
import Select from "../shared/select/Select.jsx"
import Checkbox from "../shared/checkbox/Checkbox.jsx"
import Modal from "../shared/modal/Modal.jsx"
import {PencilIcon} from "../shared/icons/Icons.jsx"
import {usePotionComponents} from "../../hooks/usePotionComponents.js"
import Button from "../shared/button/Button"
import IngredientForm from "./IngredientForm.jsx"

function IngredientsItem({
    ingredientCombination,
    position,
    disabled = false,
    isGroundLocked = false,
    onEditIngredient,
    onRemoveIngredient,
}) {
    const {ingredients, ingredientRarities} = usePotionComponents()
    const selectedIngredient = ingredientCombination.ingredient
    const [isModalOpen, setIsModalOpen] = useState(false)
    // Що показує вікно: null — створення нового інгредієнта, об'єкт — редагування цього
    const [editableIngredient, setEditableIngredient] = useState(null)
    const [prefilledName, setPrefilledName] = useState("")

    function handleEditIngredient(key, value) {
        onEditIngredient({...ingredientCombination, [key]: value})
    }

    function openCreateModal(query) {
        setEditableIngredient(null)
        setPrefilledName(query)
        setIsModalOpen(true)
    }

    function openEditModal() {
        setEditableIngredient(selectedIngredient)
        setIsModalOpen(true)
    }

    // Скидаємо, коли вікно вже зникло: інакше заголовок і кнопка змінились би посеред анімації
    function handleModalOpenChangeComplete(isOpen) {
        if (isOpen) return

        setEditableIngredient(null)
        setPrefilledName("")
    }

    // Новий інгредієнт одразу ставимо в цей слот. Відредагований — не треба:
    // рецепт тримає лише id і сам бачить нові дані
    function handleSaved(savedIngredient) {
        if (!editableIngredient) handleEditIngredient("ingredient", savedIngredient)

        setIsModalOpen(false)
    }

    return (
        <div className={`${styles.IngredientsItem} ${disabled ? styles.DisabledIngredient : ""}`}>
            <div className={`${styles.IngredientsItemHeader}`}>
                <h3 className={styles.IngredientTitle}>Інградієнт {position}</h3>
                <div>
                    <Button onClick={() => onRemoveIngredient(ingredientCombination.ingredientCombinationId)}>x</Button>
                </div>
            </div>
            <div>
                <h4 className={styles.subHeaderH4}>Інградієнт</h4>
                <div className={styles.SelectRow}>
                    <Select
                        value={selectedIngredient}
                        items={ingredients}
                        searchKeys={["name", "alchemicalWord"]}
                        additionalDisplayKeys={["alchemicalWord"]}
                        onSelectChange={value => handleEditIngredient("ingredient", value)}
                        objectSelect={"Інградієнт"}
                        createLabel="Додати Інгредієнт"
                        onCreate={openCreateModal}
                    />
                    {selectedIngredient && (
                        <Button
                            onClick={openEditModal}
                            aria-label={`Редагувати Інгредієнт «${selectedIngredient.name}»`}
                        >
                            <PencilIcon />
                        </Button>
                    )}
                </div>
            </div>
            <div>
                <h4>Рідкість</h4>
                <Select
                    value={ingredientCombination.rarity}
                    items={ingredientRarities}
                    searchKeys={["name"]}
                    onSelectChange={value => handleEditIngredient("rarity", value)}
                    objectSelect={"Рідкість"}
                />
            </div>

            <Checkbox
                checked={ingredientCombination.ground}
                label={"Перетираємо?"}
                disabled={isGroundLocked}
                onCheckedChange={value => handleEditIngredient("ground", value)}
            />
            {isGroundLocked && (
                <p className={styles.Hint}>
                    З 4 інгредієнтами всі мають бути перетерті. Щоб змінити — спочатку видаліть 4-й.
                </p>
            )}

            <Modal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onOpenChangeComplete={handleModalOpenChangeComplete}
                title={editableIngredient ? "Редагувати Інгредієнт" : "Новий Інгредієнт"}
                description="Інгредієнт — одне алхімічне слово в реченні зілля"
            >
                {/* key — інший інгредієнт означає нову форму: useActionState бере початковий стан лише при монтуванні */}
                <IngredientForm
                    key={editableIngredient?.id ?? "new"}
                    prefilledName={prefilledName}
                    existingIngredient={editableIngredient}
                    onSaved={handleSaved}
                />
            </Modal>
        </div>
    )
}

export default IngredientsItem
