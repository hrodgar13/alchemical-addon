import {GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut} from "firebase/auth"
import {auth} from "./firebase.js"

// Вікно вибору акаунта Google. Якщо користувач закриє його — проміс відхилиться з помилкою
export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider())
}

export function logOut() {
    return signOut(auth)
}

/*
 *  callback(user | null) — щоразу, коли змінюється стан входу: вхід, вихід,
 *  а також одразу після завантаження сторінки, коли Firebase відновив (або ні) збережену сесію.
 *  Повертає функцію відписки — для cleanup у useEffect.
 * */
export function subscribeToAuthChanges(callback) {
    return onAuthStateChanged(auth, callback)
}
