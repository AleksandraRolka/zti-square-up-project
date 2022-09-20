import React, { useState } from "react";
import "./NewGroupForm.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getCurrentUser } from "../../../services/auth-service";
import { config } from "../../../services/header-service";
import Multiselect from "multiselect-react-dropdown";

const NewGroupForm = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [usersToAdd, setUsersToAdd] = useState([]);
    let user = getCurrentUser();

    const [isInfo, setIsInfo] = useState(false);
    const [info, setInfo] = useState("");

    const navigate = useNavigate();
    const data = [
        { value: "One", selected: true },
        { value: "Two" },
        { value: "Three" },
    ];

    function fetchUsers() {
        axios({
            method: "get",
            url: `api/user/${user.user_id}/groups`,
            headers: config(),
        })
            .then((res) => {
                let allUsers = res.data;
                setAllUsers(allUsers);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        user = getCurrentUser();
        fetchUsers();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            name: groupName,
            members: usersToAdd,
        };

        axios
            .post("api/group/save", data)
            .then((res) => {
                setIsInfo(true);
                setInfo("Group created sucessfully!");
                setTimeout(() => {
                    setIsInfo(false);
                    navigate("/dashboard");
                }, 1000);
            })
            .catch((error) => {
                console.log(error);
                setIsInfo(true);
                setInfo("Creating new group failed..");
                setTimeout(() => {
                    setIsInfo(false);
                    navigate("/addgroup");
                }, 2000);
            });
    };
    const options = [
        { name: "Option 1️⃣", id: 1 },
        { name: "Option 2️⃣", id: 2 },
    ];

    // const handleMultiselectChange = () => {};
    const onSelect = (selectedList, selectedItem) => {};

    const onRemove = (selectedList, removedItem) => {};

    return (
        <div className="new-group-form-div">
            <form onSubmit={handleSubmit}>
                <h3>Create new group</h3>
                {isInfo ? <p className="info-message">{info}</p> : <p />}

                <div className="form-group">
                    <label>Group name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Group name"
                        required={true}
                        minLength={2}
                        maxLength={50}
                        onChange={(e) => {
                            setGroupName(e.target.value);
                        }}
                    />
                </div>
                <Multiselect
                    options={options} // Options to display in the dropdown
                    selectedValues={selectedValue} // Preselected value to persist in dropdown
                    onSelect={onSelect} // Function will trigger on select event
                    onRemove={onRemove} // Function will trigger on remove event
                    displayValue="name" // Property name to display in the dropdown options
                />

                {/* 
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setIsEmailValid(isEmail(e.target.value));
                        }}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setIsPassswordChecklistVisible(true);
                        }}
                    />
                    {isPassswordChecklistVisible ? (
                        <PasswordChecklist
                            rules={[
                                "minLength",
                                "specialChar",
                                "number",
                                "capital",
                            ]}
                            minLength={5}
                            value={password}
                            onChange={(isValid) => {
                                setIsPasswordValid(isValid);
                            }}
                        />
                    ) : (
                        <></>
                    )}
                </div> */}

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

export default NewGroupForm;
