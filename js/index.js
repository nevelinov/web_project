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

// get all estimations
async function getEstimations() {
    let response = await fetch('php/estimations.php')
        .then(response => response.json());
    
    if (response.success) {
        return response.estimations;
    } else {
        console.log(response.errors);
    }
}
// create an estimation
function postEstimation(vertexInfo) {
    // get these dynamically from document elements
    get_session_data(['username','role']).then(async data => {
        if (data.role!="student") {
            alert("Трябва да сте студент, за да поставяте оценка");
            return ;
        }
        
        let requestBody = new FormData();
        requestBody.append('user_id', data.username);
        requestBody.append('node_id', vertexInfo.id);
        requestBody.append('estimation_text', document.getElementById("estimation-text").value);
        requestBody.append('estimation_value', document.getElementById("est-value").value);
        
        let response = await fetch('php/estimations.php', {
                    method: 'POST',
                    body: requestBody
                })
                .then(response => response.json());

        // TODO update
        if (response.success) {
            console.log('Estimation was added');
        } else {
            console.log(response.errors);
        }
    });
}
