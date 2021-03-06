import React, {FC, useCallback, useState} from "react";
import "./login.css";
import {ILoginProps} from "./ILogin";
import ErrorFallback from "../../components/errorFallback/ErrorFallback";
import {ErrorBoundary} from "../../components/errorBoundary/ErrorBoundary";
import {notify} from "../../services/notify/Notify";
import {emailPattern, validateEmail, validatePassword} from "../../services/validation/Validations";
import {auth} from "../../firebase/initializeFirebase";
import Avatar from "../../images/img_avatar.png";
import Input from "../../components/styled-tags/input/Input";
import Button from "../../components/styled-tags/button/Button";

const Login: FC<ILoginProps> = (): JSX.Element =>
{
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [processing, setProcessing] = useState<boolean>(false);

    const handleLoginSubmit = useCallback((event: React.SyntheticEvent): void =>
    {
        event.preventDefault();

        if (!processing && email && password)
        {
            setProcessing(true);
            auth.signInWithEmailAndPassword(email, password)
                .catch((error) =>
                {
                    setProcessing(false);
                    notify(error.message, "danger");
                });
        }
    }, [email, password, processing]);

    const handleChangeInput = useCallback((event: React.ChangeEvent<HTMLInputElement>): void =>
    {
        const {name, value} = event.target;
        const trimmedValue: string = value.trim();

        switch (name)
        {
            case "password":
                setPassword(prevPassword => trimmedValue);
                break;
            case "email":
                setEmail(prevEmail => trimmedValue);
                break;
            default:
        }
    }, []);

    const validEmail: boolean = validateEmail(email);
    const validPassword: boolean = validatePassword(password);
    return (
        <ErrorBoundary fallback={<ErrorFallback/>}>
            <section className={"formContainer"}>
                <h2>Login Form</h2>
                <form onSubmit={handleLoginSubmit}>
                    <div className="imgContainer">
                        <img src={Avatar} alt="Avatar" className="avatar"/>
                    </div>
                    <main className="inputsContainer">
                        <Input
                            type="email"
                            name="email"
                            label={"Email"}
                            required
                            value={email}
                            pattern={emailPattern}
                            onChange={handleChangeInput}
                            placeholder="Enter Email"
                            withValidation
                            isValid={validEmail}
                            validationText={"Please insert right email format!"}
                        />
                        <Input
                            type="password"
                            name="password"
                            label={"Password"}
                            required
                            value={password}
                            onChange={handleChangeInput}
                            placeholder="Enter Password"
                            withValidation
                            isValid={validPassword}
                            validationText={`Please insert 7 or bigger characters! (${password?.length || 0})`}
                        />
                        <Button
                            type="submit"
                            className={"submitButton"}
                            disabled={!validEmail || !validPassword}
                            processing={processing}
                        >
                            Login
                        </Button>
                    </main>
                </form>
            </section>
        </ErrorBoundary>
    );
};

export default Login;
