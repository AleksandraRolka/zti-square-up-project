import React from "react";
import "./ForDashboard.css";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "../../../../services/auth-service";
import axios from "axios";
import { config } from "../../../../services/header-service";

const ForDashboard = () => {
    // const [currPath, setCurrPath] = useState("");
    let user = getCurrentUser();
    const [oweAmount, setOweAmount] = useState(0.0);
    const [owedAmount, setOwedAmount] = useState(0.0);
    const [totalBalance, setTotalBalance] = useState(0.0);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [currentUser, setCurrentUser] = useState();

    function fetchUserBalance() {
        axios({
            method: "get",
            url: `api/user/${user.user_id}/balance`,
            headers: config(),
        })
            .then((res) => {
                let userBalance = res.data;
                setOweAmount(userBalance.oweAmount);
                setOwedAmount(userBalance.owedAmount);
                setTotalBalance(userBalance.totalBalance);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        user = getCurrentUser();
        setCurrentUser(user);
        setFirstName(user.first_name);
        setLastName(user.last_name);
        setEmail(user.email);
        fetchUserBalance();
    }, []);

    return (
        <>
            <p className="dashboard-right-panel-header">Profile:</p>
            <div className="userdata-info-div">
                <p>{firstName + " " + lastName}</p>
                <p>{email}</p>
            </div>
        </>
    );
};

export default ForDashboard;
