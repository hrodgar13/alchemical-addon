import {useState} from "react"
import {usePotionComponents} from "../../hooks/usePotionComponents.js"
import {usePotionBrew} from "../../hooks/usePotionBrew.js"
import Select from "../shared/select/Select.jsx"
import Button from "../shared/button/Button.jsx"
import Modal from "../shared/modal/Modal.jsx"
import {PencilIcon} from "../shared/icons/Icons.jsx"
import BaseSymbol from "./BaseSymbol.jsx"
import BaseForm from "./BaseForm.jsx"

import styles from "./base.module.css"

export default function Base() {
    const {bases} = usePotionComponents()
    const {base, setBase} = usePotionBrew()
    const [isModalOpen, setIsModalOpen] = useState(false)
    // Що показує вікно: null — створення нової основи, об'єкт — редагування цієї
    const [editableBase, setEditableBase] = useState(null)
    const [prefilledName, setPrefilledName] = useState("")

    function openCreateModal(query) {
        setEditableBase(null)
        setPrefilledName(query)
        setIsModalOpen(true)
    }

    function openEditModal() {
        setEditableBase(base)
        setIsModalOpen(true)
    }

    // Скидаємо, коли вікно вже зникло: інакше заголовок і кнопка змінились би посеред анімації
    function handleModalOpenChangeComplete(isOpen) {
        if (isOpen) return

        setEditableBase(null)
        setPrefilledName("")
    }

    // Нову основу одразу обираємо — її ж для цього й створювали.
    // Відредаговану обирати не треба: рецепт тримає лише id і сам бачить нові дані
    function handleSaved(savedBase) {
        if (!editableBase) setBase(savedBase)

        setIsModalOpen(false)
    }

    return (
        <div className={styles.Base}>
            <BaseSymbol base={base} className={styles.Symbol} />
            <h2>Оберіть Основу</h2>
            <div className={styles.SelectRow}>
                <Select
                    items={bases}
                    searchKeys={["name", "alchemicalWord"]}
                    additionalDisplayKeys={["alchemicalWord"]}
                    onSelectChange={setBase}
                    value={base}
                    createLabel="Додати Основу"
                    onCreate={openCreateModal}
                />
                {base && (
                    <Button onClick={openEditModal} aria-label={`Редагувати Основу «${base.name}»`}>
                        <PencilIcon />
                    </Button>
                )}
            </div>
            <Modal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onOpenChangeComplete={handleModalOpenChangeComplete}
                title={editableBase ? "Редагувати Основу" : "Нова Основа"}
                description="Основа задає дію зіллю"
            >
                {/* key — інша основа означає нову форму: useActionState бере початковий стан лише при монтуванні */}
                <BaseForm
                    key={editableBase?.id ?? "new"}
                    prefilledName={prefilledName}
                    existingBase={editableBase}
                    onSaved={handleSaved}
                />
            </Modal>
        </div>
    )
}
