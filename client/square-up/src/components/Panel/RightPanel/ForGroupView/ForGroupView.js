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
    const [allUserDebts, setAllUserDebts] = useState([]);

    let user = getCurrentUser();
    let path = useLocation().pathname;

    useEffect(() => {
        path = window.location.pathname;
        setCurrPath(path);
        setCurrGroupId(path.substring("group/".length + 1));
        fetchGroupInfo();
        fetchAllUserDebts();
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

    function fetchAllUserDebts() {
        path = window.location.pathname;
        const id = path.substring("group/".length + 1);
        axios({
            method: "get",
            url: `api/group/${id}/user/${user.user_id}/debt`,
            headers: config(),
        })
            .then((res) => {
                setAllUserDebts(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function getDebtBetweenCurrUserAndUserId(id) {
        if (allUserDebts.length > 0) {
            let debt = allUserDebts.filter((debt) => {
                return debt.secondUserId == id;
            });
            if (debt === undefined) {
                <spsn></spsn>;
            } else {
                return debt.at(0).balance.toFixed(2);
            }
        }
    }

    function debtBetweenInfo(id) {
        const debt = getDebtBetweenCurrUserAndUserId(id);
        if (debt == 0.0) {
            return <p className="debt-info blue">{"SQUARED UP"}</p>;
        } else if (debt > 0.0) {
            return (
                <p className="debt-info green">
                    {"OWES YOU:  " + debt + " PLN"}
                </p>
            );
        } else if (debt > 0.0) {
            return (
                <p className="debt-info orange">
                    {"YOU OWED:  " + debt + " PLN"}
                </p>
            );
        } else {
            return <></>;
        }
    }

    return (
        <>
            <p className="group-right-panel-header">Group members</p>
            <ul>
                {groupMembers.map((member) => {
                    return (
                        <>
                            <li>
                                <>
                                    <span className="p-fullname">
                                        {member.firstName +
                                            " " +
                                            member.lastName}
                                    </span>
                                    <span className="p-email">
                                        {" " + member.email}
                                    </span>
                                </>
                            </li>
                            {member.id != user.user_id ? (
                                <p>{debtBetweenInfo(member.id)}</p>
                            ) : (
                                <></>
                            )}
                        </>
                    );
                })}
            </ul>
        </>
    );
};

export default ForGroupView;
