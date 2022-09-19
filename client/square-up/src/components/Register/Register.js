import React, { useState } from "react";
import "./Register.css";
import PasswordChecklist from "react-password-checklist";
import isEmail from "validator/lib/isEmail";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = ({}) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPassswordChecklistVisible, setIsPassswordChecklistVisible] =
        useState(false);
    const [isInfo, setIsInfo] = useState(false);
    const [info, setInfo] = useState("");

    const navigate = useNavigate();

    function validateFields() {
        return (
            (firstName.length >= 2) &
            (lastName.length >= 2) &
            (firstName.length <= 50) &
            (lastName.length <= 50) &
            isPasswordValid &
            isEmailValid
        );
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("here");

        const data = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
        };

        axios
            .post("api/auth/signup", data)
            .then((res) => {
                setIsInfo(true);
                setInfo("Sign up sucessfully!");
                setTimeout(() => {
                    setIsInfo(false);
                    navigate("/login");
                }, 1000);
            })
            .catch((error) => {
                console.log(error);
                setIsInfo(true);
                setInfo("Sign up has failed..");
                setTimeout(() => {
                    setIsInfo(false);
                }, 2000);
            });
    };

    return (
        <div className="register-form-div">
            <form onSubmit={handleSubmit}>
                <h3>Register</h3>
                {isInfo ? <p className="info-message">{info}</p> : <p />}

                <div className="form-group">
                    <label>First name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="First name"
                        required={true}
                        minLength={2}
                        maxLength={50}
                        onChange={(e) => {
                            setFirstName(e.target.value);
                        }}
                    />
                </div>

                <div className="form-group">
                    <label>Last name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Last name"
                        minLength={2}
                        maxLength={50}
                        onChange={(e) => {
                            setLastName(e.target.value);
                        }}
                    />
                </div>

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

                {validateFields() ? (
                    <button
                        type="submit"
                        className="btn btn-dark btn-lg btn-block register-button"
                    >
                        Register
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="btn btn-dark btn-lg btn-block register-button disabled"
                    >
                        Register
                    </button>
                )}
                <p className="info">
                    Already registered? <Link to="/login">Log in</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
