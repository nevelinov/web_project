// get all estimations
async function getEstimations() {
    let response = await fetch('../php/estimations.php')
        .then(response => response.json());
    
    if (response.success) {
        console.log(response.estimations);
    } else {
        console.log(response.errors);
    }
}

// create an estimation
async function postEstimation(vertexInfo) {
    // get these dynamically from document elements
    get_session_data(['username','role']).then(data => {
        if (data.role!="student") {
            alert("Трябва да сте студент, за да поставяте оценка");
            return ;
        }
        
        let requestBody = new FormData();
        requestBody.append('user_id', data.username);
        requestBody.append('node_id', vertexInfo.id);
        requestBody.append('estimation_text', document.getElementById("estimation-text").value);
        requestBody.append('estimation_value', document.getElementById("est-value").value);
        
        for (let entry of requestBody.entries()) {
            console.log(entry);
        }
        
        /*let response = await fetch('../php/estimations.php', {
                    method: 'POST',
                    body: requestBody
                })
                .then(response => response.json());

        // TODO update
        if (response.success) {
            console.log('Estimation was added');
        } else {
            console.log(response.errors);
        }*/
    });
}

/*window.onload = function() {
    // check if user is logged in
    // if not redirect to login page
    fetch('../php/getLoginStatus.php')
        .then(response => response.json())
        .then(loginResponse => {
            if (!loginResponse.logged) {
                document.location = '../pages/login.html';
        }
    });
 
    getEstimations();
    postEstimation();
    getEstimations();
}*/