import {collection, doc, getDocs, setDoc} from "firebase/firestore"
import {db} from "./firebase.js"

/*
 *  users/{uid}/{bases|ingredients|brewedPotions}/{id}; Security Rules admit only the owner.
 *  id is the Firestore doc id, not a field: added on read, stripped on write to avoid storing it twice.
 * */
function userCollection(uid, collectionName) {
    return collection(db, "users", uid, collectionName)
}

export async function getUserItems(uid, collectionName) {
    const snapshot = await getDocs(userCollection(uid, collectionName))

    return snapshot.docs.map(document => ({...document.data(), id: document.id}))
}

// A known id overwrites the document; null creates a new one with a Firestore-generated id
export async function saveUserItem(uid, collectionName, {id, ...data}) {
    const reference = id ? doc(userCollection(uid, collectionName), id) : doc(userCollection(uid, collectionName))

    await setDoc(reference, data)

    return {...data, id: reference.id}
}
