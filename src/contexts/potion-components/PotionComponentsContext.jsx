import {useEffect, useReducer} from "react"
import {INGREDIENT_RARITIES} from "../../static/static.js"
import {PotionComponentsContext} from "./potion-components-context.js"
import {useAuth} from "../../hooks/useAuth.js"
import {getBases, saveBase} from "../../api/bases.js"
import {getIngredients, saveIngredient} from "../../api/ingredients.js"
import {getBrewedPotions, saveBrewedPotion as saveBrewedPotionToDb} from "../../api/brewed-potions.js"

const ACTION_LOADING = "loading"
const BASE_LOADED = "base/loaded"
const ERROR = "error"
const INGREDIENTS_LOADED = "ingredients/loaded"
const BREWED_POTIONS_LOADED = "brewedPotions/loaded"
const BREWED_POTION_SAVED = "brewedPotion/saved"
const FINISHED = "finished"
const BASE_SAVED = "base/saved"
const INGREDIENT_SAVED = "ingredient/saved"

const initialState = {
    bases: [],
    ingredients: [],
    ingredientRarities: INGREDIENT_RARITIES,
    brewedPotions: [],
    // true from the start so an empty catalog doesn't flash before the first Firestore response
    isLoading: true,
    errors: [],
}

function upsertById(list, item) {
    const isExisting = list.some(listItem => listItem.id === item.id)

    return isExisting ? list.map(listItem => (listItem.id === item.id ? item : listItem)) : [...list, item]
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
        case BREWED_POTION_SAVED:
            return {...state, brewedPotions: upsertById(state.brewedPotions, action.payload)}
        case BASE_SAVED:
            return {...state, bases: upsertById(state.bases, action.payload)}
        case INGREDIENT_SAVED:
            return {...state, ingredients: upsertById(state.ingredients, action.payload)}
        case ERROR:
            return {...state, errors: [...state.errors, action.payload]}
        case FINISHED:
            return {...state, isLoading: false}

        default:
            throw new Error("Unknown Action type in Potion Components context")
    }
}

function PotionComponentProvider({children}) {
    const [{bases, ingredients, ingredientRarities, brewedPotions, isLoading, errors}, dispatch] = useReducer(
        reducer,
        initialState,
    )
    // The provider lives on protected pages, but user is already null at the moment of logout
    const uid = useAuth().user?.uid

    useEffect(() => {
        if (!uid) return

        // If uid changes (sign-out and sign-in with another account), stale responses are ignored
        let isCancelled = false

        function dispatchIfActive(action) {
            if (!isCancelled) dispatch(action)
        }

        async function fetchCollection(fetcher, loadedType, label) {
            try {
                dispatchIfActive({type: loadedType, payload: await fetcher(uid)})
            } catch (err) {
                dispatchIfActive({type: ERROR, payload: `An Error occurred while fetching ${label}: ${err.message}`})
            }
        }

        async function fetchAll() {
            dispatch({type: ACTION_LOADING})
            await Promise.all([
                fetchCollection(getBases, BASE_LOADED, "Bases"),
                fetchCollection(getIngredients, INGREDIENTS_LOADED, "Ingredients"),
                fetchCollection(getBrewedPotions, BREWED_POTIONS_LOADED, "Brewed potions"),
            ])
            dispatchIfActive({type: FINISHED})
        }

        fetchAll()

        return () => {
            isCancelled = true
        }
    }, [uid])

    /*
     *  Wait for Firestore before updating state, so the lists hold only what was really saved.
     *  Errors aren't caught: the caller shows them (the form; a failed brew keeps the recipe).
     *  Returns the saved record, with the Firestore id if it is new.
     * */
    async function saveBrewedPotion(potion) {
        const savedPotion = await saveBrewedPotionToDb(uid, potion)
        dispatch({type: BREWED_POTION_SAVED, payload: savedPotion})

        return savedPotion
    }

    async function addOrEditBase(base) {
        const savedBase = await saveBase(uid, base)
        dispatch({type: BASE_SAVED, payload: savedBase})

        return savedBase
    }

    async function addOrEditIngredient(ingredient) {
        const savedIngredient = await saveIngredient(uid, ingredient)
        dispatch({type: INGREDIENT_SAVED, payload: savedIngredient})

        return savedIngredient
    }

    return (
        <PotionComponentsContext.Provider
            value={{
                bases,
                ingredients,
                ingredientRarities,
                brewedPotions,
                isLoading,
                errors,
                saveBrewedPotion,
                addOrEditBase,
                addOrEditIngredient,
            }}
        >
            {children}
        </PotionComponentsContext.Provider>
    )
}

export {PotionComponentProvider}
