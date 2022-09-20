import React from "react";
import "./RightPanel.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ForDashboard from "./ForDashboard/ForDashboard";
import ForExpensesView from "./ForExpensesView/ForExpensesView";
import ForGroupView from "./ForGroupView/ForGroupView";

const RightPanel = () => {
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
                <ForDashboard />
            ) : currPath.startsWith("/expenses") ? (
                <ForExpensesView />
            ) : currPath.startsWith("/group/") ? (
                <ForGroupView />
            ) : (
                <h1></h1>
            )}
        </div>
    );
};

export default RightPanel;
