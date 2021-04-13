import React, {createContext, FC, useEffect, useState} from "react";
import {auth} from "../../firebase/initializeFirebase";
import {IProviderProps, IUser, IUserContext} from "./IUserProvider";
import {notify} from "../../services/notify/Notify";
import {getUserDoc} from "../../services/usersApi/userApi";

export const UserContext = createContext<IUserContext>({user: null, isLoaded: false});

const UserProvider: FC<IProviderProps> = (props: IProviderProps): JSX.Element =>
{
    const [user, setUser] = useState<IUserContext>({
        user: null,
        isLoaded: false
    });

    const getUserDocument = async (uid?: string): Promise<IUser | null> =>
    {
        if (!uid) return null;
        try
        {
            const userDocument = await getUserDoc(uid);
            return {
                uid,
                ...userDocument.data()
            };
        } catch (error)
        {
            notify(error.message, "danger");
            return null;
        }
    };

    useEffect(() =>
    {
        auth.onAuthStateChanged(async userAuth =>
        {
            try {
                const user: IUser | null = await getUserDocument(userAuth?.uid);
                if(user) {
                    notify("User has successfully logged in!", "success");
                }
                setUser(prevUser => ({
                    user,
                    isLoaded: true
                }));
            } catch (error) {
                notify(error.message, "danger");
            }
        });
    }, []);

    return (
        <UserContext.Provider value={user}>
            {props.children}
        </UserContext.Provider>
    );

};

export default UserProvider;
