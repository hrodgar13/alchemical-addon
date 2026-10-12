import {Button as BaseButton} from '@base-ui/react/button'
import styles from './button.module.css'


export default function Button({
    children,
    onClick,
    disabled = false,
    type = 'button',
}) {
    return (
        <BaseButton
            className={styles.Button}
            type={type}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </BaseButton>
    )
}
