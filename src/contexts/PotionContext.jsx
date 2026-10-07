import {createContext, useContext, useReducer} from "react";

const FIELD_INSTRUMENTS = 'fieldInstruments'
const STATION = 'station'

const ACTION_BASE_CHANGED = 'base/changed'
const ACTION_WHERE_WE_COOK_CHANGED = 'whereWeCook/changed'

const PotionContext = createContext()

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

function PotionProvider({children}) {
    const [{whereWeCook, base, ingredients, distill, difficulty}, dispatch] = useReducer(reducer, initialState)

    function setWhereWeCook(newWhereWeCook) {
        if(whereWeCook === newWhereWeCook) return

        dispatch({type: ACTION_WHERE_WE_COOK_CHANGED, payload: newWhereWeCook })
    }

    return (
        <PotionContext.Provider
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
        </PotionContext.Provider>
    )
}

function usePotion() {
    const context = useContext(PotionContext)
    if(context === undefined) throw new Error('Context used outside of PotionProvider')
    return context
}

export {PotionProvider, usePotion, FIELD_INSTRUMENTS, STATION}
