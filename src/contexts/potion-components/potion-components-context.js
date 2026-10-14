import {createContext} from "react"

// Kept apart from the provider so the provider file exports only components and Fast Refresh works
export const PotionComponentsContext = createContext()
