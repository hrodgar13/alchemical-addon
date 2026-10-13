import {createContext, useContext, useReducer} from "react";
import {FIELD_INSTRUMENTS, INGREDIENT_RARITIES, MAX_UNGRIND, STATION} from "../static/static.js";
import difficultyCalculator from "../rules/difficulty-calculator.js";
import PotionValidation from "../rules/potion-validation.js";

const ACTION_BASE_CHANGED = 'base/changed'
const ACTION_WHERE_WE_COOK_CHANGED = 'whereWeCook/changed'
const ACTION_DISTILL_CHANGED = 'distill/changed'
const ACTION_ADD_NEW_INGREDIENT = 'ingredient/add'
const ACTION_EDIT_EXISTING_INGREDIENT = 'ingredient/edit'
const ACTION_REMOVE_INGREDIENT = 'ingredient/remove'

const PotionBrewContext = createContext()

const initialState = {
    whereWeCook: FIELD_INSTRUMENTS,
    base: null,
    ingredients: [],
    distill: false,
}

function reducer(state, action) {
    switch (action.type) {
        case ACTION_WHERE_WE_COOK_CHANGED:
            return {
                ...state,
                whereWeCook: action.payload,
                distill: action.payload === FIELD_INSTRUMENTS ? false : state.distill
            }
        case ACTION_BASE_CHANGED:
            return {...state, base: action.payload}
        case ACTION_DISTILL_CHANGED:
            return {...state, distill: action.payload}
        case ACTION_ADD_NEW_INGREDIENT:
            return {...state, ingredients: [...state.ingredients, action.payload]}
        case ACTION_EDIT_EXISTING_INGREDIENT:

            const updatedIngredientList = state.ingredients.map(ingredient => {
                if (ingredient.ingredientCombinationId === action.payload.ingredientCombinationId) {
                    return {...action.payload}
                }

                return ingredient
            })


            return {...state, ingredients: updatedIngredientList}

        case ACTION_REMOVE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter(ingredient => ingredient.ingredientCombinationId !== action.payload)
            }

        default:
            throw new Error('Unknown action type in potion context reducer')
    }
}

function PotionBrewProvider({children}) {
    const [{whereWeCook, base, ingredients, distill}, dispatch] = useReducer(reducer, initialState)
    const difficulty = difficultyCalculator(whereWeCook, base, ingredients, distill)
    const message = PotionValidation(difficulty, whereWeCook, base, ingredients, distill)

    function setWhereWeCook(newWhereWeCook) {
        if (whereWeCook === newWhereWeCook) return

        dispatch({type: ACTION_WHERE_WE_COOK_CHANGED, payload: newWhereWeCook})
    }

    function setBase(newBase) {
        if (base === newBase) return

        dispatch({type: ACTION_BASE_CHANGED, payload: newBase})
    }

    function setDistill(newDistillValue) {
        if (newDistillValue === distill || whereWeCook !== STATION) return

        dispatch({type: ACTION_DISTILL_CHANGED, payload: newDistillValue})
    }

    function addNewIngredient() {
        // Унікальний id, що не повторюється після видалень (на відміну від length + 1)
        const newIngredientCombinationId = crypto.randomUUID()

        // 4-й інгредієнт можливий лише коли перетерті всі — тому він створюється одразу перетертим
        const isExtraIngredient = ingredients.length === MAX_UNGRIND

        const newIngredient = {
            ingredientCombinationId: newIngredientCombinationId,
            ingredient: null,
            rarity: INGREDIENT_RARITIES[0],
            ground: isExtraIngredient
        }

        dispatch({type: ACTION_ADD_NEW_INGREDIENT, payload: newIngredient})
    }

    function editIngredientCombination(payload) {

        dispatch({type: ACTION_EDIT_EXISTING_INGREDIENT, payload})
    }

    function removeIngredient(ingredientCombinationId) {
        dispatch({type: ACTION_REMOVE_INGREDIENT, payload: ingredientCombinationId})
    }

    return (
        <PotionBrewContext.Provider
            value={{
                whereWeCook,
                base,
                ingredients,
                distill,
                difficulty,
                message,
                setWhereWeCook,
                setBase,
                setDistill,
                addNewIngredient,
                editIngredientCombination,
                removeIngredient
            }}
        >
            {children}
        </PotionBrewContext.Provider>
    )
}

function usePotionBrew() {
    const context = useContext(PotionBrewContext)
    if (context === undefined) throw new Error('Context used outside of PotionBrewProvider')
    return context
}

export {PotionBrewProvider, usePotionBrew}
