async function getNodes() {
    let response = await fetch('../php/nodes.php')
        .then(response => response.json());

    if (response.success) {
        console.log(response.nodes);
    } else {
        console.log("no nodes?");
    }
}

async function updateNode() {
    // get these dynamically
    let requestBody = new FormData();
    requestBody.append('node_id', 1);
    requestBody.append('parent_node_id', 1);
    requestBody.append('text', 'updated text');
    requestBody.append('is_leaf', false);
    requestBody.append('properties', 'updated json');

    let response = await fetch('../php/updateNode.php', {
                method: 'POST',
                body: requestBody
            })
            .then(response => response.json());
    
    // TODO update
    if (response.success) {
        console.log('success', response);
    } else {
        console.log(response.errors);
    }
}

async function addNode() {
    // get these dynamically
    let requestBody = new FormData();
    requestBody.append('node_id', 2);
    requestBody.append('parent_node_id', 1);
    requestBody.append('text', 'node 2');
    requestBody.append('is_leaf', true);
    requestBody.append('properties', 'node 2 json');

    let response = await fetch('../php/nodes.php', {
                method: 'POST',
                body: requestBody
            })
            .then(response => response.json());
    
    // TODO update
    if (response.success) {
        console.log(response);
    } else {
        console.log(response.errors);
    }
}

window.onload = function() {
    // check if user is logged in
    // if not redirect to login page
    fetch('../php/getLoginStatus.php')
        .then(response => response.json())
        .then(loginResponse => {
            if (!loginResponse.logged || loginResponse.role != 'student') {
                document.location = '../pages/login.html';
        }
    });
 
    getNodes();
    addNode();
    getNodes();
}