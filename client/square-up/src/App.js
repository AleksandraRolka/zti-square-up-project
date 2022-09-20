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
import {
    clearLocalStorage,
    useLocalStorage,
    verifyTokenAndRefreshIfNeeded,
    refetchUserInfoIfLost,
} from "./services/auth-service.js";
import NewGroupForm from "./components/Forms/NewGroupForm/NewGroupForm";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useLocalStorage("access_token", "");
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        async function init() {
            const token = await localStorage.getItem("access_token");
            setAccessToken(token);
            if (token) {
                verifyTokenAndRefreshIfNeeded();
                setIsAuthenticated(true);
                refetchUserInfoIfLost();
                const user = JSON.parse(localStorage.getItem("user"));
                if (user) setCurrentUser(user.user);
            } else {
                setIsAuthenticated(false);
                clearLocalStorage();
            }
        }
        init();
    }, [accessToken]);

    function checkIfStillAuthenticated() {
        if (isAuthenticated) {
            const token = localStorage.getItem("access_token");
            if (token) {
                verifyTokenAndRefreshIfNeeded();
                setIsAuthenticated(true);
                refetchUserInfoIfLost();
                const user = JSON.parse(localStorage.getItem("user"));
                if (user) setCurrentUser(user.user);
            } else {
                setIsAuthenticated(false);
                clearLocalStorage();
            }
        }
    }

    setInterval(checkIfStillAuthenticated, 150000);

    return (
        <BrowserRouter>
            <NavBar isLoggedIn={isAuthenticated} />
            <Routes>
                <Route
                    exact
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Redirect to="/dashboard" />
                        ) : (
                            <Redirect to="/login" />
                        )
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
                <Route
                    exact
                    path="/group/:id"
                    element={isAuthenticated ? <Panel /> : <Redirect to="/" />}
                />
                <Route
                    exact
                    path="/expenses"
                    element={isAuthenticated ? <Panel /> : <Redirect to="/" />}
                />
                <Route
                    exact
                    path="/addgroup"
                    element={
                        isAuthenticated ? <NewGroupForm /> : <Redirect to="/" />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
