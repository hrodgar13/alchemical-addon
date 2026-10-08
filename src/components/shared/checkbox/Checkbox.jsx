import {Checkbox as BaseCheckbox} from '@base-ui/react/checkbox'
import styles from './checkbox.module.css'


export default function Checkbox({
    label,
    checked,
    onCheckedChange,
    disabled = false,
}) {
    return (
        <label className={styles.Label} data-disabled={disabled || undefined}>
            <BaseCheckbox.Root
                className={styles.Checkbox}
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
            >
                <BaseCheckbox.Indicator className={styles.Indicator}>
                    <CheckIcon/>
                </BaseCheckbox.Indicator>
            </BaseCheckbox.Root>
            {label}
        </label>
    )
}

function CheckIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6.5L4.75 9L10 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
                  strokeLinejoin="round"/>
        </svg>
    )
}
