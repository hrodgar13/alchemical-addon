import {createContext, useContext, useReducer} from "react";
import {FIELD_INSTRUMENTS} from "../static/static.js";

const ACTION_BASE_CHANGED = 'base/changed'
const ACTION_WHERE_WE_COOK_CHANGED = 'whereWeCook/changed'

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
            const res = {...state, whereWeCook: action.payload}

            console.log(res)

            return res
        case ACTION_BASE_CHANGED:
            return {...state}
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

    return (
        <PotionBrewContext.Provider
            value={{
                whereWeCook,
                base,
                ingredients,
                distill,
                difficulty,
                setWhereWeCook
            }}
        >
            {children}
        </PotionBrewContext.Provider>
    )
}

function usePotionBrew() {
    const context = useContext(PotionBrewContext)
    if(context === undefined) throw new Error('Context used outside of PotionProvider')
    return context
}

export {PotionBrewProvider, usePotionBrew}
