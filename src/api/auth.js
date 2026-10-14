import {GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut} from "firebase/auth"
import {auth} from "./firebase.js"

// Rejects if the user closes the Google account popup
export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider())
}

export function logOut() {
    return signOut(auth)
}

/*
 *  callback(user | null) fires on sign-in, sign-out and once on page load, after Firebase
 *  has restored (or failed to restore) the saved session. Returns the unsubscribe function.
 * */
export function subscribeToAuthChanges(callback) {
    return onAuthStateChanged(auth, callback)
}
