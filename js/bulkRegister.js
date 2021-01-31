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
                //console.log(registered.errors);
                myErrors(["Грешка при регистрация на потребител", `Последно регистриран: ${lastRegisteredUser.username}`]);
            } else {
                //console.log(registered.errors);
                myErrors(["Грешка при регистрация на потребител"]);
            }
            return;
        };
    }
    alert("Потребителите са успешно регистрирани!")
    document.getElementById('register-data').value = '';
}

async function onOneRegister() {
    let username = document.getElementById('register-one-username').value;
    let password = document.getElementById('register-one-password').value;
    let name = document.getElementById('register-one-name').value;
    let roles = document.getElementsByName('register-one-role');
    let role = (roles[0].checked) ? 'student' : 'teacher';

    user = {username, password, name, role};
    let result = await registerUser(user);
    if (result.success === true) {
        alert('Потребителят е регистриран успешно!');
    } else {
        alert('Проблем при регистрацията на потребителя, моля погледнете в лога!');
        console.log(result.errors);
    }
    
}

async function onOneRegisterPopup() {
    let username = document.getElementById('register-one-popup-username').value;
    let password = document.getElementById('register-one-popup-password').value;
    let name = document.getElementById('register-one-popup-name').value;
    let roles = document.getElementsByName('register-one-popup-role');
    let role = (roles[0].checked) ? 'student' : 'teacher';
    

    user = {username, password, name, role};
    let result = await registerUser(user);
    if (result.success === true) {
        alert('Потребителят е регистриран успешно!');
    } else {
        alert('Проблем при регистрацията на потребителя, моля погледнете в лога!');
        console.log(result.errors);
    }

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
        }).then(response => response.json());
    
    return response;
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
 
    // register register handler
    let oneRegisterBth = document.getElementById('register-one-submit-button');
    let oneRegisterBthPopup = document.getElementById('register-one-popup-submit-button');
    let bulkRegisterBtn = document.getElementById('bulk-register-button');

    oneRegisterBth.addEventListener('click', onOneRegister);
    oneRegisterBthPopup.addEventListener('click', onOneRegisterPopup);
    bulkRegisterBtn.addEventListener('click', onBulkRegister);
}