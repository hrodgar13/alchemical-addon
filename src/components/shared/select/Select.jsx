import {Combobox} from '@base-ui/react/combobox'
import styles from './select.module.css'


export default function Select({
    items,
    value,
    onSelectChange,
    searchKeys = ['name'],
    additionalDisplayKeys = [],
    searchable = true,
}) {
    const {contains} = Combobox.useFilter({sensitivity: 'base'}) // 'base' = без урахування регістру

    function filterItem(item, query) {
        return searchKeys.some(key => contains(item, query, i => String(i[key] ?? '')))
    }

    function getAdditionalText(item) {
        return additionalDisplayKeys
            .map(key => item[key])
            .filter(itemValue => itemValue !== null && itemValue !== undefined && itemValue !== '')
            .join(' · ')
    }

    return (
        <Combobox.Root
            value={value}
            onValueChange={onSelectChange}
            itemToStringLabel={item => item.name}
            isItemEqualToValue={(item, value) => item.id === value.id}
            items={items}
            filter={searchable ? filterItem : null}
        >
            <Combobox.Trigger className={styles.Trigger}>
                <Combobox.Value placeholder="Оберіть..."/>
                <Combobox.Icon className={styles.Icon}>
                    <ChevronIcon/>
                </Combobox.Icon>
            </Combobox.Trigger>

            <Combobox.Portal>
                <Combobox.Positioner className={styles.Positioner} sideOffset={6}>
                    <Combobox.Popup className={styles.Popup}>
                        {searchable && (
                            <div className={styles.SearchWrapper}>
                                <Combobox.Input className={styles.Search} placeholder="Пошук..."/>
                            </div>
                        )}

                        <Combobox.Empty className={styles.Empty}>
                            Нічого не знайдено
                        </Combobox.Empty>

                        <Combobox.List className={styles.List}>
                            {item => {
                                const additionalText = getAdditionalText(item)

                                return (
                                    <Combobox.Item key={item.id} value={item} className={styles.Item}>
                                        <Combobox.ItemIndicator className={styles.ItemIndicator}>
                                            <CheckIcon/>
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
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"/>
        </svg>
    )
}

function CheckIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6.5L4.75 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"/>
        </svg>
    )
}
