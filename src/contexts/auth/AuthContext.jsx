import {useEffect, useReducer} from "react"
import {AuthContext} from "./auth-context.js"
import {logOut, signInWithGoogle, subscribeToAuthChanges} from "../../api/auth.js"

const initState = {
    user: null,
    // false until Firebase reports whether a saved session exists; access can't be decided before that
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

// Keep only the plain fields the app needs, not the whole Firebase user object
function toAppUser(firebaseUser) {
    if (!firebaseUser) return null

    const {uid, displayName, email, photoURL} = firebaseUser

    return {uid, name: displayName, email, photoURL}
}

function AuthProvider({children}) {
    const [{user, isAuthReady}, dispatch] = useReducer(reducer, initState)
    const isAuthenticated = user !== null

    /*
     *  The only place auth state changes: login and logout just ask Firebase, which reports
     *  the result here, so the state never drifts from the real session.
     * */
    useEffect(() => {
        return subscribeToAuthChanges(firebaseUser => {
            dispatch({type: ACTION_AUTH_CHANGED, payload: toAppUser(firebaseUser)})
        })
    }, [])

    // Errors (e.g. a closed Google popup) aren't caught here: the login form shows them
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
