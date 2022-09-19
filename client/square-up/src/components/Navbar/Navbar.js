import React from "react";
import "./Navbar.css";
import { Nav, Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { logout } from "../../services/auth-service";

const NavBar = ({ isLoggedIn }) => {
    return (
        <Navbar expand="lg" variant="light" bg="light" className="app-navbar">
            <Container className="app-navbar-container">
                <Navbar.Brand href="">
                    <img
                        id="logo"
                        alt="Logo"
                        src={require("../../assets/logo_inline_wb.png")}
                        height="32px"
                    />
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Nav>
                        {isLoggedIn ? (
                            <Nav.Link href="" onClick={() => logout()}>
                                Logout
                            </Nav.Link>
                        ) : (
                            <>
                                <div className="nav-link-button">
                                    <Nav.Link
                                        as={Link}
                                        to="/login"
                                        className="nav-link-button"
                                    >
                                        Log in
                                    </Nav.Link>
                                </div>
                                <div className="nav-link-button">
                                    <Nav.Link as={Link} to="/register">
                                        Sign up
                                    </Nav.Link>
                                </div>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
