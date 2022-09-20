import React from "react";
import "./Dashboard.css";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../../../services/auth-service";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { config } from "../../../../services/header-service";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

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
                <Container>
                    <Row>
                        <Col>
                            <h5>Dashboard</h5>
                        </Col>
                        <Col md="auto">
                            <Button
                                className="main-dashboard-button button-add-expense"
                                variant="warning"
                                as={Link}
                                to={`/addexpense`}
                            >
                                Add expense
                            </Button>
                        </Col>
                        <Col xs lg="2">
                            <Button
                                className="main-dashboard-button button-settle-up"
                                variant="info"
                                as={Link}
                                to={`/settleup`}
                            >
                                Settle up
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Container>
                <Row>
                    <Col className="square border sum-up-content">
                        <p>you owe</p>
                        <p className="sum-up-amount-owe orange">
                            {"PLN " + oweAmount.toFixed(2)}
                        </p>
                    </Col>
                    <Col className="square border sum-up-content">
                        <p>you are owed</p>
                        <p className="sum-up-amount-owed green">
                            {"PLN " + owedAmount.toFixed(2)}
                        </p>
                    </Col>
                    <Col className="square border sum-up-content">
                        <p>total balance</p>
                        {totalBalance < 0 ? (
                            <p className="sum-up-amount-total orange">
                                {"PLN " + totalBalance.toFixed(2)}
                            </p>
                        ) : (
                            <p className="sum-up-amount-total green">
                                {"PLN " + totalBalance.toFixed(2)}
                            </p>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Dashboard;
