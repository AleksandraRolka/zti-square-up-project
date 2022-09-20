import React from "react";
import "./ForDashboard.css";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../../../services/auth-service";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { config } from "../../../../services/header-service";

const ForDashboard = () => {
    // const [currPath, setCurrPath] = useState("");
    let user = getCurrentUser();
    const [oweAmount, setOweAmount] = useState(0.0);
    const [owedAmount, setOwedAmount] = useState(0.0);
    const [totalBalance, setTotalBalance] = useState(0.0);

    function fetchUserBalance() {
        axios({
            method: "get",
            url: `api/user/${user.user_id}/balance`,
            headers: config(),
        })
            .then((res) => {
                console.log(res.data);
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
        fetchUserBalance();
    }, []);

    return (
        <>
            <h5>ForDashboard</h5>
        </>
    );
};

export default ForDashboard;
