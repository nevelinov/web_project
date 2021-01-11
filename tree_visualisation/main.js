function makeTree () {
	var tree = new Tree();
    tree.init(".tree",12,false);
	tree.edgeList = [ [0,1], [0,8], [0,9], [1,2], [1,3], [1,4], [1,5], [1,6], [1,7], [9,10], [8,11] ];
	tree.fillAdjListAndMatrix();
	tree.verNames.push.apply(tree.verNames, [
		"WebTech",
		"PRJ1_Ref",
		"Phase 1: Select topic in Puffin",
		"Phase 2: Upload first version of semantic html",
		"Phase 3: Write/Receive review/feedback",
		"Phase 4: Ask questions and make statistics about results",
		"Phase 5: Make presentation",
		"Phase 6: Final version (non anonimous) of project"
	]);

	drawTree(tree,0,0);
		drawTree(tree,0,0);
}