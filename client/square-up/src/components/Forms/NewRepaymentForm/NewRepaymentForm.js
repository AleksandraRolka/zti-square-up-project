import React, { useState } from "react";
import "./NewRepaymentForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getCurrentUser } from "../../../services/auth-service";
import { config } from "../../../services/header-service";
import Form from "react-bootstrap/Form";

const NewRepaymentForm = () => {
    const [isInfo, setIsInfo] = useState(false);
    const [info, setInfo] = useState("");
    const [groups, setGroups] = useState([]);
    const [groupMembers, setGroupMembers] = useState([]);
    const [selectedGroup, setSellectedGroup] = useState();
    const [selectedUser, setSellectedUser] = useState();
    const [selectedAmount, setSelectedAmount] = useState(0.0);

    let currUser = getCurrentUser();

    const navigate = useNavigate();

    function fetchUserGroups() {
        currUser = getCurrentUser();
        axios({
            method: "get",
            url: `api/user/${currUser.user_id}/groups`,
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

    function setGroupMembersBySelecetedGroupId(id) {
        currUser = getCurrentUser();
        if (id == -100) {
            setGroupMembers([]);
        } else {
            groups.forEach((group) => {
                if (group.id == id) {
                    const groupMembersWithOutCurrent = group.members.filter(
                        (member) => {
                            return member.id != currUser.user_id;
                        }
                    );
                    setGroupMembers(groupMembersWithOutCurrent);
                }
            });
        }
    }

    useEffect(() => {
        currUser = getCurrentUser();
        fetchUserGroups();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            title: "Payment",
            description: "",
            group_id: selectedGroup,
            paid_by: currUser.user_id,
            amount: Math.abs(selectedAmount),
            is_it_payment: true,
            payment_details: {
                from_user_id: currUser.user_id,
                to_user_id: selectedUser,
                amount: Math.abs(selectedAmount),
                group_id: selectedGroup,
            },
            split_details: [],
        };

        axios({
            method: "post",
            url: `api/expense/add`,
            headers: config(),
            data: data,
        })
            .then((res) => {
                setIsInfo(true);
                setInfo("Payment made sucessfully!");
                setTimeout(() => {
                    setIsInfo(false);
                    navigate("/dashboard");
                }, 1000);
            })
            .catch((error) => {
                console.log(error);
                setIsInfo(true);
                setInfo("Repayment process failed..");
                setTimeout(() => {
                    setIsInfo(false);
                }, 2000);
            });
    };

    return (
        <div className="new-group-form-div">
            <form onSubmit={handleSubmit}>
                <h3>Let's settle up!</h3>
                <h3>Create new payment</h3>
                {isInfo ? <p className="info-message">{info}</p> : <p />}

                <div className="form-group">
                    <label>
                        Select group in which you would like to make
                        transaction:
                    </label>
                    <Form.Select
                        aria-label="Default select example"
                        onChange={(e) => {
                            console.log("Selected groups change..");
                            setSellectedGroup(parseInt(e.target.value));
                            setGroupMembersBySelecetedGroupId(
                                parseInt(e.target.value)
                            );
                        }}
                        required
                    >
                        <option value={-100}>-</option>
                        {groups.map((group) => (
                            <option key={`g-${group.id}`} value={group.id}>
                                {group.name}
                            </option>
                        ))}
                        ;
                    </Form.Select>
                    <label>Select person to which transfer the money:</label>
                    <Form.Select
                        aria-label="Default select example"
                        onChange={(e) => {
                            setSellectedUser(parseInt(e.target.value));
                        }}
                        required
                    >
                        <option value={-100}>-</option>
                        {groupMembers.map((member) => (
                            <option key={`m-${member.id}`} value={member.id}>
                                {
                                    member.firstName + " " + member.lastName
                                    // +
                                    // " (" +
                                    // member.email +
                                    // ")"
                                }
                            </option>
                        ))}
                        ;
                    </Form.Select>
                    <label>Enter amount:</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="0.00"
                        required={true}
                        minLength={2}
                        maxLength={50}
                        onChange={(e) => {
                            setSelectedAmount(parseFloat(e.target.value));
                        }}
                    />
                </div>
                <br />
                <button
                    type="submit"
                    className="btn btn-dark btn-lg btn-block form-submit-button"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default NewRepaymentForm;
