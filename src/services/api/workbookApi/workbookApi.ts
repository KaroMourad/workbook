import {db} from "../../../firebase/initializeFirebase";
import firebase from "firebase/app";
import {IWorkbook} from "../../../pages/workbooks/IWorkBooks";

const collectionRef = db.collection("workbooks");

export const getWorkbooks = async (): Promise<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>> =>
{
    return await collectionRef
        .orderBy("created_at", "desc")
        .get();
};

export const deleteWorkbooks = async (token: boolean, ids: string[]): Promise<void> =>
{
    if (!token) return Promise.reject("User doesn't have permission!");
    return await collectionRef.get().then(querySnapshot =>
    {
        // Once we get the results, begin a batch
        const batch = db.batch();

        querySnapshot.forEach(doc =>
        {
            // For each doc, add a delete operation to the batch
            if (ids.indexOf(doc.ref.id) !== -1)
            {
                batch.delete(doc.ref);
            }
        });

        // Commit the batch
        return batch.commit();
    });
};

export const getWorkbook = async (id: string): Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>> =>
{
    return await collectionRef.doc(id).get();
};

export const createWorkbook = async (data: IWorkbook, uniqueProps?: { [key: string]: string }): Promise<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>> =>
{
    return await collectionRef.add(data);
};

export const updateWorkbook = async (id: string, data: Partial<IWorkbook>): Promise<void> =>
{
    return await collectionRef.doc(id).update(data);
};

export const checkUniqueness = async (uniqueProps: { [key: string]: string }): Promise<void> =>
{
    const keys = Object.keys(uniqueProps);
    return Promise.all(
        keys.map(key => collectionRef.where(key, "==", uniqueProps[key]).get())
    ).then(data =>
    {
        let exists = false;
        data.forEach(querySnapshots =>
        {
            querySnapshots?.forEach(doc =>
            {
                if (doc.exists) exists = true;
            });
        });
        if (exists)
        {
            throw new Error(`${keys.join(" or ")} ${keys.length === 1 ? "is" : "are"} not unique!`);
        }
    });
};
