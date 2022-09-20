import React from "react";
import "./ForDashboard.css";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../../../services/auth-service";
import axios from "axios";
import { config } from "../../../../services/header-service";

const ForDashboard = () => {
    // const [currPath, setCurrPath] = useState("");
    let user = getCurrentUser();
    const [oweAmount, setOweAmount] = useState(0.0);
    const [owedAmount, setOwedAmount] = useState(0.0);
    const [totalBalance, setTotalBalance] = useState(0.0);
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
        fetchUserBalance();
    }, []);

    return (
        <>
            <p className="dashboard-right-panel-header">Profile:</p>
            <div className="userdata-info-div">
                <p>{user.first_name + " " + user.last_name}</p>
                <p>{user.email}</p>
            </div>
        </>
    );
};

export default ForDashboard;
