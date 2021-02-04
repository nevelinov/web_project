function makeTree (addDrag) {
    let page;
    if (addDrag==false) page="index";
    else page="other";
    getNodes(page).then(async nodes => {
        let tree = new Tree();
        let n=0;
        for (node of nodes) {
            if (n<node.nodeId+1) n=node.nodeId+1;
        }
        tree.init(".tree",n);
        await tree.addTreeData(nodes);
        window.onresize = tree.draw(addDrag);
        if (get_page()=="setup.html") {
            document.getElementById("export-csv").onclick = exportCSV.bind(this, tree);
            document.getElementById("save-changes-button").onclick = saveTreeFromCSV.bind(this, tree);
        }
    });
}

function get_page () {
    let URL=document.URL,index=-1;
    for (var i=0; i<URL.length; i++) {
        if (URL[i]=='/') index=i;
        }
    return URL.slice(index+1,URL.length);
}

async function get_session_data(variables) {
    let link,page=get_page();
    if ((page=="")||(page=="index.html")) link="php/session.php";
    else link="../php/session.php";
    let data = {};
    for (let variable of variables) {
        let requestBody = new FormData();
        requestBody.append('var',variable);
        let value = await fetch(link, {
            method: 'POST',
            body: requestBody
            })
            .then(value => value.json());
        data[variable]=value;
    }
    return data;
}

(function () {
    get_session_data(['username', 'role'])
        .then(data => {
            let footer = document.getElementById('logged-user');
            footer.innerHTML = `${data.username}, you are logged in as ${data.role}`;
        });
})();