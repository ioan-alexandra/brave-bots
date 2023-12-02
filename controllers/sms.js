const axios = require("axios");
function smsTrimis(data) {

    let config = {
        method: "post",
        url: "https://www.smsadvert.ro/api/sms/",
        headers: {
            Authorization:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWNjNzJjYzZjZjAyMjAwMDQzNjkwN2UifQ.iuQQeK_WZlOyfMD6AXmuXPNNF3xXzmKWsRkhPhQacNc",
            "Content-Type": "application/json",
        },
        data: data,
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
}
function smsNetrimis(dataError) {

    let configError = {
        method: "post",
        url: "https://www.smsadvert.ro/api/sms/",
        headers: {
            Authorization:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWNjNzJjYzZjZjAyMjAwMDQzNjkwN2UifQ.iuQQeK_WZlOyfMD6AXmuXPNNF3xXzmKWsRkhPhQacNc",
            "Content-Type": "application/json",
        },
        data: dataError,
    };

    axios(configError)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
}

module.exports = {
    trimiteSms: smsTrimis,
    trimiteEroare: smsNetrimis
};