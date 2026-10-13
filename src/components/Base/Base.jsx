import {usePotionComponents} from "../../hooks/usePotionComponents.js"
import Select from "../shared/select/Select.jsx"
import styles from "./base.module.css"
import {usePotionBrew} from "../../hooks/usePotionBrew.js"
import BaseSymbol from "./BaseSymbol.jsx"
import {useState} from "react"
import Modal from "../shared/modal/Modal.jsx"
import CreateBaseForm from "./CreateBaseForm.jsx"

export default function Base() {
    const {bases} = usePotionComponents()
    const {base, setBase} = usePotionBrew()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [createPrefillQuery, setCreatePrefillQuery] = useState(null)

    function handleOnChange(newBase) {
        setBase(newBase)
    }

    function openCreateBaseModal(query) {
        setCreatePrefillQuery(query)
        setIsModalOpen(true)
    }

    function handleSuccessfulSave() {
        setIsModalOpen(false)
    }

    return (
        <div className={styles.Base}>
            <BaseSymbol base={base} className={styles.Symbol} />
            <h2>Оберіть Основу</h2>
            <Select
                items={bases}
                searchKeys={["name", "alchemicalWord"]}
                additionalDisplayKeys={["alchemicalWord"]}
                onSelectChange={handleOnChange}
                value={base}
                createLabel="Додати Основу"
                onCreate={openCreateBaseModal}
            />
            <Modal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                title="Нова основа"
                description="Основа задає дію зіллю"
            >
                <CreateBaseForm prefilledBaseName={createPrefillQuery} onSuccessfulSave={handleSuccessfulSave} />
            </Modal>
        </div>
    )
}
