import {createContext} from "react"

// Сам об'єкт контексту — окремо від провайдера (компонента) і хука,
// щоб файл з провайдером експортував лише компонент і Fast Refresh працював без перезавантаження сторінки
export const PotionBrewContext = createContext()
