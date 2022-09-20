import React, { useState } from "react";
import "./NewRepaymentForm.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getCurrentUser } from "../../../services/auth-service";
import { config } from "../../../services/header-service";
import Multiselect from "multiselect-react-dropdown";

const NewRepaymentForm = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [usersToAdd, setUsersToAdd] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [options, setOptions] = useState([]);
    let user = getCurrentUser();

    const [isInfo, setIsInfo] = useState(false);
    const [info, setInfo] = useState("");

    const navigate = useNavigate();

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
                    return userObj.email !== user.email;
                });
                setAllUsers(users);
                let allOptions = [];
                users.forEach((user) => {
                    allOptions.push({
                        value: user.id,
                        name:
                            user.firstName +
                            " " +
                            user.lastName +
                            " (" +
                            user.email +
                            ")",
                        id: user.id,
                    });
                    setOptions(allOptions);
                });
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

        axios({
            method: "post",
            url: `api/group/save`,
            headers: config(),
            data: data,
        })
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
                }, 2000);
            });
    };

    const onSelect = (selectedList, selectedItem) => {
        setSelectedOptions(selectedList);
        let usersIds = selectedList.map((userData) => {
            return {
                id: userData.value,
            };
        });
        usersIds.push({ id: user.user_id });
        setUsersToAdd(usersIds);
    };

    const onRemove = (selectedList, removedItem) => {
        setSelectedOptions(selectedList);
        let usersIds = selectedList.map((userData) => {
            return {
                id: userData.value,
            };
        });
        usersIds.push({ id: user.user_id });
        setUsersToAdd(usersIds);
    };

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
                <br />
                <Multiselect
                    options={options} // Options to display in the dropdown
                    // selectedValues={selectedValue} // Preselected value to persist in dropdown
                    onSelect={onSelect} // Function will trigger on select event
                    onRemove={onRemove} // Function will trigger on remove event
                    displayValue="name" // Property name to display in the dropdown options
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

export default NewRepaymentForm;
