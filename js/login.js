// handle login action
// if successfull redirect to index.html
// otherwise reload page
async function onLogin() {
    let requestBody = new FormData();
    requestBody.append('username', document.getElementById("username").value);
    requestBody.append('password', document.getElementById("password").value);

    let response = await fetch('../php/login.php', {
            method: 'POST',
            body: requestBody,
        }).then(response => response.json());
    
    if(response.success) {
        document.location = '../index.html';
    } else {
        // handle error, maybe show them
        console.log(response.errors);
    }
}

// regiser login handler
window.onload = async function() {
    // logout user
    await fetch('../php/logout.php')
        .then(_ => {
            console.log('User is logged out.');
        });

    let loginBtn = document.getElementById('login-btn');
    loginBtn.addEventListener('click', onLogin);
}
