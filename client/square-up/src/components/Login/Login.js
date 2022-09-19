import React, { useState } from "react";
import "./ll.css";
import PasswordChecklist from "react-password-checklist";
import isEmail from "validator/lib/isEmail";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = ({}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPassswordChecklistVisible, setIsPassswordChecklistVisible] =
        useState(false);
    const [isInfo, setIsInfo] = useState(false);
    const [info, setInfo] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        setIsInfo(false);
        event.preventDefault();

        const data = {
            email: email,
            password: password,
        };

        axios
            .post("api/auth/login", data)
            .then((res) => {
                setIsInfo(true);
                setInfo("Sign in sucessfully!");
                console.log("Access token: ", res.data.access_token);
                console.log("Refresh token: ", res.data.refresh_token);
                localStorage.setItem("access_token", res.data.access_token);
                localStorage.setItem("refresh_token", res.data.refresh_token);
                setTimeout(() => {
                    setIsInfo(false);
                    navigate("/");
                }, 1000);
            })
            .catch((error) => {
                console.log(error);
                setIsInfo(true);
                setInfo("Log in has failed..");
                setTimeout(() => {
                    setIsInfo(false);
                }, 2000);
            });
    };

    return (
        <div className="login-form-div">
            <form onSubmit={handleSubmit}>
                <h3>Log in</h3>
                {isInfo ? <p className="info-message">{info}</p> : <p />}

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setIsEmailValid(isEmail(e.target.value));
                        }}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPassword(e.target.value);
                            setIsPassswordChecklistVisible(true);
                        }}
                    />
                    {isPassswordChecklistVisible ? (
                        <PasswordChecklist
                            rules={[
                                "minLength",
                                "specialChar",
                                "number",
                                "capital",
                            ]}
                            minLength={5}
                            value={password}
                            onChange={(isValid) => {
                                setIsPasswordValid(isValid);
                            }}
                        />
                    ) : (
                        <></>
                    )}
                </div>
                {isPasswordValid & isEmailValid ? (
                    <button
                        type="submit"
                        className="btn btn-dark btn-lg btn-block login-button"
                    >
                        Sign in
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="btn btn-dark btn-lg btn-block login-button disabled"
                    >
                        Sign in
                    </button>
                )}
                <p className="info">
                    Don't have account yet? <Link to="/register">Sign up</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
