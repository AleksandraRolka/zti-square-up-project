const config = () => {
    return {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
    };
};

export default { config };
