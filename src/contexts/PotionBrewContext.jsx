import {createContext, useContext, useReducer} from "react";
import {FIELD_INSTRUMENTS, STATION} from "../static/static.js";

const ACTION_BASE_CHANGED = 'base/changed'
const ACTION_WHERE_WE_COOK_CHANGED = 'whereWeCook/changed'
const ACTION_DISTILL_CHANGED = 'distill/changed'

const PotionBrewContext = createContext()

const initialState = {
    whereWeCook: FIELD_INSTRUMENTS,
    base: null,
    ingredients: [],
    distill: false,
    difficulty: 8,
}

function reducer(state, action){
    switch (action.type) {
        case ACTION_WHERE_WE_COOK_CHANGED:
            return {...state, whereWeCook: action.payload}
        case ACTION_BASE_CHANGED:
            return {...state, base: action.payload}
        case ACTION_DISTILL_CHANGED:
            return {...state, distill: action.payload}

        default:
            throw new Error('Unknown action type in potion context reducer')
    }
}

function PotionBrewProvider({children}) {
    const [{whereWeCook, base, ingredients, distill, difficulty}, dispatch] = useReducer(reducer, initialState)

    function setWhereWeCook(newWhereWeCook) {
        if(whereWeCook === newWhereWeCook) return

        dispatch({type: ACTION_WHERE_WE_COOK_CHANGED, payload: newWhereWeCook })
    }

    function setBase(newBase) {
        if (base === newBase) return

        dispatch({type: ACTION_BASE_CHANGED, payload: newBase})
    }

    function setDistill(newDistillValue) {
        if (newDistillValue === distill || whereWeCook !== STATION) return

        dispatch({type: ACTION_DISTILL_CHANGED, payload: newDistillValue})
    }

    return (
        <PotionBrewContext.Provider
            value={{
                whereWeCook,
                base,
                ingredients,
                distill,
                difficulty,
                setWhereWeCook,
                setBase,
                setDistill
            }}
        >
            {children}
        </PotionBrewContext.Provider>
    )
}

function usePotionBrew() {
    const context = useContext(PotionBrewContext)
    if(context === undefined) throw new Error('Context used outside of PotionBrewProvider')
    return context
}

export {PotionBrewProvider, usePotionBrew}
