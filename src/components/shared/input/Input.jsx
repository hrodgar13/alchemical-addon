import {Field} from "@base-ui/react/field"
import styles from "./input.module.css"

/*
 *  Поле вводу з підписом. Field сам зв'язує <label> з <input> (htmlFor/id) — власні id не потрібні.
 *  Без label поле лишається без видимого підпису: тоді передай aria-label.
 *  className — для розміщення поля в батьківському layout (flex: 1 тощо), вигляд задає модуль.
 *  Решта пропсів (name, type, value, defaultValue, onChange, placeholder…) ідуть на сам <input>.
 * */
export default function Input({label, className, ...props}) {
    return (
        <Field.Root className={className ? `${styles.Field} ${className}` : styles.Field}>
            {label && <Field.Label className={styles.Label}>{label}</Field.Label>}
            <Field.Control className={styles.Input} {...props} />
        </Field.Root>
    )
}
