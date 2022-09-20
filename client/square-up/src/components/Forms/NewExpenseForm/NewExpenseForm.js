import React, { useState } from "react";
import "./NewExpenseForm.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getCurrentUser } from "../../../services/auth-service";
import { config } from "../../../services/header-service";
import Multiselect from "multiselect-react-dropdown";
import Form from "react-bootstrap/Form";

const NewExpenseForm = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [sharesToAdd, setSharesToAdd] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [options, setOptions] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [groupMembers, setGroupMembers] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState();
    const [selectedAmount, setSelectedAmount] = useState(0.0);
    const [isInfo, setIsInfo] = useState(false);
    const [info, setInfo] = useState("");
    const [groups, setGroups] = useState([]);
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

    function fetchUsers() {
        axios({
            method: "get",
            url: `api/users`,
            headers: config(),
        })
            .then((res) => {
                let users = res.data;
                setAllUsers(users);
                users = users.filter((userObj) => {
                    return userObj.email !== currUser.email;
                });
                setAllUsers(users);
                let allOptions = [];
                users.forEach((user) => {
                    allOptions.push({
                        value: user.id,
                        name: user.firstName + " " + user.lastName,
                        // +
                        // " (" +
                        // user.email +
                        // ")",
                        id: user.id,
                    });
                    setOptions(allOptions);
                });
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
        fetchUsers();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            title: title,
            description: description,
            group_id: selectedGroup,
            paid_by: currUser.user_id,
            amount: Math.abs(selectedAmount),
            is_it_payment: false,
            payment_details: {},
            split_details: sharesToAdd,
        };
        console.log(data);

        axios({
            method: "post",
            url: `api/expense/add`,
            headers: config(),
            data: data,
        })
            .then((res) => {
                setIsInfo(true);
                setInfo("New expense added sucessfully!");
                setTimeout(() => {
                    setIsInfo(false);
                    navigate("/dashboard");
                }, 1000);
            })
            .catch((error) => {
                console.log(error);
                setIsInfo(true);
                setInfo("Adding new expense failed..");
                setTimeout(() => {
                    setIsInfo(false);
                }, 2000);
            });
    };

    const onSelect = (selectedList, selectedItem) => {
        setSelectedOptions(selectedList);
        let shares_num = 1;
        selectedList.forEach(() => {
            shares_num = shares_num + 1;
        });

        let shares = selectedList.map((userData) => {
            return {
                id: userData.value,
                who_paid_id: currUser.user_id,
                who_owes_id: userData.value,
                group_id: selectedGroup,
                amount: selectedAmount / shares_num.toFixed(2),
            };
        });
        setSharesToAdd(shares);
    };

    const onRemove = (selectedList, removedItem) => {
        setSelectedOptions(selectedList);
        let shares_num = 1;
        selectedList.forEach(() => {
            shares_num = shares_num + 1;
        });

        let shares = selectedList.map((userData) => {
            return {
                id: userData.value,
                who_paid_id: currUser.user_id,
                who_owes_id: userData.value,
                group_id: selectedGroup,
                amount: selectedAmount / shares_num.toFixed(2),
            };
        });
        setSharesToAdd(shares);
    };

    return (
        <div className="new-group-form-div">
            <form onSubmit={handleSubmit}>
                <h3>Create new expense</h3>
                {isInfo ? <p className="info-message">{info}</p> : <p />}

                <div className="form-group">
                    <label>
                        Select group in which you would like to add new joint
                        expense:
                    </label>
                    <Form.Select
                        aria-label="Default select example"
                        onChange={(e) => {
                            console.log("Selected groups change..");
                            setSelectedGroup(parseInt(e.target.value));
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
                    <label>Title</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Title"
                        required={true}
                        minLength={2}
                        maxLength={50}
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                    />
                    <label>Description</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Description"
                        // required={true}
                        minLength={2}
                        maxLength={250}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                    />
                </div>
                <label>Amount:</label>
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
                <label>Select members to split cost with:</label>
                <Multiselect
                    options={options}
                    onSelect={onSelect}
                    onRemove={onRemove}
                    displayValue="name"
                />

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

export default NewExpenseForm;
