function myErrors(list) {
    document.getElementById("show-me-errors").style.display = "flex";
    const ul = document.getElementById("errors-list");
    list.forEach((item) => {
        let li = document.createElement('li');
        ul.appendChild(li);
        li.innerHTML += item;
    });
}
