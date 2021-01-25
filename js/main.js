function makeTree () {
    getNodes().then( nodes => {
        var tree = new Tree();
        tree.init(".tree",nodes.length,false);
        tree.addTreeData(nodes);
        tree.draw(false);
        window.onresize = tree.draw(false);
    });
}