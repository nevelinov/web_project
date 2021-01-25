fetch('php/getLoginStatus.php')
    .then(response => response.json())
    .then(loginResponse => {
        if (!loginResponse.logged) {
            document.location = 'pages/login.html';
        } else {
            console.log(loginResponse.logged, loginResponse.role);
            // change html as login is successful
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