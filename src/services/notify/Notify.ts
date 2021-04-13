import {store} from "react-notifications-component";

export function notify(message: string, type: "success" | "danger" | "info" | "default" | "warning" | undefined)
{
    store.addNotification({
        message: message,
        type: type,
        insert: "bottom",
        container: "bottom-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 10000,
            onScreen: true
        }
    });
}

