async function onBulkRegister() {
    let registerData = document.getElementById('register-data').value;
    let users = [];

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

    let lastRegisteredUser = null;
    for(user of users) {
        registerUser(user);
        let registered = await registerUser(user);
        if (registered === true) {
            lastRegisteredUser = user;
        } else {
            if (lastRegisteredUser != null) {
                alert("Грешка, погледнете в лога. Последно регистриран потребител: " + lastRegisteredUser.username)
            } else {
                alert("Грешка, погледнете в лога.");
            }
            return;
        };
    }
    alert("Потребителите са успешно регистрирани!")
    document.getElementById('register-data').value = '';
}

async function registerUser(user) {
    let requestBody = new FormData();
    for(var key in user) {
        requestBody.append(key, user[key]);
    }

    url = '../php/users.php';
    let response = await fetch(url, {
                method: 'POST',
                body: requestBody
            })
            .then(response => {
                if (!response.ok) {
                    console.log(response.json());
                    alert('we have a problem');
                }
            })
            .catch(error => console.log(error));
}

function showError(error) {
    console.error(error);
}

window.onload = function() {
    let bulkRegisterBtn = document.getElementById('bulk-register-btn');
    bulkRegisterBtn.addEventListener('click', onBulkRegister);
}