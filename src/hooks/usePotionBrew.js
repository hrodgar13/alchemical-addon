import {useContext} from "react"
import {PotionBrewContext} from "../contexts/potion-brew-context.js"

export function usePotionBrew() {
    const context = useContext(PotionBrewContext)
    if (context === undefined) throw new Error("Context used outside of PotionBrewProvider")
    return context
}
