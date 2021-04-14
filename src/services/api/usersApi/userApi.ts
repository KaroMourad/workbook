import {db} from "../../../firebase/initializeFirebase";
import firebase from "firebase/app";

const collectionRef = db.collection("users");

export const getUserDoc = async (uid: string): Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>> =>
{
    return await collectionRef.doc(uid).get();
};
