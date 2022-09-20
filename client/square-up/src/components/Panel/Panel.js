import React from "react";
import "./Panel.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import LeftPanel from "./LeftPanel/LeftPanel";
import MainPanel from "./MainPanel/MainPanel";
import RightPanel from "./RightPanel/RightPanel";
import { getCurrentUser } from "../../services/auth-service";
import { useState, useEffect } from "react";

const Panel = () => {
    let user = getCurrentUser();

    useEffect(() => {
        user = getCurrentUser();
    }, []);

    return (
        <Container className="main-layout-container ">
            <Row className="panel-row-container">
                <Col
                    md={{ span: 10, offset: 1 }}
                    className="panel-column-container"
                >
                    <Row>
                        <Col className="left-panel-container">
                            <LeftPanel user={user} />
                        </Col>
                        <Col
                            className="main-panel-container"
                            xs={6}
                            style={{ padding: "0px" }}
                        >
                            <MainPanel user={user} />
                        </Col>
                        <Col className="right-panel-container">
                            <RightPanel user={user} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default Panel;
