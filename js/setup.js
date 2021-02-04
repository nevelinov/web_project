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
        nodeData = node.split(',');
        if (nodeData.length < 4) {
            myErrors(["Невалидни данни или неправилен формат"]);
            return;
        }
        node = {
            node_id: nodeData[0],
            parent_node_id: nodeData[1],
            text: nodeData[2],
            is_leaf: nodeData[3],
            url: nodeData[4]
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
    mySuccess(["Върховете са успешно добавени, дървото е създадено!"]);
    document.getElementById('tree-data').value = '';
}

// regiser create tree from csv handler
(() => {
    let createTreeBtn = document.getElementById('import-tree-button');
    createTreeBtn.addEventListener('click', createTreeFromCSV);

})()