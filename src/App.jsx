import Header from "./components/Header.jsx";
import WhereWeCook from "./components/WhereWeCook/WhereWeCook.jsx";
import Ingredients from "./components/Ingredients.jsx";
import Distill from "./components/Distill.jsx";
import Difficulty from "./components/Difficulty.jsx";
import AlchemicalResult from "./components/AlchemicalResult.jsx";
import Base from "./components/Base.jsx";
import {PotionProvider} from "./contexts/PotionContext.jsx";

function App() {

  return (
    <div className='app'>

      <Header />
        <div className='brew'>
            <PotionProvider>
                <WhereWeCook />
                <Base />
                <Ingredients />
                <Distill />
                <Difficulty />
                <AlchemicalResult />
            </PotionProvider>
        </div>
    </div>
  )
}

export default App
