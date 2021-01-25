fetch('../php/getLoginStatus.php')
    .then(response => response.json())
    .then(loginResponse => {
        if (!loginResponse.logged || loginResponse.role != 'admin') {
            document.location = 'login.html';
        } else {
            console.log(loginResponse.logged, loginResponse.role);
            // change html as login is successful
        }
    });