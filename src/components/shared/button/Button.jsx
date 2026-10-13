import {Button as BaseButton} from "@base-ui/react/button"
import styles from "./button.module.css"

// Решта пропсів (aria-label, aria-pressed, title…) передаються як є — потрібно для кнопок-іконок
export default function Button({children, onClick, disabled = false, type = "button", ...props}) {
    return (
        <BaseButton {...props} className={styles.Button} type={type} onClick={onClick} disabled={disabled}>
            {children}
        </BaseButton>
    )
}
