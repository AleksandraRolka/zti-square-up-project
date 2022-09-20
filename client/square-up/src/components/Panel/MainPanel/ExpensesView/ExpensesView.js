import React from "react";
import "./ExpensesView.css";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../../../../services/auth-service";
import axios from "axios";
import { config } from "../../../../services/header-service";
import ListGroup from "react-bootstrap/ListGroup";

const ExpensesView = () => {
    const [allExpenses, setAllExpenses] = useState([]);
    const [allUserRelatedExpenses, setAllUserRelatedExpenses] = useState([]);
    let user = getCurrentUser();

    useEffect(() => {
        user = getCurrentUser();
        fetchAllUserExpenses();
    }, []);

    function fetchAllUserExpenses() {
        user = getCurrentUser();
        axios({
            method: "get",
            url: `api/expense/get/all`,
            headers: config(),
        })
            .then((res) => {
                let expenses = res.data;
                let userRelatedExpenses = [];
                setAllExpenses(expenses);
                expenses.forEach((expense) => {
                    if (expense.isItPayment) {
                        if (
                            expense.paymentDetails.fromUserId == user.user_id ||
                            expense.paymentDetails.toUserId == user.user_id
                        ) {
                            userRelatedExpenses.push(expense);
                        }
                    } else {
                        if (
                            expense.splitDetails.some((share) => {
                                return (
                                    share.whoPaidId == user.user_id ||
                                    share.whoOwesId == user.user_id
                                );
                            })
                        ) {
                            userRelatedExpenses.push(expense);
                        }
                    }
                });
                console.log("all expenses: ", expenses);
                console.log("userRelatedExpenses: ", userRelatedExpenses);
                setAllUserRelatedExpenses(userRelatedExpenses);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <>
            <div className="main-panel-header">
                <Container>
                    <Row>
                        <Col>
                            <h5>All expenses</h5>
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

            <ListGroup variant="flush">
                <br />
                {allUserRelatedExpenses.map((expense) => (
                    <ListGroup.Item>
                        <p className="expense-title">{expense.title}</p>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    );
};

export default ExpensesView;
