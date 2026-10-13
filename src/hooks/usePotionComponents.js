import {useContext} from "react"
import {PotionComponentsContext} from "../contexts/potion-components-context.js"

export function usePotionComponents() {
    const context = useContext(PotionComponentsContext)
    if (context === undefined) throw new Error("Context used outside of PotionComponents Provider")
    return context
}
