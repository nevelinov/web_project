function makeTree () {
	var tree = new Tree();
    tree.init(".tree",12,false);
	tree.addTreeData([
		[0, -1, "WebTech", false, "brown"],
		[1, 0, "PRJ1_Ref", false, ""],
		[2, 1, "Phase 1: Select topic in Puffin", true, ""],
		[3, 1, "Phase 2: Upload first version of semantic html", true, ""],
		[4, 1, "Phase 3: Write/Receive review/feedback", true, ""],
		[5, 1, "Phase 4: Ask questions and make statistics about results", true, ""],
		[6, 1, "Phase 5: Make presentation", true, ""],
		[7, 1, "Phase 6: Final version (non anonimous) of project", true, ""],
		[8, 0, "9", false, ""],
		[9, 0, "10", false, ""],
		[10, 8, "11", true, ""],
		[11, 9, "12", true, ""],
	]);
	tree.draw(false);
	window.onresize = tree.draw(false);
}