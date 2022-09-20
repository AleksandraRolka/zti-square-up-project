import React from "react";
import "./Dashboard.css";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../../../services/auth-service";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { config } from "../../../../services/header-service";

const Dashboard = () => {
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
            <div className="main-panel-header">
                <h5>Dashboard</h5>
            </div>
            <Container>
                <Row>
                    <Col className="square border sum-up-content">
                        <p>you owe</p>
                        <p className="sum-up-amount-owe">
                            {oweAmount.toPrecision(3)}
                        </p>
                    </Col>
                    <Col className="square border sum-up-content">
                        <p>you are owed</p>
                        <p className="sum-up-amount-owed">
                            {owedAmount.toPrecision(3)}
                        </p>
                    </Col>
                    <Col className="square border sum-up-content">
                        <p>total balance</p>
                        <p className="sum-up-amount-total">
                            {totalBalance.toPrecision(3)}
                        </p>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Dashboard;
