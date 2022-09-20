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
    const [allUsers, setAllUsers] = useState([]);
    const [allGroups, setAllGroups] = useState([]);
    let user = getCurrentUser();

    useEffect(() => {
        user = getCurrentUser();
        fetchAllUserExpenses();
        fetchGroups();
        fetchAllUsers();
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
                        let flag = false;
                        expense.splitDetails.forEach((share) => {
                            if (
                                share.whoPaidId == user.user_id ||
                                share.whoOwesId == user.user_id
                            )
                                flag = true;
                        });
                        if (flag) {
                            userRelatedExpenses.push(expense);
                        }
                    }
                });
                setAllUserRelatedExpenses(userRelatedExpenses);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function fetchAllUsers() {
        axios({
            method: "get",
            url: `api/users`,
            headers: config(),
        })
            .then((res) => {
                let users = res.data;
                setAllUsers(users);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function getUserInfo(id) {
        return allUsers.filter((user) => {
            return user.id == id;
        })[0];
    }

    function getGroupInfo(id) {
        console.log(allGroups);
        return allGroups.filter((user) => {
            return user.id == id;
        })[0];
    }

    function fetchGroups() {
        axios({
            method: "get",
            url: `api/groups/`,
            headers: config(),
        })
            .then((res) => {
                setAllGroups(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function getAllAmountLentByUser(userId, expense) {
        let sum = 0.0;
        expense.splitDetails.forEach((share) => {
            if (share.whoPaidId == userId) sum = sum + share.amount;
        });
        return sum.toFixed(2);
    }

    function getAmountLentByUser(userId, expense) {
        let sum = 0.0;
        expense.splitDetails.forEach((share) => {
            if (share.whoOwesId == userId) sum = sum + share.amount;
        });
        return sum.toFixed(2);
    }

    function makePaymentDescription(fromUserId, toUserId) {
        let from =
            fromUserId == user.user_id
                ? "You"
                : getUserInfo(fromUserId).firstName;
        let to =
            toUserId == user.user_id ? "you" : getUserInfo(toUserId).firstName;
        return from + " transfered money to " + to + ".";
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
                        <Container>
                            <Row className="expense-row">
                                <Col>
                                    <Row>
                                        <Col className="expense-date-col">
                                            <p className="expense-date">
                                                {
                                                    expense.createdAt.split(
                                                        " "
                                                    )[0]
                                                }
                                            </p>
                                        </Col>
                                        <Col xs={10}>
                                            <span className="group-name">
                                                {
                                                    getGroupInfo(
                                                        expense.groupId
                                                    ).name
                                                }
                                            </span>
                                            <p className="expense-title">
                                                {expense.title}
                                            </p>
                                            <p className="expense-description">
                                                {expense.isItPayment
                                                    ? makePaymentDescription(
                                                          expense.paymentDetails
                                                              .fromUserId,
                                                          expense.paymentDetails
                                                              .toUserId
                                                      )
                                                    : expense.description}
                                            </p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md="auto">
                                    {expense.paidBy == user.user_id ? (
                                        <>
                                            {expense.isItPayment ? (
                                                <>
                                                    <p> </p>
                                                    <br />
                                                </>
                                            ) : (
                                                <>
                                                    <p className="paid-by-info">
                                                        You paid
                                                    </p>
                                                    <p className="paid-by-amount">
                                                        {parseFloat(
                                                            expense.amount
                                                        ).toFixed(2)}
                                                    </p>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {expense.isItPayment ? (
                                                <>
                                                    <p> </p>
                                                    <br />
                                                </>
                                            ) : (
                                                <p className="paid-by-info">
                                                    {
                                                        getUserInfo(
                                                            expense.paidBy
                                                        ).firstName
                                                    }{" "}
                                                    paid
                                                </p>
                                            )}
                                            <p className="paid-by-amount">
                                                {parseFloat(
                                                    expense.amount
                                                ).toFixed(2)}
                                            </p>
                                        </>
                                    )}
                                </Col>
                                <Col xs lg="2">
                                    {expense.paidBy == user.user_id ? (
                                        <>
                                            {expense.isItPayment ? (
                                                <p> </p>
                                            ) : (
                                                <>
                                                    <p className="lent-by-info">
                                                        You lent
                                                    </p>
                                                    <p className="lent-by-amount green">
                                                        {getAllAmountLentByUser(
                                                            user.user_id,
                                                            expense
                                                        )}
                                                    </p>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {expense.isItPayment ? (
                                                <p> </p>
                                            ) : (
                                                <>
                                                    <p className="lent-by-info">
                                                        {
                                                            getUserInfo(
                                                                expense.paidBy
                                                            ).firstName
                                                        }{" "}
                                                        lent you
                                                    </p>
                                                    <p className="lent-by-amount orange">
                                                        {getAmountLentByUser(
                                                            user.user_id,
                                                            expense
                                                        )}
                                                    </p>
                                                </>
                                            )}
                                        </>
                                    )}
                                </Col>
                            </Row>
                        </Container>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    );
};

export default ExpensesView;
