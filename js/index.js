fetch('php/getLoginStatus.php')
    .then(response => response.json())
    .then(loginResponse => {
        if (!loginResponse.logged) {
            document.location = 'pages/login.html';
        } else {
            if (loginResponse.role != 'admin') {
                document.getElementById("setup-button").style.display = "none";
                document.getElementById("statistic-button").style.display = "none";
            }
        }
    });

// ges session information from php
async function get_session_data(variables) {
    let data = {};
    for (variable of variables) {
        let requestBody = new FormData();
        requestBody.append('var',variable);
        let value = await fetch('php/session.php', {
            method: 'POST',
            body: requestBody
            })
            .then(value => value.json());
        data[variable]=value;
    }
    return data;
}