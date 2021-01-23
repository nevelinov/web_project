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