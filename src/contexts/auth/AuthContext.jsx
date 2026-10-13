import {useReducer} from "react"
import {AuthContext} from "./auth-context.js"

const initState = {
    user: null,
    isAuthenticated: false,
}

const ACTION_LOGIN = "login"
const ACTION_LOGOUT = "logout"

const MOCK_USER = {
    login: "Hrodgar13",
    password: "qwerty123!",
}

function reducer(state, action) {
    switch (action.type) {
        case ACTION_LOGIN:
            return {...state, user: action.payload, isAuthenticated: true}
        case ACTION_LOGOUT:
            return {...state, user: null, isAuthenticated: false}
        default:
            throw new Error("Unknown action type in Auth Provider reducer")
    }
}

function AuthProvider({children}) {
    const [{user, isAuthenticated}, dispatch] = useReducer(reducer, initState)

    // TODO: замінити на Firebase Auth. Помилка кидається, щоб форма могла її показати
    async function login(login, password) {
        if (login !== MOCK_USER.login || password !== MOCK_USER.password) {
            throw new Error("Invalid login or password")
        }

        // У стан — лише дані користувача, без пароля
        dispatch({type: ACTION_LOGIN, payload: {login}})
    }

    function logout() {
        dispatch({type: ACTION_LOGOUT})
    }

    return <AuthContext.Provider value={{user, isAuthenticated, logout, login}}>{children}</AuthContext.Provider>
}

export {AuthProvider}
