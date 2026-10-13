import styles from "./SpinnerFullPage.module.css"
import Spinner from "../../components/shared/spinner/Spinner.jsx"

function SpinnerFullPage() {
    return (
        <div className={styles.spinnerFullpage}>
            <Spinner />
        </div>
    )
}

export default SpinnerFullPage
