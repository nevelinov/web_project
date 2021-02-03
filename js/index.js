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

// get session information from php
/*async function get_session_data(variables) {
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
}*/

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

async function postMoreTime(vertexInfo) {
    requestBody = new FormData();
    requestBody.append('added_time', document.getElementById('more-time-time-value').value);
    requestBody.append('node_id', vertexInfo.id);
    console.log(document.getElementById('more-time-time-value').value, vertexInfo.id);

    let response = await fetch('php/updateNode.php', {
            method: 'POST',
            body: requestBody
        })
        .then(response => response.json());
    
    console.log(response);
    if (response.success === true) {
        mySuccess(["Времето е добавено успешно!"])
    } else {
        myErrors(["Грешка при записване на времето", response.errors.reason]);
    }
}

async function postPriority() {
    requestBody = new FormData();
    requestBody.append('estimation_priority', document.getElementById('slider').value);
    requestBody.append('se_id', arr[index].id);

    let response = await fetch('php/priorities.php', {
            method: 'POST',
            body: requestBody
        })
        .then(response => response.json());

    if (response.success) {
        mySuccess(['Приоритета е успешно добавен!']);
    } else {
        console.log(response.errors);
    }
}