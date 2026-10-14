import {useEffect, useReducer} from "react"
import {FIELD_INSTRUMENTS, INGREDIENT_RARITIES, STATION} from "../../static/static.js"
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
    cookPlaces: [FIELD_INSTRUMENTS, STATION],
    bases: [],
    ingredients: [],
    ingredientRarities: INGREDIENT_RARITIES,
    brewedPotions: [],
    // true з самого початку — щоб до першої відповіді Firestore не мигнув порожній каталог
    isLoading: true,
    errors: [],
}

// Збережений запис: відомий id — замінюємо на місці, новий — додаємо в кінець
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
    const [{cookPlaces, bases, ingredients, ingredientRarities, brewedPotions, isLoading, errors}, dispatch] =
        useReducer(reducer, initialState)
    // Провайдер живе на захищених сторінках, але в мить виходу user вже null — тоді нічого не вантажимо
    const uid = useAuth().user?.uid

    useEffect(() => {
        if (!uid) return

        // Якщо uid зміниться (вихід і вхід іншим акаунтом), відповіді старого запиту вже не потрібні
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
     *  Збереження: спершу чекаємо Firestore, потім оновлюємо стан — у списку лише те, що справді збереглось.
     *  Помилку не ловимо: її показує той, хто викликав (форма; для зілля — варка не скидає рецепт).
     *  Повертаємо збережений запис — з id від Firestore, якщо він новий.
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
                cookPlaces,
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
