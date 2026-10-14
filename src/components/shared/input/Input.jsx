import {Field} from "@base-ui/react/field"
import styles from "./input.module.css"

/*
 *  Field links <label> and <input> itself. Without label, pass aria-label.
 *  multiline renders a <textarea> via Field.Control's render; other props go to the input.
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
