import {useEffect, useReducer} from "react"
import {
    BASES,
    BREWED_POTIONS,
    FIELD_INSTRUMENTS,
    INGREDIENT_RARITIES,
    MOCK_INGREDIENTS,
    STATION,
} from "../../static/static.js"
import {PotionComponentsContext} from "./potion-components-context.js"

const ACTION_LOADING = "loading"
const BASE_LOADED = "base/loaded"
const ERROR = "error"
const INGREDIENTS_LOADED = "ingredients/loaded"
const BREWED_POTIONS_LOADED = "brewedPotions/loaded"
const BREWED_POTION_SAVED = "brewedPotion/saved"
const FINISHED = "finished"
const BASE_SAVED = "base/saved"

const initialState = {
    cookPlaces: [FIELD_INSTRUMENTS, STATION],
    bases: [],
    ingredients: [],
    ingredientRarities: INGREDIENT_RARITIES,
    brewedPotions: [],
    isLoading: false,
    errors: [],
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
        case BREWED_POTION_SAVED: {
            const isExisting = state.brewedPotions.some(potion => potion.id === action.payload.id)

            return {
                ...state,
                brewedPotions: isExisting
                    ? state.brewedPotions.map(potion => (potion.id === action.payload.id ? action.payload : potion))
                    : [...state.brewedPotions, action.payload],
            }
        }
        case BASE_SAVED: {
            const isExist = state.bases.some(base => base.id === action.payload.id)

            return {
                ...state,
                bases: isExist
                    ? state.bases.map(base => (base.id === action.payload.id ? action.payload : base))
                    : [...state.bases, action.payload],
            }
        }
        case ERROR:
            return {...state, errors: [...state.errors, action.payload]}
        case FINISHED:
            return {...state, isLoading: false}

        default:
            throw new Error("Unknown Action type in Potion Components context")
    }
}

function PotionComponentProvider({children}) {
    const [{cookPlaces, bases, ingredients, ingredientRarities, brewedPotions, isLoading, errors}, dispatch] =
        useReducer(reducer, initialState)

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
            await Promise.all([fetchBases(), fetchIngredients(), fetchBrewedPotions()])
            dispatch({type: FINISHED})
        }

        fetchAll()
    }, [])

    async function saveBrewedPotion(potion) {
        try {
            //TODO there will be save to API (insert або update за id)
            const savedPotion = {...potion, id: potion.id ?? crypto.randomUUID()}
            dispatch({type: BREWED_POTION_SAVED, payload: savedPotion})
        } catch (err) {
            dispatch({type: ERROR, payload: `An Error occurred while saving Brewed potion: ${err.message}`})
        }
    }

    // Помилку не ловимо: її показує форма, яка викликала збереження.
    // Повертаємо збережену основу — з id, якщо вона нова
    async function addOrEditBase(base) {
        //TODO there will be save to API
        const savedBase = {...base, id: base.id ?? crypto.randomUUID()}
        dispatch({type: BASE_SAVED, payload: savedBase})

        return savedBase
    }

    return (
        <PotionComponentsContext.Provider
            value={{
                cookPlaces,
                bases,
                ingredients,
                ingredientRarities,
                brewedPotions,
                isLoading,
                errors,
                saveBrewedPotion,
                addOrEditBase,
            }}
        >
            {children}
        </PotionComponentsContext.Provider>
    )
}

export {PotionComponentProvider}
