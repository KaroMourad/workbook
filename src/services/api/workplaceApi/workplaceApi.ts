import {db} from "../../../firebase/initializeFirebase";
import firebase from "firebase/app";
import {IWorkplace} from "../../../pages/workbooks/workplaceList/list/IWorkplaceList";

const collectionRef = db.collection("workplaces");

export const getWorkplaces = async (workbookId: string): Promise<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>> =>
{
    return await collectionRef
        .where("workbookId", "==", workbookId)
        .orderBy("created_at", "desc")
        .get();
};

export const deleteWorkplaces = async (token: boolean, ids: string[]): Promise<void> =>
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

export const getWorkplace = async (id: string): Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>> =>
{
    return await collectionRef.doc(id).get();
};

export const createWorkplace = async (data: IWorkplace, uniqueProps?: { [key: string]: string }): Promise<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>> =>
{
    return await collectionRef.add(data);
};

export const updateWorkplace = async (id: string, data: Partial<IWorkplace>): Promise<void> =>
{
    return await collectionRef.doc(id).update(data);
};

