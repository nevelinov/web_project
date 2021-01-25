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
async function postEstimation() {
    // get these dynamically from document elements
    let requestBody = new FormData();
    requestBody.append('user_id', 1);
    requestBody.append('node_id', 1);
    requestBody.append('estimation_text', 'estimation text');
    requestBody.append('estimation_value', 1.0);

    let response = await fetch('../php/estimations.php', {
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
}

window.onload = function() {
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
}