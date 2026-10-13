import {PotionBrewProvider} from "../contexts/potion-brew/PotionBrewContext.jsx"
import Base from "../components/Base/Base.jsx"
import Ingredients from "../components/Ingredients/Ingredients.jsx"
import WhereWeCook from "../components/WhereWeCook/WhereWeCook.jsx"
import Distill from "../components/Distill/Distill.jsx"
import AlchemicalResult from "../components/AlchemicalResult/AlchemicalResult.jsx"
import Brew from "../components/Brew/Brew.jsx"
import Difficulty from "../components/DifficultyArrow/Difficulty.jsx"
import {PotionComponentProvider} from "../contexts/potion-components/PotionComponentsContext.jsx"

export default function AlchemicalTable() {
    return (
        <div className="brew">
            <PotionComponentProvider>
                <PotionBrewProvider>
                    <WhereWeCook />
                    <Base />
                    <Ingredients />
                    <Distill />
                    <Difficulty />
                    <AlchemicalResult />
                    <Brew />
                </PotionBrewProvider>
            </PotionComponentProvider>
        </div>
    )
}
