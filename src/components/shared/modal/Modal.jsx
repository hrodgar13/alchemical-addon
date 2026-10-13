import {Dialog} from "@base-ui/react/dialog"
import Button from "../button/Button.jsx"
import CarvedFrame from "../carved-frame/CarvedFrame.jsx"
import {CloseIcon} from "../icons/Icons.jsx"

import styles from "./modal.module.css"

/*
 *  Модальне вікно: обгортка над Base UI Dialog з нашим оформленням (різьблена рамка, хрестик).
 *  Base UI бере на себе доступність: фокус не виходить з вікна, Esc і клік по фону закривають,
 *  після закриття фокус повертається туди, звідки вікно відкрили.
 *
 *  Керована ззовні: батько тримає `open` і отримує `onOpenChange(false)` на хрестик / Esc / фон.
 *  Так форма всередині сама вирішує, коли закрити вікно — напр. лише після успішного збереження.
 *
 *  title — обов'язковий: Dialog.Title стає доступною назвою вікна для скрінрідера.
 *  Вміст (форма, кнопки дій) — через children.
 *
 *  onOpenChangeComplete(open) — після завершення анімації відкриття/закриття. Скидай тут дані,
 *  які показує вікно: якщо скинути їх одразу в onOpenChange, вміст зміниться посеред зникнення.
 *
 *  initialFocus — ref елемента, який отримає фокус при відкритті (напр. перше поле форми).
 *  Без нього фокус стає на перший інтерактивний елемент — це хрестик.
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
                            {/* render — Dialog.Close віддає свою поведінку нашій кнопці, а не малює власну */}
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
