import React from "react";
import "./LeftPanel.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import axios from "axios";
import { config } from "../../../services/header-service";
import { getCurrentUser } from "../../../services/auth-service";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const LeftPanel = ({ user }) => {
    const [groups, setGroups] = useState([]);
    user = getCurrentUser();

    function fetchUserGroups() {
        user = getCurrentUser();
        axios({
            method: "get",
            url: `api/user/${user.user_id}/groups`,
            headers: config(),
        })
            .then((res) => {
                let userGroups = res.data;
                setGroups(userGroups);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        user = getCurrentUser();
        fetchUserGroups();
    }, []);

    return (
        <>
            <Navbar bg="light" expand="lg" style={{ marginTop: "8px" }}>
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto flex-column">
                            <Nav.Link as={Link} to="/dashboard">
                                Dashboard
                            </Nav.Link>
                            <br style={{ backgroundColor: "yellow" }} />
                            <Nav.Link as={Link} to="/expenses">
                                All expenses
                            </Nav.Link>
                            <br />
                            <NavDropdown
                                title="Groups"
                                id="basic-nav-dropdown"
                                // show={true}
                            >
                                {groups.map(
                                    ({
                                        id,
                                        name,
                                        createdAt,
                                        members,
                                        updatedAt,
                                    }) => (
                                        <NavDropdown.Item
                                            as={Link}
                                            to={`/group/${id}`}
                                            key={id}
                                        >
                                            {name}
                                        </NavDropdown.Item>
                                    )
                                )}
                                <NavDropdown.Divider />
                                <NavDropdown.Item
                                    as={Link}
                                    to={`/addgroup`}
                                    key={-10}
                                    style={{ color: "rgb(26, 181, 98)" }}
                                >
                                    Add new group
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};
export default LeftPanel;
