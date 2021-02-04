fetch('../php/getLoginStatus.php')
    .then(response => response.json())
    .then(loginResponse => {
        if (!loginResponse.logged || loginResponse.role != 'admin') {
            document.location = 'login.html';
        } else {
            console.log(loginResponse.logged, loginResponse.role);
            // change html as login is successful
        }
    });

async function createTreeFromCSV() {
    let treeData = document.getElementById('tree-data').value;
    let nodes = [];

    // parse csv data
    for(node of treeData.split('\n')) {
        if (node=="") continue;
        nodeData = node.split(',');
        if (nodeData.length < 7) {
            myErrors(["Невалидни данни или неправилен формат"]);
            return;
        }
        node = {
            node_id: nodeData[0],
            parent_node_id: nodeData[1],
            text: nodeData[2],
            is_leaf: nodeData[3],
            url: nodeData[4],
            added_time: nodeData[5],
            properties: nodeData[6],
        }
        nodes.push(node);
    }

    // add nodes one by one
    // stop on error
    let lastRegisteredNode = null;
    for(node of nodes) {
        let added = await addNode(node);
        if (added.success === true) {
            lastRegisteredNode = node;
        } else {
            if (lastRegisteredNode !== null) {
                myErrors([`Последно бе добавен: ${lastRegisteredNode.node_id}`, "Грешка при регистрация на следващия връх", added.errors.reason]);
            } else {
                myErrors(["Грешка при добавянето още при първия връх", added.errors.reason]);
            }
            return;
        };
    }
    //alert("Върховете са успешно добавени!")
    mySuccess(["Върховете са успешно добавени!"]);
    document.getElementById('tree-data').value = '';
    document.getElementById('popupImportCSVTreeForm').style.display="none";
}

function exportCSV (tree) {
    let csv = tree.exportCSV();
    let event = new MouseEvent('click',{view: window, bubbles: false, cancelable: true});
    var blob = new Blob(["\ufeff", csv]);
    var url = URL.createObjectURL(blob);
    
    var link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "tree.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function saveTreeFromCSV(tree) {
    let treeData = tree.exportCSV();
    let nodes = [];

    // parse csv data
    for(node of treeData.split('\n')) {
        if (node=="") continue;
        nodeData = node.split(',');
        if (nodeData.length < 7) {
            myErrors(["Невалидни данни или неправилен формат"]);
            return;
        }
        node = {
            node_id: nodeData[0],
            parent_node_id: nodeData[1],
            text: nodeData[2],
            is_leaf: nodeData[3],
            url: nodeData[4],
            added_time: nodeData[5],
            properties: nodeData[6],
        }
        nodes.push(node);
    }

    // add nodes one by one
    // stop on error
    let lastRegisteredNode = null;
    for(node of nodes) {
        let added = await updateNode(node);
        if (added.success === true) {
            lastRegisteredNode = node;
        } else {
            if (lastRegisteredNode !== null) {
                myErrors([`Последно бе добавен: ${lastRegisteredNode.node_id}`, "Грешка при запазването на следващия връх", added.errors.reason]);
            } else {
                myErrors(["Грешка при запазването още при първия връх", added.errors.reason]);
            }
            return;
        };
    }
    //alert("Върховете са успешно добавени!")
    mySuccess(["Върховете са успешно запазени!"]);
}

// regiser create tree from csv handler
(() => {
    if (get_page()!="setup.html") return ;
    let createTreeBtn = document.getElementById('import-tree-button');
    createTreeBtn.addEventListener('click', createTreeFromCSV);

})()