import React, { useState } from "react";
import "./ll.css";
import PasswordChecklist from "react-password-checklist";
import isEmail from "validator/lib/isEmail";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { parseJwt } from "../../services/auth-service.js";
import { config } from "../../services/header-service.js";

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
                const decodedJwt = parseJwt(res.data.access_token);
                const currentUserEmail = decodedJwt.sub;
                if (currentUserEmail) {
                    axios({
                        method: "post",
                        url: "/api/user",
                        headers: config(),
                        data: { email: currentUserEmail },
                    })
                        .then((res) => {
                            console.log(res.data);
                            let currentUserData = {
                                user_id: res.data.id,
                                first_name: res.data.firstName,
                                last_name: res.data.lastName,
                                email: res.data.email,
                                roles: res.data.roles,
                            };
                            localStorage.setItem(
                                "user",
                                JSON.stringify(currentUserData)
                            );
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
                setTimeout(() => {
                    setIsInfo(false);
                    window.location.reload();
                    window.redirect("/");
                }, 600);
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
