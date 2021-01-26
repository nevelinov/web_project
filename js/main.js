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