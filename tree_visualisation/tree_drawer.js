function Tree () {
	this.svgName=undefined; this.s=undefined; this.flagSave=undefined;
    this.verCoord=undefined; this.textVertices=undefined;
    this.edgeLines=undefined;
    this.n=undefined; this.verNames=undefined;
    this.edgeList=undefined; this.adjList=undefined; this.adjMatrix=undefined;
    this.frameX=undefined; this.frameY=undefined;
    this.init = function (svgName, n, flagSave) {
		if (this.s==undefined) {
			this.svgName=svgName;
			this.s=Snap(svgName);
        }
        this.s.selectAll("*").forEach(function (element) {
			element.stop();
            element.remove();
		});
             
        this.verCoord=[]; this.verWidth=[]; this.verHeight=[]; this.textVertices=[];
        this.edgeLines=[];
        if (n!==undefined) this.n=n;
		this.verNames = [];
        this.edgeList=[]; this.adjList=[]; this.adjMatrix=[];
        for (var i=0; i<this.n; i++) {
            this.adjList[i]=[]; this.adjMatrix[i]=[];
            for (var j=0; j<this.n; j++) {
                this.adjMatrix[i][j]=0;
			}
		}
        this.flagDraw=0;
	}
    
	this.fillAdjListAndMatrix = function () {
		var edgeList=this.edgeList,max=0;
        for (i=0; i<edgeList.length; i++) {
			if (max<edgeList[i][0]) max=edgeList[i][0];
			if (max<edgeList[i][1]) max=edgeList[i][1];
        }
        this.n=max+1;
		for (i=0; i<=max; i++) {
            this.adjMatrix[i]=[];
            for (j=0; j<=max; j++) {
                this.adjMatrix[i][j]=0;
            }
            this.adjList[i]=[];
        }
        for (i=0; i<edgeList.length; i++) {
            var x=edgeList[i][0],y=edgeList[i][1];
            this.adjMatrix[x][y]=1;
            this.adjList[x].push(y);
        }
    }
	
	this.erase = function () {
		for (let i=0; i<this.edgeLines.length; i++) {
			if (this.edgeLines[i]!=null) this.edgeLines[i].remove();
        }
        for (let i=0; i<this.n; i++) {
			if (this.textVertices[i]!=null) this.textVertices[i].remove();
        }
	}
	
	this.draw = function (addDrawableEdges) {
		this.erase();
		var tempDiv = document.createElement("div");
		document.body.appendChild(tempDiv);
		tempDiv.classList.add("vertex-text");
		var strokeWidth=getComputedStyle(tempDiv).borderLeftWidth;
		document.body.removeChild(tempDiv);
		for (var i=0; i<this.edgeList.length; i++) {
			var x=this.edgeList[i][0],y=this.edgeList[i][1];
			var from=this.verCoord[x],to=this.verCoord[y],edgeLen,quotient=1;
			var st=[from[0]+this.verWidth[x]/2,from[1]+this.verHeight[x]/2];
			var end=[to[0]+this.verWidth[y]/2,to[1]+1];
			edgeLen=Math.sqrt((st[0]-end[0])*(st[0]-end[0])+(st[1]-end[1])*(st[1]-end[1]));
			this.edgeLines[i]=this.s.line(st[0],st[1],st[0]+quotient*(end[0]-st[0]),st[1]+quotient*(end[1]-st[1]));
			this.edgeLines[i].attr({stroke: "black", "stroke-width": strokeWidth});
		}
		for (var i=0; i<this.n; i++) {
			if ((this.verNames.length==0)||(this.verNames[i]===undefined)) text=(i+1).toString();
			else text=this.verNames[i];
			
			var foreignObj='<foreignObject width="' + this.verWidth[i] + '" height="' + this.verHeight[i] + '" id="textVertex' + i
				+ '"><div class="vertex-text unselectable"><span>' + text + '</span></div></foreignObject>';
			this.s.append(Snap.parse(foreignObj));
			this.textVertices[i]=this.s.select("#textVertex"+i);
			this.textVertices[i].transform("t "+this.verCoord[i][0]+" "+this.verCoord[i][1]);	
		}
		//if (addDrawableEdges==true) this.addDrawableEdges();
	}
}

