import Header from "./components/Header.jsx";
import WhereWeCook from "./components/WhereWeCook/WhereWeCook.jsx";
import Ingredients from "./components/Ingredients/Ingredients.jsx";
import Distill from "./components/Distill/Distill.jsx";
import Difficulty from "./components/DifficultyArrow/Difficulty.jsx";
import AlchemicalResult from "./components/AlchemicalResult/AlchemicalResult.jsx";
import Brew from "./components/Brew/Brew.jsx";
import Base from "./components/Base/Base.jsx";
import {PotionBrewProvider} from "./contexts/PotionBrewContext.jsx";

function App() {

  return (
    <div className='app'>

      <Header />
        <div className='brew'>
            <PotionBrewProvider>
                <WhereWeCook />
                <Base />
                <Ingredients />
                <Distill />
                <Difficulty />
                <AlchemicalResult />
                <Brew />
            </PotionBrewProvider>
        </div>
    </div>
  )
}

export default App
