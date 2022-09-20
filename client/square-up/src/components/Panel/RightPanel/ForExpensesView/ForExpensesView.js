import React from "react";
import "./ForExpensesView.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../../../services/auth-service";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { config } from "../../../../services/header-service";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const ForExpensesView = () => {
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
            <p className="dashboard-right-panel-header">YOUR TOTAL BALANCE</p>
            <div className="userdata-info-div">
                {totalBalance > 0 ? (
                    <>
                        <p className="balance-header green">YOU ARE OWED</p>
                        <p className="balance-amount green">
                            {"PLN " + totalBalance.toPrecision(3)}
                        </p>
                    </>
                ) : totalBalance < 0 ? (
                    <>
                        <p className="balance-header orange">YOU OWES</p>
                        <p className="balance-amount orange">
                            {"PLN " + -totalBalance.toPrecision(3)}
                        </p>
                    </>
                ) : (
                    <>
                        <p className="balance-header">YOU ARE ALL SETTLED!</p>
                    </>
                )}
            </div>
        </>
    );
};

export default ForExpensesView;
