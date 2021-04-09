import React, {FC, useState} from "react";
import "./login.css";
import {ILoginProps} from "./ILogin";
import ErrorFallback from "../../components/errorFallback/ErrorFallback";
import {ErrorBoundary} from "../../components/errorBoundary/ErrorBoundary";
import {auth} from "../../firebase/initializeFirebase";
import Button from "../../components/button/Button";

const Login: FC<ILoginProps> = (): JSX.Element =>
{
    const [email, setEmail] = useState<string>("");
    const [validEmail, setValidEmail] = useState<boolean | undefined>();

    const [password, setPassword] = useState<string>("");
    const [validPassword, setValidPassword] = useState<boolean | undefined>();

    const [processing, setProcessing] = useState<boolean>(false);

    const handleSubmit = (event: React.SyntheticEvent): void =>
    {
        event.preventDefault();

        if (!processing)
        {
            setProcessing(true);
            auth.signInWithEmailAndPassword(email, password)
                .catch((error) =>
                {
                    setProcessing(false);
                    // const errorCode = error.code;
                    // const errorMessage = error.message;
                });
        }
    };

    const validateEmail = (value: string): boolean =>
    {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value))
        {
            return true;
        }
        return false;
    };

    const validatePassword = (value: string): boolean =>
    {
        if (value.length > 6)
        {
            return true;
        }
        return false;
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
    {
        const {name, value} = event.target;
        const trimmedValue = value.trim();

        if (name === "password")
        {
            setPassword(prevPassword => trimmedValue);
            setValidPassword(prevValidPass => validatePassword(trimmedValue));
        } else if (name === "email")
        {
            setEmail(prevEmail => trimmedValue);
            setValidEmail(prevValidEmail => validateEmail(trimmedValue));
        }
    };

    return (
        <ErrorBoundary fallback={<ErrorFallback/>}>
            <div className={"formContainer"}>
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
                            className={validEmail ? "valid" : "invalid"}
                            value={email}
                            onChange={handleChange}
                        />
                        {validEmail || validEmail === undefined ? null : (
                            <p style={{marginTop: 0}}>Please insert right email format!</p>
                        )}

                        <label htmlFor="password"><b>Password</b></label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            required
                            className={validPassword ? "valid" : "invalid"}
                            value={password}
                            onChange={handleChange}
                        />
                        {validPassword || validPassword === undefined ? null : (
                            <p style={{marginTop: 0}}>Please insert 7 or bigger characters! ({password.length})</p>
                        )}

                        <Button type="submit" processing={processing}>
                            Login
                        </Button>
                    </div>
                </form>
            </div>
        </ErrorBoundary>
    );
};

export default Login;
