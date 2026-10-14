import {collection, doc, getDocs, setDoc} from "firebase/firestore"
import {db} from "./firebase.js"

/*
 *  Усі дані користувача лежать у його гілці: users/{uid}/{bases|ingredients|brewedPotions}/{id}.
 *  Security Rules пускають у гілку лише її власника, тож чужого запит просто не прочитає.
 *
 *  id — це id документа Firestore (рядок), а не поле всередині нього: при читанні додаємо,
 *  при записі прибираємо, щоб не зберігати двічі.
 * */
function userCollection(uid, collectionName) {
    return collection(db, "users", uid, collectionName)
}

export async function getUserItems(uid, collectionName) {
    const snapshot = await getDocs(userCollection(uid, collectionName))

    return snapshot.docs.map(document => ({...document.data(), id: document.id}))
}

// Відомий id — перезаписуємо документ, null — створюємо новий з id, який видасть Firestore
export async function saveUserItem(uid, collectionName, {id, ...data}) {
    const reference = id ? doc(userCollection(uid, collectionName), id) : doc(userCollection(uid, collectionName))

    await setDoc(reference, data)

    return {...data, id: reference.id}
}
