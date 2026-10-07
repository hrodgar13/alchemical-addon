import {createContext, useContext, useEffect, useReducer} from "react";
import {
    BASES,
    BREWED_POTIONS,
    FIELD_INSTRUMENTS,
    INGREDIENT_RARITIES,
    MOCK_INGREDIENTS,
    STATION
} from "../static/static.js";

const PotionComponentsContext = createContext()

const ACTION_LOADING = 'loading'
const BASE_LOADED = 'base/loaded'
const ERROR = 'error'
const INGREDIENTS_LOADED = 'ingredients/loaded'
const BREWED_POTIONS_LOADED = 'brewedPotions/loaded'
const FINISHED = 'finished'


const initialState = {
    cookPlaces: [FIELD_INSTRUMENTS, STATION],
    bases: [],
    ingredients: [],
    ingredientRarities: INGREDIENT_RARITIES,
    brewedPotions: [],
    isLoading: false,
    errors: []
}

function reducer(state, action) {
    switch (action.type) {
        case ACTION_LOADING:
            return {...state, isLoading: true}
        case BASE_LOADED:
            return {...state, bases: action.payload}
        case INGREDIENTS_LOADED:
            return {...state, ingredients: action.payload}
        case BREWED_POTIONS_LOADED:
            return {...state, brewedPotions: action.payload}
        case ERROR:
            return {...state, errors: [...state.errors, action.payload]}
        case FINISHED:
            return {...state, isLoading: false}



        default:
            throw new Error('Unknown Action type in Potion Components context')
    }
}

function PotionComponentProvider({children}) {
    const [{
        cookPlaces,
        bases,
        ingredients,
        ingredientRarities,
        brewedPotions,
        isLoading,
        errors
    }, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {

        dispatch({type: ACTION_LOADING})

        async function fetchBases() {
            try {
                //TODO there will be fetch from API's
                const data = BASES
                dispatch({type: BASE_LOADED, payload: data})
            } catch (err) {
                dispatch({type: ERROR, payload: `An Error occurred while fetching Bases: ${err.message}`})
            }
        }

        async function fetchIngredients() {
            try {
                //TODO there will be fetch from API's
                const data = MOCK_INGREDIENTS
                dispatch({type: INGREDIENTS_LOADED, payload: data})
            } catch (err) {
                dispatch({type: ERROR, payload: `An Error occurred while fetching Ingredients: ${err.message}`})
            }
        }

        async function fetchBrewedPotions() {
            try {
                //TODO there will be fetch from API's
                const data = BREWED_POTIONS
                dispatch({type: BREWED_POTIONS_LOADED, payload: data})
            } catch (err) {
                dispatch({type: ERROR, payload: `An Error occurred while fetching Brewed potions: ${err.message}`})
            }
        }

        async function fetchAll() {
            await Promise.all([
                fetchBases(),
                fetchIngredients(),
                fetchBrewedPotions()
            ])
            dispatch({type: FINISHED})
        }

        fetchAll()
    }, []);

    return (
        <PotionComponentsContext.Provider value={{
            cookPlaces,
            bases,
            ingredients,
            ingredientRarities,
            brewedPotions,
            isLoading,
            error
        }}>
            {children}
        </PotionComponentsContext.Provider>
    )
}

function usePotionComponents() {
    const context = useContext(PotionComponentsContext)
    if (context === undefined) throw new Error('Context used outside of PotionComponents Provider')
    return context
}

export {PotionComponentProvider, usePotionComponents}
