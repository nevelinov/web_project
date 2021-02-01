async function setPriority() {
    requestBody = new FormData();
    // get thse dinamically
    requestBody.append('estimation_priority', 1.20);
    requestBody.append('se_id', 31);

    let response = await fetch('../php/priorities.php', {
            method: 'POST',
            body: requestBody
        })
        .then(response => response.json());

    console.log(response);
    if (response.success) {
        console.log('Priority successfully added.');
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
            if (!loginResponse.logged || loginResponse.role == 'student') {
                document.location = '../pages/login.html';
        }
    });
 
    setPriority();
}