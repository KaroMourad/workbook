import React, {useState} from "react";
import "./login.css";

const Login = (): JSX.Element =>
{
    const [username,setUsername] = useState<string>("");
    const [password,setPassword] = useState<string>("");

    const handleSubmit = (event: React.SyntheticEvent): void =>
    {
        event.preventDefault();
        // do login task TODO

        // clear state to default values
        setUsername("");
        setPassword("");
        console.log(username, password);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
    {
        const {target} = event;

        if(target.name === "psw")
        {
           setPassword(prevPassword => target.value.trim());
        }
        else if(target.name === "uname")
        {
            setUsername( prevUsername => target.value.trim());
        }
    }

    return (
        <div className={"container"}>
            <h2>Login Form</h2>

            <form onSubmit={handleSubmit}>
                <div className="imgContainer">
                    <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="Avatar" className="avatar" />
                </div>

                <div className="inputsContainer">
                    <label htmlFor="uname"><b>Username</b></label>
                    <input
                        type="text"
                        placeholder="Enter Username"
                        name="uname"
                        required
                        value={username}
                        onChange={handleChange}
                    />

                    <label htmlFor="psw"><b>Password</b></label>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        name="psw"
                        required
                        value={password}
                        onChange={handleChange}
                    />
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    );
};

export default Login;