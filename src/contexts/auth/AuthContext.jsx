import {useEffect, useReducer} from "react"
import {AuthContext} from "./auth-context.js"
import {logOut, signInWithGoogle, subscribeToAuthChanges} from "../../api/auth.js"

const initState = {
    user: null,
    // false — Firebase ще не повідомив, чи є збережена сесія. До цього не можна вирішувати, пускати чи ні
    isAuthReady: false,
}

const ACTION_AUTH_CHANGED = "auth/changed"

function reducer(state, action) {
    switch (action.type) {
        case ACTION_AUTH_CHANGED:
            return {...state, user: action.payload, isAuthReady: true}
        default:
            throw new Error("Unknown action type in Auth Provider reducer")
    }
}

// Об'єкт Firebase великий і з методами — у стан беремо лише прості дані, які потрібні застосунку
function toAppUser(firebaseUser) {
    if (!firebaseUser) return null

    const {uid, displayName, email, photoURL} = firebaseUser

    return {uid, name: displayName, email, photoURL}
}

function AuthProvider({children}) {
    const [{user, isAuthReady}, dispatch] = useReducer(reducer, initState)
    const isAuthenticated = user !== null

    /*
     *  Єдине місце, де змінюється стан входу. login і logout лише просять Firebase,
     *  а він сам повідомляє про результат сюди — так стан не розійдеться з реальною сесією.
     *  Ефект доречний: це підписка на зовнішню систему, а повернена функція — відписка.
     * */
    useEffect(() => {
        return subscribeToAuthChanges(firebaseUser => {
            dispatch({type: ACTION_AUTH_CHANGED, payload: toAppUser(firebaseUser)})
        })
    }, [])

    // Помилку (напр. закрите вікно Google) не ловимо — її покаже форма входу
    async function login() {
        await signInWithGoogle()
    }

    async function logout() {
        await logOut()
    }

    return (
        <AuthContext.Provider value={{user, isAuthenticated, isAuthReady, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthProvider}