function findMaxDepth (vr, dep, adjList) {
	var max=dep;
    for (child of adjList[vr]) {
        var value=findMaxDepth(child,dep+1,adjList);
        if (max<value) max=value;
    }
    return max;
}
function fillVersDepth (vr, dep, maxDepth, adjList, versDepth) {
	if ((dep==maxDepth)||(vr!=-1)) versDepth[dep].push(vr);
    if (vr!=-1) {
        for (child of adjList[vr]) {
            fillVersDepth(child,dep+1,maxDepth,adjList,versDepth);
        }
	}
    else if (dep<maxDepth) fillVersDepth(-1,dep+1,maxDepth,adjList,versDepth);
}
function calcPositions (tree, frameX, frameY) {
	var i,j,h;
    
	var versDepth=[],inDegree=[],root=0;
	for (i=0; i<=tree.n; i++) {
		versDepth[i]=[];
		inDegree[i]=0;
	}
    for (i=0; i<tree.edgeList.length; i++) {
  	    inDegree[tree.edgeList[i][1]]++;
 	}
    for (i=0; i<tree.n; i++) {
	    if (inDegree[i]==0) {
		   root=i;
		   break;
		}
	}
	var maxDepth=findMaxDepth(root,0,tree.adjList);
	fillVersDepth(root,0,maxDepth,tree.adjList,versDepth);
	
	var yDistVertices=100,y=0;
	var heightDepth = [];
	var maxWidth=0;
	for (i=0; i<=maxDepth; i++) {
		heightDepth[i]=0;
		for (vertex of versDepth[i]) {
			if (vertex==-1) continue;
			var text;
			if (tree.verNames[vertex]===undefined) text=(vertex+1).toString();
			else text=tree.verNames[vertex];
			var foreignObj='<foreignObject width="150" height="1000" id="temp"><div class="vertex-text" id="tempDiv"><span id="tempSpan">'
				+ text + '</span></div></foreignObject>';
			tree.s.append(Snap.parse(foreignObj));
			var tempDiv = document.getElementById("tempDiv");
			tree.verHeight[vertex]=tempDiv.getBoundingClientRect().height;
			tree.verWidth[vertex]=document.getElementById("tempSpan").getBoundingClientRect().width;
			var computedStyle = window.getComputedStyle(tempDiv);
			tree.verWidth[vertex]+=parseFloat(computedStyle.paddingLeft)+parseFloat(computedStyle.paddingRight);
			tree.verWidth[vertex]+=parseFloat(computedStyle.borderLeftWidth)+parseFloat(computedStyle.borderRightWidth);
			tree.s.select("#temp").remove();
			
			if (heightDepth[i]<tree.verHeight[vertex]) heightDepth[i]=tree.verHeight[vertex];
			if (maxWidth<tree.verWidth[vertex]) maxWidth=tree.verWidth[vertex];
			
		}
		if (i<maxDepth) y+=heightDepth[i]+yDistVertices;
	}
	var xDistVertices=20;
	var frameW=versDepth[maxDepth].length*(maxWidth+xDistVertices);
	document.querySelector(tree.svgName).style.width=frameW+"px";
	document.querySelector(tree.svgName).style.height=(y+heightDepth[maxDepth]+1)+"px";
	
	var x,distX;
	x=0; distX=frameW/(versDepth[maxDepth].length);
	for (vertex of versDepth[maxDepth]) {
		if (vertex!=-1) tree.verCoord[vertex]=[x+frameX,y+frameY];
		x+=distX;
	}
	for (i=maxDepth-1; i>=0; i--) {
		y-=(heightDepth[i]+yDistVertices);
		var ind=0;
		while (versDepth[i+1][ind]==-1) {
			ind++;
		}
		for (vertex of versDepth[i]) {
			if ((ind==versDepth[i+1].length)||(tree.adjMatrix[vertex][versDepth[i+1][ind]]==0)) {
			   tree.verCoord[vertex]=undefined;
			   continue;
			}
			var sum=0,cnt=0;
			for (; ind<versDepth[i+1].length; ind++) {
				if (versDepth[i+1][ind]==-1) continue;
				if (tree.adjMatrix[vertex][versDepth[i+1][ind]]==0) break;
				sum+=tree.verCoord[versDepth[i+1][ind]][0];
				cnt++;
			}
			tree.verCoord[vertex]=[sum/cnt,y+frameY];
		}
		var prevX=0;
		for (j=0; j<versDepth[i].length; j++) {
			if (tree.verCoord[versDepth[i][j]]!==undefined) {
			   prevX=tree.verCoord[versDepth[i][j]][0];
			   continue;
			}
			var cnt=1,nextX=frameX+frameW;
			for (h=j; h<versDepth[i].length; h++) {
				if (tree.verCoord[versDepth[i][h]]!==undefined) {
				   nextX=tree.verCoord[versDepth[i][h]][0];
				   break;
				}
				cnt++;
			}
			var x=prevX;
			for (h=j; h<versDepth[i].length; h++) {
				if (tree.verCoord[versDepth[i][h]]!==undefined) break;
				x+=(nextX-prevX)/cnt;
				tree.verCoord[versDepth[i][h]]=[x,y+frameY];
			}
			j=h-1;
		}
	}
}
function drawTree (tree, frameX, frameY) {
    tree.erase();
	tree.frameX=frameX; tree.frameY=frameY;
	calcPositions(tree,frameX,frameY);
    tree.draw(true);
}
