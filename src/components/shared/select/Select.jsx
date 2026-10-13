import {useRef, useState} from "react"
import {Combobox} from "@base-ui/react/combobox"
import styles from "./select.module.css"

/*
 *  Пункт «+ Додати…» — справжній пункт списку: до нього можна дійти стрілками й вибрати Enter.
 *  Але це маркер, а не значення: при виборі викликаємо onCreate, а value селекта не змінюється.
 * */
const CREATE_ITEM = {id: Symbol("create")}

export default function Select({
    items,
    value,
    onSelectChange,
    searchKeys = ["name"],
    additionalDisplayKeys = [],
    searchable = true,
    objectSelect = null,
    createLabel = "",
    onCreate = null,
}) {
    const {contains} = Combobox.useFilter({sensitivity: "base"}) // 'base' = без урахування регістру
    const [query, setQuery] = useState("")
    const trimmedQuery = query.trim()
    // Запит, з яким натиснули «Додати»; null — створення не очікується. Ref, бо на рендер не впливає
    const pendingCreateRef = useRef(null)

    // Маркер «Додати» — завжди останній і завжди проходить фільтр пошуку
    const allItems = onCreate ? [...items, CREATE_ITEM] : items

    function filterItem(item, query) {
        if (item === CREATE_ITEM) return true

        return searchKeys.some(key => contains(item, query, i => String(i[key] ?? "")))
    }

    function getAdditionalText(item) {
        return additionalDisplayKeys
            .map(key => item[key])
            .filter(itemValue => itemValue !== null && itemValue !== undefined && itemValue !== "")
            .join(" · ")
    }

    function handleValueChange(newValue) {
        if (newValue === CREATE_ITEM) {
            pendingCreateRef.current = trimmedQuery
            return
        }

        onSelectChange(newValue)
    }

    /*
     *  onCreate — лише коли список повністю закрився (анімація завершилась).
     *  Якщо відкрити модалку раніше, вона блокує сторінку посеред закриття списку,
     *  і селект «застрягає»: після закриття модалки він більше не відкривається.
     *  Введене в пошук передаємо далі — форма створення підставить його як назву.
     * */
    function handleOpenChangeComplete(isOpen) {
        if (isOpen || pendingCreateRef.current === null) return

        const createQuery = pendingCreateRef.current
        pendingCreateRef.current = null
        onCreate(createQuery)
    }

    return (
        <Combobox.Root
            onInputValueChange={setQuery}
            value={value}
            onValueChange={handleValueChange}
            onOpenChangeComplete={handleOpenChangeComplete}
            itemToStringLabel={item => item.name ?? createLabel}
            isItemEqualToValue={(item, value) => item.id === value.id}
            items={allItems}
            filter={searchable ? filterItem : null}
        >
            <Combobox.Trigger className={styles.Trigger}>
                <span className={styles.ValueText}>
                    <Combobox.Value placeholder={`Оберіть${objectSelect ? " " + objectSelect : "..."}`} />
                </span>
                <Combobox.Icon className={styles.Icon}>
                    <ChevronIcon />
                </Combobox.Icon>
            </Combobox.Trigger>

            <Combobox.Portal>
                <Combobox.Positioner className={styles.Positioner} sideOffset={6}>
                    <Combobox.Popup className={styles.Popup}>
                        {searchable && (
                            <div className={styles.SearchWrapper}>
                                <Combobox.Input className={styles.Search} placeholder="Пошук..." />
                            </div>
                        )}

                        <Combobox.Empty className={styles.Empty}>Нічого не знайдено</Combobox.Empty>

                        <Combobox.List className={styles.List}>
                            {item => {
                                if (item === CREATE_ITEM) {
                                    return (
                                        <Combobox.Item key="create" value={item} className={styles.Create}>
                                            <span aria-hidden="true">+</span>
                                            <span className={styles.CreateText}>
                                                {createLabel}
                                                {trimmedQuery && (
                                                    <span className={styles.CreateQuery}> «{trimmedQuery}»</span>
                                                )}
                                            </span>
                                        </Combobox.Item>
                                    )
                                }

                                const additionalText = getAdditionalText(item)

                                return (
                                    <Combobox.Item key={item.id} value={item} className={styles.Item}>
                                        <Combobox.ItemIndicator className={styles.ItemIndicator}>
                                            <CheckIcon />
                                        </Combobox.ItemIndicator>
                                        <span className={styles.ItemText}>
                                            {item.name}
                                            {additionalText && (
                                                <span className={styles.ItemAdditional}>{additionalText}</span>
                                            )}
                                        </span>
                                    </Combobox.Item>
                                )
                            }}
                        </Combobox.List>
                    </Combobox.Popup>
                </Combobox.Positioner>
            </Combobox.Portal>
        </Combobox.Root>
    )
}

function ChevronIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
                d="M2.5 4.5L6 8L9.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function CheckIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
                d="M2 6.5L4.75 9L10 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
