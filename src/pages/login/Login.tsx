import React, {FC, useState} from "react";
import "./login.css";
import {ILoginProps} from "./ILogin";
import ErrorFallback from "../../components/errorFallback/ErrorFallback";
import {ErrorBoundary} from "../../components/errorBoundary/ErrorBoundary";
import {auth} from "../../firebase/initializeFirebase";

const Login: FC<ILoginProps> = (): JSX.Element =>
{
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [processing, setProcessing] = useState<boolean>(false);

    const handleSubmit = (event: React.SyntheticEvent): void =>
    {
        event.preventDefault();

        if (!processing)
        {
            setProcessing(true);
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) =>
                {
                    // Signed in
                    // const {user} = userCredential;

                    // clear state to default values
                    setEmail("");
                    setPassword("");
                    setProcessing(false);
                })
                .catch((error) =>
                {
                    setProcessing(false);
                    // const errorCode = error.code;
                    // const errorMessage = error.message;
                });
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
    {
        const {name, value} = event.target;

        if (name === "password")
        {
            setPassword(prevPassword => value.trim());
        } else if (name === "email")
        {
            setEmail(prevEmail => value.trim());
        }
    };

    return (
        <ErrorBoundary fallback={<ErrorFallback/>}>
            <div className={"container"}>
                <h2>Login Form</h2>

                <form onSubmit={handleSubmit}>
                    <div className="imgContainer">
                        <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="Avatar" className="avatar"/>
                    </div>

                    <div className="inputsContainer">
                        <label htmlFor="email"><b>Email</b></label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            name="email"
                            required
                            disabled={processing}
                            value={email}
                            onChange={handleChange}
                        />

                        <label htmlFor="password"><b>Password</b></label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            required
                            disabled={processing}
                            value={password}
                            onChange={handleChange}
                        />
                        <button type="submit" disabled={processing}>Login</button>
                    </div>
                </form>
            </div>
        </ErrorBoundary>
    );
};

export default Login;
