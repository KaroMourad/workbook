import React, {createContext, useEffect, useState} from "react";
import {auth, db} from "../../firebase/initializeFirebase";
import {IProviderProps, IUserContext} from "./IUserProvider";

export const UserContext = createContext<IUserContext>({user: null, isLoaded: false});

const UserProvider = (props: IProviderProps): JSX.Element =>
{
    const [user, setUser] = useState<IUserContext>({
        user: null,
        isLoaded: false
    });

    const getUserDocument = async (uid?: string) =>
    {
        if (!uid) return null;
        try
        {
            const userDocument = await db.collection("users").doc(uid).get();
            return {
                uid,
                ...userDocument.data()
            };
        } catch (error)
        {
            console.error("Error getting document:", error);
        }
    };

    useEffect(() =>
    {
        auth.onAuthStateChanged(async userAuth =>
        {
            const user = await getUserDocument(userAuth?.uid);
            setUser(prevUser => ({
                user,
                isLoaded: true
            }));
        });
    }, []);

    return (
        <UserContext.Provider value={user}>
            {props.children}
        </UserContext.Provider>
    );

};

export default UserProvider;
