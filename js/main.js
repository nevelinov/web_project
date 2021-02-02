function makeTree (addDrag) {
    let page;
    if (addDrag==false) page="index";
    else page="other";
    getNodes(page).then( nodes => {
        var tree = new Tree();
        tree.init(".tree",nodes.length);
        tree.addTreeData(nodes);
        window.onresize = tree.draw(addDrag);
    });
}

async function get_session_data(variables) {
    let data = {};
    for (variable of variables) {
        let requestBody = new FormData();
        requestBody.append('var',variable);
        let value = await fetch('../php/session.php', {
            method: 'POST',
            body: requestBody
            })
            .then(value => value.json());
        data[variable]=value;
    }
    return data;
}

(async function () {
    get_session_data(['username', 'role'])
        .then(data => {
            let footer = document.getElementById('logged-user');
            footer.innerHTML = `${data.username}, you are logged in as ${data.role}`;
        });
})();