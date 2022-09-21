import React from "react";
import "./GroupView.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../../../services/header-service";
import { getCurrentUser } from "../../../../services/auth-service";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";

const GroupView = () => {
    const [currGroupName, setCurrGroupName] = useState("");
    const [currGroupId, setCurrGroupId] = useState();
    const [currPath, setCurrPath] = useState("");
    const [groupMembers, setGroupMembers] = useState();
    const [allExpenses, setAllExpenses] = useState([]);
    const [allGroupRelatedExpenses, setAllGroupRelatedExpenses] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    let user = getCurrentUser();
    let path = useLocation().pathname;

    function fetchAllUserExpenses() {
        user = getCurrentUser();
        axios({
            method: "get",
            url: `api/expense/get/all`,
            headers: config(),
        })
            .then((res) => {
                let expenses = res.data;
                let groupRelatedExpenses = [];
                setAllExpenses(expenses);
                expenses.forEach((expense) => {
                    path = window.location.pathname;
                    const currentGroupId = path.substring("group/".length + 1);
                    if (expense.groupId == currentGroupId) {
                        groupRelatedExpenses.push(expense);
                    }
                });
                console.log("all expenses: ", expenses);
                console.log("userRelatedExpenses: ", groupRelatedExpenses);
                setAllGroupRelatedExpenses(groupRelatedExpenses);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function fetchGroupInfo() {
        path = window.location.pathname;
        setCurrPath(path);
        const id = path.substring("group/".length + 1);
        setCurrGroupId(id);
        axios({
            method: "get",
            url: `api/group/${id}`,
            headers: config(),
        })
            .then((res) => {
                let groupInfo = res.data;
                setCurrGroupId(groupInfo.id);
                setCurrGroupName(groupInfo.name);
                setGroupMembers(groupInfo.members);
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
    function getUserName(id) {
        let gr = allUsers.filter((user) => {
            return user.id == id;
        })[0];
        if (gr) return gr.firstName;
    }

    function getGroupName(id) {
        console.log(allGroupRelatedExpenses);
        let gr = allGroupRelatedExpenses.filter((user) => {
            return user.id == id;
        })[0];
        if (gr) return gr.name;
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
        let to = toUserId == user.user_id ? "you" : getUserName(toUserId);
        return from + " transfered money to " + to + ".";
    }

    useEffect(() => {
        user = getCurrentUser();
        fetchAllUsers();
        fetchGroupInfo();
    }, []);

    useEffect(() => {
        path = window.location.pathname;
        setCurrPath(path);
        setCurrGroupId(path.substring("group/".length + 1));
        fetchGroupInfo();
        fetchAllUserExpenses();
    }, [window.location.pathname]);

    return (
        <>
            <div className="main-panel-header">
                <Container>
                    <Row>
                        <Col>
                            <h5>{currGroupName}</h5>
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
                {allGroupRelatedExpenses.map((expense) => (
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
                                                    {/* {
                                                        getUserInfo(
                                                            expense.paidBy
                                                        ).firstName
                                                    }{" "} */}
                                                    {getGroupName(
                                                        expense.groupId
                                                    )}
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

export default GroupView;
