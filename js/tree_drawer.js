function Vertex () {
    this.id=undefined;
	this.name=undefined;
	this.isLeaf=undefined;
	this.color=undefined;
	this.visible=undefined;
	
	this.init = function (id, name, isLeaf, color) {
        this.id=id;
		this.name=name;
		this.isLeaf=isLeaf;
		if (color!=="") this.color=color;
		else this.color="orange";
		this.visible=true;
	}
}

function SvgVertex () {
	this.coord=undefined;
	this.text=undefined;
	this.width=undefined;
	this.height=undefined;
}

function Tree () {
	this.svgName=undefined; this.s=undefined; this.flagSave=undefined;
    this.svgVertices=undefined; this.edgeLines=undefined;
    this.n=undefined; this.vertices=undefined;
    this.edgeList=undefined; this.adjList=undefined; this.adjMatrix=undefined;
    this.init = function (svgName, n, flagSave) {
		if (this.s==undefined) {
			this.svgName=svgName;
			this.s=Snap(svgName);
        }
        this.s.selectAll("*").forEach(function (element) {
			element.stop();
            element.remove();
		});
        this.svgVertices=[]; this.edgeLines=[];
        
		this.n=n; this.vertices=[];
		for (let i=0; i<this.n; i++) {
			this.vertices[i] = new Vertex();
		}
		
		this.edgeList=[]; this.adjList=[]; this.adjMatrix=[];
        for (let i=0; i<this.n; i++) {
            this.adjList[i]=[]; this.adjMatrix[i]=[];
            for (let j=0; j<this.n; j++) {
                this.adjMatrix[i][j]=0;
			}
		}
        this.flagDraw=false;
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
	
	this.addTreeData = function (treeData) {
		// format of array treeData is in the database format
		for (let i=0; i<this.n; i++) {
			this.vertices[treeData[i].nodeId].init(treeData[i].nodeId,treeData[i].text,treeData[i].isLeaf,treeData[i].properties);
		}
		
		for (let i=0; i<this.n; i++) {
			if (treeData[i].parentNodeId==-1) continue;
			this.vertices[treeData[i].nodeId].visible=false;
			this.edgeList.push([treeData[i].parentNodeId,treeData[i].nodeId]);
		}
		this.fillAdjListAndMatrix();
	}
	
	this.erase = function () {
		for (let i=0; i<this.edgeLines.length; i++) {
			if (this.edgeLines[i]!==undefined) this.edgeLines[i].remove();
        }
		for (let i=0; i<this.n; i++) {
			if ((this.svgVertices[i]!==undefined)&&(this.svgVertices[i].text!==undefined)) {
				this.svgVertices[i].text.remove();
				if (this.svgVertices[i].visible==true) {
                    if (this.svgVertices[i].isLeaf==true) this.svgVertices[i].text.unclick(leafClick);
                    else this.svgVertices[i].text.unclick(vertexClick);
                }
			}
        }
	}
	
	this.draw = function (addDrag) {
        // If addDrag is true than we are at setup page, so no click events for vertices and vice versa
		for (let i=0; i<this.n; i++) {
            if (addDrag===true) this.vertices[i].visible=true;
        }
        
        var oldEdges = [];
		for (let i=0; i<this.edgeList.length; i++) {
			if ((this.edgeLines[i]!==undefined)&&(!this.edgeLines[i].hasOwnProperty("removed"))) oldEdges[i]=true;
			else oldEdges[i]=false;
		}
		var oldCoords = [];
		for (let i=0; i<this.n; i++) {
			if ((this.svgVertices[i]!==undefined)&&(!this.svgVertices[i].hasOwnProperty("removed"))) oldCoords[i]=this.svgVertices[i].coord;
		}
		var oldFrameW=document.querySelector(this.svgName).style.width;
		var oldFrameH=document.querySelector(this.svgName).style.height;
		
		this.erase();
		for (let i=0; i<this.n; i++) {
			this.svgVertices[i] = new SvgVertex();
		}
		calcPositions(this);
		var newFrameW=document.querySelector(this.svgName).style.width;
		var newFrameH=document.querySelector(this.svgName).style.height;
		if (parseFloat(newFrameW)<parseFloat(oldFrameW)) document.querySelector(this.svgName).style.width=oldFrameW;
		if (parseFloat(newFrameH)<parseFloat(oldFrameH)) document.querySelector(this.svgName).style.height=oldFrameH;
		
		var tempDiv = document.createElement("div");
		document.body.appendChild(tempDiv);
		tempDiv.classList.add("vertex-text");
		var strokeWidth=getComputedStyle(tempDiv).borderLeftWidth;
		document.body.removeChild(tempDiv);
		
		for (let i=0; i<this.edgeList.length; i++) {
			let x=this.edgeList[i][0],y=this.edgeList[i][1];
			let xw=this.svgVertices[x].width,xh=this.svgVertices[x].height;
			let yw=this.svgVertices[y].width;
			if (this.vertices[y].visible==false) continue;
			let from=this.svgVertices[x].coord,to=this.svgVertices[y].coord;
			let st=[from[0]+xw/2,from[1]+xh/2];
			let end=[to[0]+yw/2,to[1]+1];
			
			if (oldEdges[i]==true) {
				this.edgeLines[i]=this.s.line(oldCoords[x][0]+xw/2,oldCoords[x][1]+xh/2,oldCoords[y][0]+yw/2,oldCoords[y][1]+1);
				this.edgeLines[i].attr({stroke: "black", "stroke-width": strokeWidth});
				this.edgeLines[i].animate({x1: st[0], y1: st[1], x2: end[0], y2: end[1]},200);
			}
			else {
				this.edgeLines[i]=this.s.line(st[0],st[1],st[0],st[1]);
				this.edgeLines[i].attr({stroke: "black", "stroke-width": strokeWidth, opacity: 0});
			}
		}
		
		for (let i=0; i<this.n; i++) {
			if (this.vertices[i].visible==false) continue;
			if (this.vertices[i].name=="") text=(i+1).toString();
			else text=this.vertices[i].name;
			let foreignObj='<foreignObject width="' + this.svgVertices[i].width + '" height="' + this.svgVertices[i].height + '" id="textVertex' + i
				+ '"><div class="vertex-text';
			if (this.vertices[i].isLeaf==true) foreignObj+=" leaf-text";
			foreignObj+=' unselectable" style="background: ' + this.vertices[i].color + '"><span>' + text + '</span></div></foreignObject>';
			this.s.append(Snap.parse(foreignObj));
			this.svgVertices[i].text=this.s.select("#textVertex"+i);
			let transformText = "t "+this.svgVertices[i].coord[0]+" "+this.svgVertices[i].coord[1];
			if (oldCoords[i]!==undefined) {
				this.svgVertices[i].text.transform("t "+oldCoords[i][0]+" "+oldCoords[i][1]);
				this.svgVertices[i].text.animate({transform: transformText},200);
			}
			else {
				this.svgVertices[i].text.transform(transformText);
				if (i!=0) this.svgVertices[i].text.attr({opacity: 0});
			}
		}
		setTimeout(function () {
			document.querySelector(this.svgName).style.width=newFrameW;
			document.querySelector(this.svgName).style.height=newFrameH;
		}.bind(this),250);
		
		for (let i=0; i<this.edgeList.length; i++) {
			if (oldEdges[i]==true) continue;
			let x=this.edgeList[i][0],y=this.edgeList[i][1];
			let xw=this.svgVertices[x].width,xh=this.svgVertices[x].height;
			let yw=this.svgVertices[y].width;
			if (this.vertices[y].visible==false) continue;
			let from=this.svgVertices[x].coord,to=this.svgVertices[y].coord;
			let st=[from[0]+xw/2,from[1]+xh/2];
			let end=[to[0]+yw/2,to[1]+1];
			
			setTimeout(function () {
				this.edgeLines[i].attr({opacity: 1});
				this.edgeLines[i].animate({x1: st[0], y1: st[1], x2: end[0], y2: end[1]},400);	
				
				this.svgVertices[y].text.attr({opacity: 1});
				this.svgVertices[y].text.transform("t "+(from[0]+xw/2-yw/2)+" "+(from[1]+xh));
				let transformText = "t "+to[0]+" "+to[1]
				this.svgVertices[y].text.animate({transform: transformText},500);
			}.bind(this),250);
		}
			
        if (addDrag===false) {
            for (let i=0; i<this.n; i++) {
                if (this.vertices[i].visible==false) continue;
                if (this.vertices[i].isLeaf==true) this.svgVertices[i].text.click(leafClick.bind(this,i));
                else this.svgVertices[i].text.click(vertexClick.bind(this,i));
            }
        }
		else this.addDrag();
	}
}

function dfs (v, adjList, verticesData) {
	verticesData[v].visible=false;
	for (child of adjList[v]) {
		dfs(child,adjList,verticesData);
	}
}

function vertexClick (v) {
	var child=this.adjList[v][0];
	if (this.vertices[child].visible==true) {
		dfs(v,this.adjList,this.vertices);
		this.vertices[v].visible=true;
	}
	else {
		for (child of this.adjList[v]) {
			this.vertices[child].visible=true;
		}
	}
	this.draw(false);
}

function leafClick (v) {
    var vertexInfo=this.vertices[v];
    // better with cookies?
    get_session_data(['role']).then(data => {
        if (data.role=="student") {
            var estimationForm = document.getElementById("popupEstimateForm");
            estimationForm.style.display="flex";
            document.getElementById("estimate-form-title").innerHTML="Времева оценка за изпълнение на: "+vertexInfo.name;
            document.getElementById("estimation-text").value="";
            document.getElementById("est-value").value="6";
            document.getElementById("estimate-submit-button").onclick = function (event) {
                event.preventDefault();
                postEstimation(vertexInfo);
                estimationForm.style.display="none";
            }
        }
        else {
            document.getElementById("popupPriorityForm").style.display="flex";
            document.getElementById("priority-form-title").innerHTML="Вярно ли е оценена задача "+vertexInfo.name+"?";
            document.getElementById("slider").value=1;
            
            getEstimations().then(estimations => {
                index = 0;
                arr = [];
                for (estimation of estimations) {
                    if (estimation.nodeId==vertexInfo.id) {
                        arr.push({
                            text: estimation.estimationText,
                            value: estimation.estimationValue,
                            id: estimation.estimationId
                        });
                    }
                }
                if (arr.length>0) {
                   document.getElementById('estimation-info-text').value = arr[index].text;
	               document.getElementById('est-value-disabled').value = arr[index].value;
                }
                else {
                   document.getElementById('estimation-info-text').value = "";
	               document.getElementById('est-value-disabled').value = "";
                }
                
                document.getElementById("prev-button").onclick = function (event) {
                    prev(vertexInfo);
                }
                document.getElementById("next-button").onclick = function (event) {
                    next(vertexInfo);
                }

                document.getElementById("priority-submit-button").onclick = function (event) {
                    event.preventDefault();
                    postPriority(vertexInfo);
                }   
            });
        }
    });
}

function findMaxDepth (vr, dep, adjList, verticesData) {
	var max=dep;
    for (child of adjList[vr]) {
		if (verticesData[child].visible==false) continue;
        var value=findMaxDepth(child,dep+1,adjList,verticesData);
        if (max<value) max=value;
    }
    return max;
}

function fillVersDepth (vr, dep, maxDepth, adjList, verticesData, versDepth) {
	if ((dep==maxDepth)||(vr!=-1)) versDepth[dep].push(vr);
	var flagChildren=false;
    if (vr!=-1) {
        for (child of adjList[vr]) {
			if (verticesData[child].visible==false) continue;
			flagChildren=true;
            fillVersDepth(child,dep+1,maxDepth,adjList,verticesData,versDepth);
        }
	}
    if ((flagChildren==false)&&(dep<maxDepth)) fillVersDepth(-1,dep+1,maxDepth,adjList,verticesData,versDepth);
}

function calcPositions (tree) {
	var i,j,h;
    
	var versDepth=[],inDegree=[],root=0;
	for (i=0; i<=tree.n; i++) {
		versDepth[i]=[];
		inDegree[i]=0;
		tree.svgVertices.coord=undefined;
	}
    for (i=0; i<tree.edgeList.length; i++) {
  	    let v=tree.edgeList[i][1];
		if (tree.vertices[v].visible==false) continue;
		inDegree[v]++;
 	}
    for (i=0; i<tree.n; i++) {
		if (tree.vertices[i].visible==false) continue;
	    if (inDegree[i]==0) {
		   root=i;
		   break;
		}
	}
	var maxDepth=findMaxDepth(root,0,tree.adjList,tree.vertices);
	fillVersDepth(root,0,maxDepth,tree.adjList,tree.vertices,versDepth);
	
	var yDistVertices=100,y=0;
	var heightDepth = [];
	var maxWidth=0;
	for (i=0; i<=maxDepth; i++) {
		heightDepth[i]=0;
		for (vertex of versDepth[i]) {
			if (vertex==-1) continue;
			var text;
			if (tree.vertices[vertex].name===undefined) text=(vertex+1).toString();
			else text=tree.vertices[vertex].name;
			var foreignObj='<foreignObject width="150" height="1000" id="temp"><div class="vertex-text" id="tempDiv"><span id="tempSpan">'
				+ text + '</span></div></foreignObject>';
			tree.s.append(Snap.parse(foreignObj));
			var tempDiv = document.getElementById("tempDiv");
			tree.svgVertices[vertex].height=tempDiv.getBoundingClientRect().height;
			tree.svgVertices[vertex].width=document.getElementById("tempSpan").getBoundingClientRect().width;
			var computedStyle = window.getComputedStyle(tempDiv);
			tree.svgVertices[vertex].width+=parseFloat(computedStyle.paddingLeft)+parseFloat(computedStyle.paddingRight);
			tree.svgVertices[vertex].width+=parseFloat(computedStyle.borderLeftWidth)+parseFloat(computedStyle.borderRightWidth);
			tree.s.select("#temp").remove();
			
			if (heightDepth[i]<tree.svgVertices[vertex].height) heightDepth[i]=tree.svgVertices[vertex].height;
			if (maxWidth<tree.svgVertices[vertex].width) maxWidth=tree.svgVertices[vertex].width;
			
		}
		if (i<maxDepth) y+=heightDepth[i]+yDistVertices;
	}
	var xDistVertices=20;
	var frameW=versDepth[maxDepth].length*(maxWidth+xDistVertices);
	document.querySelector(tree.svgName).style.height=(y+heightDepth[maxDepth]+1)+"px";
	
	var x,distX;
	x=0; distX=frameW/(versDepth[maxDepth].length);
	for (vertex of versDepth[maxDepth]) {
		if (vertex!=-1) tree.svgVertices[vertex].coord=[x,y];
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
			   tree.svgVertices[vertex].coord=undefined;
			   continue;
			}
			var sum=0,cnt=0;
			for (; ind<versDepth[i+1].length; ind++) {
				let child=versDepth[i+1][ind];
				if (child==-1) continue;
				if (tree.adjMatrix[vertex][child]==0) break;
				sum+=tree.svgVertices[child].coord[0];
				cnt++;
			}
			tree.svgVertices[vertex].coord=[sum/cnt,y];
		}
		var prevX=0;
		for (j=0; j<versDepth[i].length; j++) {
			let v=versDepth[i][j];
			if (tree.svgVertices[v].coord!==undefined) {
			   prevX=tree.svgVertices[v].coord[0]+tree.svgVertices[v].width;
			   continue;
			}
			var cnt=0,nextX=frameW;
			for (h=j; h<versDepth[i].length; h++) {
				let next=versDepth[i][h];
				if (tree.svgVertices[next].coord!==undefined) {
				   nextX=tree.svgVertices[next].coord[0];
				   break;
				}
				cnt++;
			}
			var x=prevX;
			for (h=j; h<versDepth[i].length; h++) {
				let v=versDepth[i][h];
				if (tree.svgVertices[v].coord!==undefined) break;
				x+=(nextX-prevX)/(cnt+1);
				tree.svgVertices[v].coord=[x-tree.svgVertices[v].width/2,y];
			}
			j=h-1;
		}
	}
	
	var minX=frameW;
	for (i=0; i<=maxDepth; i++) {
		for (vertex of versDepth[i]) {
			if (vertex==-1) continue;
			let leftX=tree.svgVertices[vertex].coord[0];
			if (minX>leftX) minX=leftX;
		}
	}
	var maxX=0;
	for (i=0; i<=maxDepth; i++) {
		for (vertex of versDepth[i]) {
			if (vertex==-1) continue;
			tree.svgVertices[vertex].coord[0]-=minX;
			let rightX=tree.svgVertices[vertex].coord[0]+tree.svgVertices[vertex].width;
			if (maxX<rightX) maxX=rightX;
		}
	}
	document.querySelector(tree.svgName).style.width=maxX+"px";
}
