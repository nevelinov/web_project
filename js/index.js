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

        if (response.success === true) {
            mySuccess(["Оценката е добавена успешна!"])
        } else {
            myErrors(["Грешка при записване на оценката", response.errors.reason]);
        }
    });
}

async function postMoreTime(vertexInfo) {
    requestBody = new FormData();
    requestBody.append('added_time', document.getElementById('more-time-time-value').value);
    requestBody.append('node_id', vertexInfo.id);
    requestBody.append('parent_node_id', vertexInfo.parentNodeId);
    requestBody.append('text', vertexInfo.name);
    requestBody.append('url', vertexInfo.url);
    requestBody.append('is_leaf', +vertexInfo.isLeaf);
    requestBody.append('properties', vertexInfo.cssProperties);

    let response = await fetch('php/updateNode.php', {
            method: 'POST',
            body: requestBody
        })
        .then(response => response.json());
    
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