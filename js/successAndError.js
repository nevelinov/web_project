function myErrors(list) {
    document.getElementById("show-me-errors").style.display = "flex";
    const ul = document.getElementById("errors-list");
    ul.innerHTML="";
    list.forEach((item) => {
        let li = document.createElement('li');
        ul.appendChild(li);
        li.innerHTML += item;
    });
}

function mySuccess(list) {
    document.getElementById("show-me-success").style.display = "flex";
    const ul = document.getElementById("success-list");
    ul.innerHTML="";
    list.forEach((item) => {
        let li = document.createElement('li');
        ul.appendChild(li);
        li.innerHTML += item;
    });
}