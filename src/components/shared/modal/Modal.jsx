import {Dialog} from "@base-ui/react/dialog"
import Button from "../button/Button.jsx"
import CarvedFrame from "../carved-frame/CarvedFrame.jsx"
import {CloseIcon} from "../icons/Icons.jsx"

import styles from "./modal.module.css"

/*
 *  Controlled: the parent owns `open`, so a form inside decides when to close (e.g. only after a successful save).
 *  title is required: Dialog.Title is the dialog's accessible name.
 *  Reset displayed data in onOpenChangeComplete, not onOpenChange, or it changes mid close animation.
 *  initialFocus: without it focus lands on the close button.
 * */
export default function Modal({open, onOpenChange, onOpenChangeComplete, title, description, initialFocus, children}) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange} onOpenChangeComplete={onOpenChangeComplete}>
            <Dialog.Portal>
                <Dialog.Backdrop className={styles.Backdrop} />
                <Dialog.Viewport className={styles.Viewport}>
                    <Dialog.Popup className={styles.Popup} initialFocus={initialFocus}>
                        <CarvedFrame />

                        <div className={styles.Header}>
                            <Dialog.Title className={styles.Title}>{title}</Dialog.Title>
                            {/* render: Dialog.Close lends its behaviour to our Button instead of rendering its own */}
                            <Dialog.Close render={<Button aria-label="Закрити" />}>
                                <CloseIcon />
                            </Dialog.Close>
                        </div>

                        {description && (
                            <Dialog.Description className={styles.Description}>{description}</Dialog.Description>
                        )}

                        {children}
                    </Dialog.Popup>
                </Dialog.Viewport>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
