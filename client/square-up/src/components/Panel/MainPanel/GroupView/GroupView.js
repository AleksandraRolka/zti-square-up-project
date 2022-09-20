import React from "react";
import "./GroupView.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../../../services/header-service";
import { getCurrentUser } from "../../../../services/auth-service";

const GroupView = () => {
    const [currGroupName, setCurrGroupName] = useState("");
    const [currGroupId, setCurrGroupId] = useState();
    const [currPath, setCurrPath] = useState("");
    const [groupMembers, setGroupMembers] = useState();

    let user = getCurrentUser();
    let path = useLocation().pathname;

    useEffect(() => {
        path = window.location.pathname;
        setCurrPath(path);
        setCurrGroupId(path.substring("group/".length + 1));
    }, [window.location.pathname]);

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
                console.log(groupInfo);
                setCurrGroupId(groupInfo.id);
                setCurrGroupName(groupInfo.name);
                setGroupMembers(groupInfo.groupMembers);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        user = getCurrentUser();
        fetchGroupInfo();
    }, []);

    return (
        <>
            <div className="main-panel-header">
                <h5>{currGroupName}</h5>
            </div>
        </>
    );
};

export default GroupView;
