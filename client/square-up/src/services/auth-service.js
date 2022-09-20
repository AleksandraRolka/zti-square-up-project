import { useCallback, useState } from "react";
import axios from "axios";
import { config } from "./header-service.js";

const clearLocalStorage = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
};

const logout = () => {
    clearLocalStorage();
    window.location.reload();
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const useLocalStorage = (key, initialState) => {
    const [value, setValue] = useState(
        localStorage.getItem(key) ?? initialState
    );
    const updatedSetValue = useCallback(
        (newValue) => {
            if (newValue === initialState || typeof newValue === "undefined") {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, newValue);
            }
            setValue(newValue ?? initialState);
        },
        [initialState, key]
    );
    return [value, updatedSetValue];
};

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
};

const verifyTokenAndRefreshIfNeeded = () => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
        const decodedJwt = parseJwt(accessToken);
        if (decodedJwt.exp * 1000 < Date.now()) {
            axios({
                method: "get",
                url: "/api/auth/token/refresh",
                headers: config(),
            })
                .then((res) => {
                    localStorage.setItem("access_token", res.data.access_token);
                    localStorage.setItem(
                        "refresh_token",
                        res.data.refresh_token
                    );
                })
                .catch((error) => {
                    console.log(error);
                    logout();
                });
        }
    }
};

const refetchUserInfoIfLost = () => {
    const user = getCurrentUser();
    if (!user) {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            const decodedJwt = parseJwt(accessToken);
            const currentUserEmail = decodedJwt.sub;
            if (currentUserEmail) {
                axios({
                    method: "post",
                    url: "/api/user",
                    headers: config(),
                    data: { email: currentUserEmail },
                })
                    .then((res) => {
                        let currentUserData = {
                            user_id: res.data.id,
                            first_name: res.data.firstName,
                            last_name: res.data.LastName,
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
        } else {
            logout();
        }
    }
};

export {
    clearLocalStorage,
    logout,
    getCurrentUser,
    useLocalStorage,
    parseJwt,
    verifyTokenAndRefreshIfNeeded,
    refetchUserInfoIfLost,
};
