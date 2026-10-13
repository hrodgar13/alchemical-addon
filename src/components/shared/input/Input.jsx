import {Field} from "@base-ui/react/field"
import styles from "./input.module.css"

/*
 *  Поле вводу з підписом. Field сам зв'язує <label> з <input> (htmlFor/id) — власні id не потрібні.
 *  Без label поле лишається без видимого підпису: тоді передай aria-label.
 *  className — для розміщення поля в батьківському layout (flex: 1 тощо), вигляд задає модуль.
 *  multiline — багаторядкове поле: Field.Control через render малює <textarea> зі своєю поведінкою.
 *  Решта пропсів (name, type, value, defaultValue, onChange, placeholder…) ідуть на сам <input>.
 * */
export default function Input({label, className, multiline = false, ...props}) {
    return (
        <Field.Root className={className ? `${styles.Field} ${className}` : styles.Field}>
            {label && <Field.Label className={styles.Label}>{label}</Field.Label>}
            <Field.Control
                className={multiline ? `${styles.Input} ${styles.Multiline}` : styles.Input}
                render={multiline ? <textarea rows={4} /> : undefined}
                {...props}
            />
        </Field.Root>
    )
}
