const config = () => {
    return {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
    };
};

export { config };
