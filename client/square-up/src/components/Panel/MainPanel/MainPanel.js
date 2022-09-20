import React from "react";
import "./MainPanel.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "./Dashboard/Dashboard";
import GroupView from "./GroupView/GroupView";
import ExpensesView from "./ExpensesView/ExpensesView";

const MainPanel = () => {
    const [currPath, setCurrPath] = useState("");

    const path = useLocation().pathname;

    useEffect(() => {
        const path = window.location.pathname;
        console.log(path);
        setCurrPath(path);
    }, [window.location.pathname]);

    return (
        <div>
            {currPath.startsWith("/dashboard") ? (
                <Dashboard />
            ) : currPath.startsWith("/expenses") ? (
                <ExpensesView />
            ) : currPath.startsWith("/group/") ? (
                <GroupView />
            ) : (
                <h1></h1>
            )}
        </div>
    );
};

export default MainPanel;
