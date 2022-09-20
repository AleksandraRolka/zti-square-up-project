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

    useEffect(() => {
        user = getCurrentUser();
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
                        <p className="expense-title">{expense.title}</p>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    );
};

export default GroupView;
