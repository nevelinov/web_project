async function onLogin() {
    let requestBody = new FormData();
    requestBody.append('username', document.getElementById("username").value);
    requestBody.append('password', document.getElementById("password").value);

    await fetch('../php/logout.php')
        .then(_ => {
            console.log('User is logged out.');
        });

    await fetch('../php/login.php', {
                method: 'POST',
                body: requestBody,
            })
        .then(response => {
            if (response.ok) {
                document.location = '../index.html';
            } else {
                console.log(response.json());
            }
        })
        .catch(error => console.log(error));
}

window.onload = function() {
    let loginBtn = document.getElementById('login-btn');
    loginBtn.addEventListener('click', onLogin);
}
