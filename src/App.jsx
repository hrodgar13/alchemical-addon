import Header from "./components/Header.jsx";
import WhereWeCook from "./components/WhereWeCook/WhereWeCook.jsx";
import Ingredients from "./components/Ingredients.jsx";
import Distill from "./components/Distill.jsx";
import Difficulty from "./components/Difficulty.jsx";
import AlchemicalResult from "./components/AlchemicalResult.jsx";
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
            </PotionBrewProvider>
        </div>
    </div>
  )
}

export default App
