async function getNodes(page) {
    let response;
    if (page=="index") {
        response = await fetch('php/nodes.php').then(response => response.json());
    }
    else {
        response = await fetch('../php/nodes.php').then(response => response.json());
    }

    if (response.success) {
        return response.nodes;
    } else {
        console.log("no nodes?");
    }
}

async function updateNode(node) {
    let requestBody = new FormData();
    requestBody.append('node_id', node.node_id);
    requestBody.append('parent_node_id', node.parent_node_id);
    requestBody.append('text', node.text);
    requestBody.append('url', node.url);
    requestBody.append('is_leaf', node.is_leaf);
    requestBody.append('added_time', node.added_time);
    requestBody.append('properties', node.properties);

    let response = await fetch('../php/updateNode.php', {
                method: 'POST',
                body: requestBody
            })
            .then(response => response.json());
    
    return response;
}

async function addNode(node) {
    let requestBody = new FormData();
    requestBody.append('node_id', node.node_id);
    requestBody.append('parent_node_id', node.parent_node_id);
    requestBody.append('text', node.text);
    requestBody.append('url', node.url);
    requestBody.append('is_leaf', node.is_leaf);
    requestBody.append('added_time', node.added_time);
    requestBody.append('properties', node.properties);

    let response = await fetch('../php/nodes.php', {
                method: 'POST',
                body: requestBody
            })
            .then(response => response.json());
    
    return response;
}