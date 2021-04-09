import React, {useState} from "react";
import {auth} from "../../firebase/initializeFirebase";
import Button from "../button/Button";

const Logout = (): JSX.Element =>
{
    const [processing, setProcessing] = useState<boolean>(false);

    const handleLogout = (): void =>
    {
        if (!processing)
        {
            setProcessing(true);
            auth.signOut().then(() => setProcessing(false));
        }
    };

    return (
        <Button className={"logout"} processing={processing} onClick={handleLogout}>
            Logout
        </Button>
    );
};

export default Logout;
