// handle bulk register action
async function onBulkRegister() {
    let registerData = document.getElementById('register-data').value;
    let users = [];

    // parse csv data
    for(user of registerData.split('\n')) {
        userData = user.split(',');
        if (userData.length < 3) {
            alert('Unvalid csv data!');
            return;
        }
        user = {
            username: userData[0],
            password: userData[1],
            name: userData[2],
            role: 'student'
        }
        users.push(user);
    }

    // register users one by one
    // stop on error
    let lastRegisteredUser = null;
    for(user of users) {
        console.log("try to register user: ", user);

        let registered = await registerUser(user);
        if (registered.success === true) {
            lastRegisteredUser = user;
        } else {
            if (lastRegisteredUser != null) {
                console.log(registered.errors);
                alert("Грешка, погледнете в лога. Последно регистриран потребител: " + lastRegisteredUser.username)
            } else {
                console.log(registered.errors);
                alert("Грешка, погледнете в лога.");
            }
            return;
        };
    }
    alert("Потребителите са успешно регистрирани!")
    document.getElementById('register-data').value = '';
}

// post register request
async function registerUser(user) {
    let requestBody = new FormData();
    for(var key in user) {
        requestBody.append(key, user[key]);
    }

    url = '../php/users.php';
    let response = await fetch(url, {
            method: 'POST',
            body: requestBody
        });
    
    return response.json();
}

window.onload = function() {
    // check if user is logged in
    // if not redirect to login page
    fetch('../php/getLoginStatus.php')
        .then(response => response.json())
        .then(loginResponse => {
            if (!loginResponse.logged || loginResponse.role != 'admin') {
                document.location = '../pages/login.html';
        }
    });
 
    // register bulk register handler
    let bulkRegisterBtn = document.getElementById('bulk-register-btn');
    bulkRegisterBtn.addEventListener('click', onBulkRegister);
}