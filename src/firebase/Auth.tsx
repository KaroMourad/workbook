import {auth, db} from "./initializeFirebase";
import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";

const useAuth = (): any[] =>
{
    const history = useHistory();
    const [userData, setUserData] = useState<{} | null>(null);

    useEffect(() =>
    {
        auth.onAuthStateChanged(user =>
        {
            debugger;
            if (user)
            {
                localStorage.setItem("user", user.uid);

                const docRef = db.collection("users").doc(user.uid);
                docRef.get()
                    .then((doc) =>
                    {
                        if (doc.exists)
                        {
                            const data = doc.data();
                            setUserData({
                                ...data,
                                id: user.uid
                            });
                        } else
                        {
                            // data will be undefined in this case
                            setUserData(null);
                        }
                    })
                    .then(() =>
                    {
                        history?.push("/workbook");
                    })
                    .catch((error) =>
                    {
                        console.log("Error getting document:", error);
                    });
            } else
            {
                history?.push("/login");
                setUserData(null);
                localStorage.removeItem("user");
            }
        });
    }, [history]);

    return [userData, setUserData];
};

export default useAuth;


auth.signOut();
