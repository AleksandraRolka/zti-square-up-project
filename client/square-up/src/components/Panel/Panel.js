import React from "react";
import "./Panel.css";
import axios from "axios";

const Panel = () => {
    axios
        .get("api/users")
        .then((res) => {
            console.log(res.data);
        })
        .catch((err) => {
            console.log(err);
        });

    return <h1>Panel page</h1>;
};

export default Panel;
