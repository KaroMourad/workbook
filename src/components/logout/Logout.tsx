import React, {FC, useState} from "react";
import {auth} from "../../firebase/initializeFirebase";
import Button from "../button/Button";
import {notify} from "../../services/notify/Notify";
import {ILogoutProps} from "./ILogout";
import "./logout.css";

const Logout: FC<ILogoutProps> = ({style = {}}): JSX.Element =>
{
    const [processing, setProcessing] = useState<boolean>(false);

    const handleLogout = (): void =>
    {
        if (!processing)
        {
            setProcessing(true);
            auth.signOut()
                .then(() => notify("User has been successfully signed out!", "success"))
                .catch((error) => notify(error.message, "danger"));
        }
    };

    return (
        <Button
            className={"logout"}
            style={style}
            processing={processing}
            onClick={handleLogout}
        >
            Logout
        </Button>
    );
};

export default Logout;
