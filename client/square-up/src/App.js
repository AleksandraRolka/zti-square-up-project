import React, { useState, useEffect } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/Navbar/Navbar.js";
import Panel from "./components/Panel/Panel.js";
import Login from "./components/Login/Login.js";
import Register from "./components/Register/Register.js";
import {
    BrowserRouter,
    Navigate as Redirect,
    Route,
    Routes,
} from "react-router-dom";
import "./App.css";
import axios from "axios";
import config from "./services/header-service.js";
import { logout, getCurrentUser } from "./services/auth-service.js";
import { useCallback } from "react";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [accessToken, setAccessToken] = useLocalStorage("accessToken", "");
    // useState("");

    function useLocalStorage(key, initialState) {
        const [value, setValue] = useState(
            localStorage.getItem(key) ?? initialState
        );
        const updatedSetValue = useCallback(
            (newValue) => {
                if (
                    newValue === initialState ||
                    typeof newValue === "undefined"
                ) {
                    localStorage.removeItem(key);
                } else {
                    localStorage.setItem(key, newValue);
                }
                setValue(newValue ?? initialState);
            },
            [initialState, key]
        );
        return [value, updatedSetValue];
    }

    useEffect(() => {
        async function init() {
            const token = await localStorage.getItem("access_token");
            setAccessToken(token);
            if (token) {
                console.log("I'm in if:");
                setIsAuthenticated(true);
            } else {
                console.log("I'm in else:");
                setIsAuthenticated(false);
                logout();
            }
        }
        init();
    }, [accessToken]);

    // useEffect(() => {
    //     async function init() {
    //         const token = await localStorage.getItem("access_token");
    //         setAccessToken(token);
    //         if (token) {
    //             console.log("I'm in if:");
    //             setIsAuthenticated(true);
    //         } else {
    //             console.log("I'm in else:");
    //             setIsAuthenticated(false);
    //             logout();
    //         }
    //     }
    //     init();
    // }, [accessToken]);

    // useEffect(() => {
    //     console.log("I'm in useEffect:");
    //     let token = localStorage.getItem("access_token");
    //     setAccessToken(accessToken);
    //     console.log("token:", token);
    //     if (token) {
    //         console.log("I'm in if:");
    //         setIsAuthenticated(true);
    //         axios
    //             .get("api/user", config)
    //             .then((data) => {
    //                 console.log(data);
    //                 setIsAuthenticated(true);
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //                 setIsAuthenticated(false);
    //                 logout();
    //             });
    //     } else {
    //         console.log("I'm in else:");
    //         setIsAuthenticated(false);
    //         logout();
    //     }
    // }, [localStorage.getItem("access_token")]);

    // useEffect(() => {
    //     console.log("I'm in useEffect:");
    //     function checkIfAuthenticated() {
    //         const token = localStorage.getItem("access_token");
    //         if (token) {
    //             console.log("I'm in if:");
    //             setIsAuthenticated(true);
    //         } else {
    //             console.log("I'm in else:");
    //             setIsAuthenticated(false);
    //             logout();
    //         }
    //     }
    //     checkIfAuthenticated();
    //     window.addEventListener("storage", checkIfAuthenticated);
    //     return () => {
    //         window.removeEventListener("storage", checkIfAuthenticated);
    //     };
    // }, []);

    return (
        <BrowserRouter>
            <NavBar isLoggedIn={isAuthenticated} />
            <Routes>
                <Route
                    exact
                    path="/"
                    element={
                        isAuthenticated ? <Panel /> : <Redirect to="/login" />
                    }
                />
                <Route
                    exact
                    path="/dashboard"
                    element={
                        isAuthenticated ? <Panel /> : <Redirect to="/login" />
                    }
                />
                <Route
                    exact
                    path="/login"
                    element={isAuthenticated ? <Redirect to="/" /> : <Login />}
                />
                <Route
                    exact
                    path="/register"
                    element={
                        isAuthenticated ? <Redirect to="/" /> : <Register />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
