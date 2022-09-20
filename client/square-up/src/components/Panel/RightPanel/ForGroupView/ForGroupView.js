import React from "react";
import "./ForGroupView.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../../../services/header-service";
import { getCurrentUser } from "../../../../services/auth-service";

const ForGroupView = () => {
    const [currGroupName, setCurrGroupName] = useState("");
    const [currGroupId, setCurrGroupId] = useState();
    const [currPath, setCurrPath] = useState("");
    const [groupMembers, setGroupMembers] = useState([]);

    let user = getCurrentUser();
    let path = useLocation().pathname;

    useEffect(() => {
        path = window.location.pathname;
        setCurrPath(path);
        setCurrGroupId(path.substring("group/".length + 1));
        fetchGroupInfo();
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

    return (
        <>
            <p className="group-right-panel-header">Group members</p>
            <ul>
                {groupMembers.map((member) => {
                    return (
                        <li>
                            <>
                                <span className="p-fullname">
                                    {member.firstName + " " + member.lastName}
                                </span>
                                <span className="p-email">
                                    {" " + member.email}
                                </span>
                            </>
                        </li>
                    );
                })}
            </ul>
        </>
    );
};

export default ForGroupView;
