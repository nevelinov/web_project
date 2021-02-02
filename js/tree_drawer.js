function Vertex () {
    this.id=undefined;
	this.name=undefined;
	this.isLeaf=undefined;
	this.cssProperties=undefined;
	this.visible=undefined;
    this.moreInfo=undefined;
	
	this.init = function (id, name, isLeaf, cssProperties) {
        this.id=id;
		this.name=name;
		this.isLeaf=isLeaf;
		this.cssProperties=cssProperties;
		this.visible=true;
        this.moreInfo="https://github.com";
	}
}

function SvgVertex () {
	this.coord=undefined;
	this.text=undefined;
	this.width=undefined;
	this.height=undefined;
}

function Tree () {
	this.svgName=undefined; this.s=undefined;
    this.svgVertices=undefined; this.edgeLines=undefined;
    this.n=undefined; this.vertices=undefined;
    this.edgeList=undefined; this.adjList=undefined; this.adjMatrix=undefined;
    this.init = function (svgName, n) {
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
        
        addSaveFunctionality(svgName);
	}
    
	this.fillAdjListAndMatrix = function () {
		let edgeList=this.edgeList,max=0;
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
            let x=edgeList[i][0],y=edgeList[i][1];
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
                if (this.svgVertices[i].visible==true) {
                    if (this.svgVertices[i].isLeaf==true) this.svgVertices[i].text.unclick(leafClick);
                    else {
                        this.svgVertices[i].text.unclick(vertexClick);
                        document.getElementById("textVertex"+i).removeEventListener("contextmenu",vertexAddTime);
                    }
                }
                this.svgVertices[i].text.remove();
			}
        }
	}
	
	this.draw = function (addDrag) {
        // If addDrag is true than we are at setup page, so no click events for vertices and vice versa
		for (let i=0; i<this.n; i++) {
            if (addDrag===true) this.vertices[i].visible=true;
        }
        
        let oldEdges = [];
		for (let i=0; i<this.edgeList.length; i++) {
			if ((this.edgeLines[i]!==undefined)&&(!this.edgeLines[i].hasOwnProperty("removed"))) oldEdges[i]=true;
			else oldEdges[i]=false;
		}
		let oldCoords = [];
		for (let i=0; i<this.n; i++) {
			if ((this.svgVertices[i]!==undefined)&&(!this.svgVertices[i].hasOwnProperty("removed"))) oldCoords[i]=this.svgVertices[i].coord;
		}
		let oldFrameW=document.querySelector(this.svgName).style.width;
		let oldFrameH=document.querySelector(this.svgName).style.height;
		
		this.erase();
		for (let i=0; i<this.n; i++) {
			this.svgVertices[i] = new SvgVertex();
		}
		calcPositions(this);
		let newFrameW=document.querySelector(this.svgName).style.width;
		let newFrameH=document.querySelector(this.svgName).style.height;
		if (parseFloat(newFrameW)<parseFloat(oldFrameW)) document.querySelector(this.svgName).style.width=oldFrameW;
		if (parseFloat(newFrameH)<parseFloat(oldFrameH)) document.querySelector(this.svgName).style.height=oldFrameH;
		
		let tempDiv = document.createElement("div");
		document.body.appendChild(tempDiv);
		tempDiv.classList.add("vertex-text");
		let strokeWidth=getComputedStyle(tempDiv).borderLeftWidth;
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
			let foreignObj=makeForeignObject(this.svgVertices[i],this.vertices[i],i);
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
				else {
					this.svgVertices[i].text.click(vertexClick.bind(this,i));
                    document.getElementById("textVertex"+i).addEventListener("contextmenu",vertexAddTime.bind(this,i));
                }
            }
        }
		else this.addDrag();
	}
}

function makeForeignObject (svgVertex, vertex, ind) {
    let code = '<foreignObject width="' + svgVertex.width + '" height="' + svgVertex.height + '" id="textVertex' + ind + '">';
    
    code += '<div class="unselectable" style=" ';
    code += 'font-size: 20px; overflow-wrap: break-word; border: solid 2px; border-radius: 10px; padding-left: 5px; padding-right: 5px; padding-bottom: 1px; cursor: pointer; ';
    if (vertex.isLeaf==true) code += 'border-radius: 0px; ';
    
    code += 'background: orange; ' + vertex.cssProperties + '">';
    code += '<span>' + text + '</span></div></foreignObject>';
    return code;
}

function dfs (v, adjList, verticesData) {
	verticesData[v].visible=false;
	for (child of adjList[v]) {
		dfs(child,adjList,verticesData);
	}
}

function vertexClick (v) {
	let child=this.adjList[v][0];
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

function addSaveFunctionality (svgName) {
    let parentElement=document.querySelector(svgName).parentElement;
    let saveButton=document.getElementById("save-button");
    let canvas=parentElement.querySelector("#canvas-save");
    canvas.style.display="none";
    let svgSave=parentElement.querySelector("#svg-save");
    svgSave.style.display="none";
    
    saveButton.onclick = function () {
        let context=canvas.getContext('2d');
        let svg=parentElement.querySelector(".tree");
        let svgWidth=svg.getBoundingClientRect().width,svgHeight=svg.getBoundingClientRect().height;
        svgSave.setAttribute("width",svgWidth);
        svgSave.setAttribute("height",svgHeight);
        
        svgSave.append(svg.cloneNode(true));
        canvas.width=svgWidth;
        canvas.height=svgHeight;

        svgSave.style.display="";
        let svgString=(new XMLSerializer()).serializeToString(svgSave);
        svgSave.style.display="none";
        
        let image = new Image();
        image.src="data:image/svg+xml; charset=utf8, "+encodeURIComponent(svgString);
        image.svgSave=this.svgSave;
        image.onload = function () {
            context.drawImage(image,0,0);
            let imageURI=canvas.toDataURL('image/png').replace('image/png','image/octet-stream');
            let event = new MouseEvent('click',{view: window, bubbles: false, cancelable: true});
            let temp=document.createElement('a');
            temp.setAttribute('download','tree.png');
            temp.setAttribute('href',imageURI);
            temp.setAttribute('target','_blank');
            temp.dispatchEvent(event);
            while (svgSave.firstChild) {
                svgSave.removeChild(svgSave.firstChild);
            }
        }
    }
}


function findMaxDepth (vr, dep, adjList, verticesData) {
	let max=dep;
    for (child of adjList[vr]) {
		if (verticesData[child].visible==false) continue;
        let value=findMaxDepth(child,dep+1,adjList,verticesData);
        if (max<value) max=value;
    }
    return max;
}

function fillVersDepth (vr, dep, maxDepth, adjList, verticesData, versDepth) {
	if ((dep==maxDepth)||(vr!=-1)) versDepth[dep].push(vr);
	let flagChildren=false;
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
	let i,j,h;
    
	let versDepth=[],inDegree=[],root=0;
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
	let maxDepth=findMaxDepth(root,0,tree.adjList,tree.vertices);
	fillVersDepth(root,0,maxDepth,tree.adjList,tree.vertices,versDepth);
	
	let yDistVertices=100,y=0;
	let heightDepth = [];
	let maxWidth=0;
	for (i=0; i<=maxDepth; i++) {
		heightDepth[i]=0;
		for (vertex of versDepth[i]) {
			if (vertex==-1) continue;
			let text;
			if (tree.vertices[vertex].name===undefined) text=(vertex+1).toString();
			else text=tree.vertices[vertex].name;
			let foreignObj='<foreignObject width="150" height="1000" id="temp"><div class="vertex-text" style="' + tree.vertices[i].cssProperties + '" id="tempDiv"><span id="tempSpan">'
				+ text + '</span></div></foreignObject>';
			tree.s.append(Snap.parse(foreignObj));
			let tempDiv = document.getElementById("tempDiv");
			tree.svgVertices[vertex].height=tempDiv.getBoundingClientRect().height;
			tree.svgVertices[vertex].width=document.getElementById("tempSpan").getBoundingClientRect().width;
			let computedStyle = window.getComputedStyle(tempDiv);
			tree.svgVertices[vertex].width+=parseFloat(computedStyle.paddingLeft)+parseFloat(computedStyle.paddingRight);
			tree.svgVertices[vertex].width+=parseFloat(computedStyle.borderLeftWidth)+parseFloat(computedStyle.borderRightWidth);
			tree.s.select("#temp").remove();
			
			if (heightDepth[i]<tree.svgVertices[vertex].height) heightDepth[i]=tree.svgVertices[vertex].height;
			if (maxWidth<tree.svgVertices[vertex].width) maxWidth=tree.svgVertices[vertex].width;
			
		}
		if (i<maxDepth) y+=heightDepth[i]+yDistVertices;
	}
	let xDistVertices=20;
	let frameW=versDepth[maxDepth].length*(maxWidth+xDistVertices);
	document.querySelector(tree.svgName).style.height=(y+heightDepth[maxDepth]+1)+"px";
	
	let x,distX;
	x=0; distX=frameW/(versDepth[maxDepth].length);
	for (vertex of versDepth[maxDepth]) {
		if (vertex!=-1) tree.svgVertices[vertex].coord=[x,y];
		x+=distX;
	}
    for (i=maxDepth-1; i>=0; i--) {
		y-=(heightDepth[i]+yDistVertices);
		let ind=0;
		while (versDepth[i+1][ind]==-1) {
			ind++;
		}
		for (vertex of versDepth[i]) {
			if ((ind==versDepth[i+1].length)||(tree.adjMatrix[vertex][versDepth[i+1][ind]]==0)) {
			   tree.svgVertices[vertex].coord=undefined;
			   continue;
			}
			let sum=0,cnt=0;
			for (; ind<versDepth[i+1].length; ind++) {
				let child=versDepth[i+1][ind];
				if (child==-1) continue;
				if (tree.adjMatrix[vertex][child]==0) break;
				sum+=tree.svgVertices[child].coord[0];
				cnt++;
			}
			tree.svgVertices[vertex].coord=[sum/cnt,y];
		}
		let prevX=0;
		for (j=0; j<versDepth[i].length; j++) {
			let v=versDepth[i][j];
			if (tree.svgVertices[v].coord!==undefined) {
			   prevX=tree.svgVertices[v].coord[0]+tree.svgVertices[v].width+xDistVertices;
			   continue;
			}
			let nextX=frameW;
            let maxNeighbourW=0,cnt=0;
			for (h=j; h<versDepth[i].length; h++) {
				let next=versDepth[i][h];
				if (tree.svgVertices[next].coord!==undefined) {
				   nextX=tree.svgVertices[next].coord[0];
				   break;
				}
                if (h>j) {
                    let neighbourW=(tree.svgVertices[next].width+tree.svgVertices[versDepth[i][h-1]].width);
                    if ((h>j)&&(maxNeighbourW<neighbourW)) maxNeighbourW=neighbourW;
                }
                cnt++;
			}
            if (maxNeighbourW/2+xDistVertices<=(nextX-prevX-xDistVertices)/(cnt+1)) {
                let x=prevX;
                for (h=j; h<versDepth[i].length; h++) {
                    let v=versDepth[i][h];
                    if (tree.svgVertices[v].coord!==undefined) break;
                    x+=(nextX-prevX-xDistVertices)/(cnt+1);
                    tree.svgVertices[v].coord=[x-tree.svgVertices[v].width/2,y];
                }
            }
            else {
                let x=prevX;
                for (h=j; h<versDepth[i].length; h++) {
                    let v=versDepth[i][h];
                    if (tree.svgVertices[v].coord!==undefined) break;
                    tree.svgVertices[v].coord=[x,y];
                    x+=(nextX-prevX-xDistVertices)/cnt;
                }
            }
			j=h-1;
		}
	}
	
	let minX=frameW;
	for (i=0; i<=maxDepth; i++) {
		for (vertex of versDepth[i]) {
			if (vertex==-1) continue;
			let leftX=tree.svgVertices[vertex].coord[0];
			if (minX>leftX) minX=leftX;
		}
	}
	let maxX=0;
	for (i=0; i<=maxDepth; i++) {
		for (vertex of versDepth[i]) {
			if (vertex==-1) continue;
			tree.svgVertices[vertex].coord[0]-=minX;
			let rightX=tree.svgVertices[vertex].coord[0]+tree.svgVertices[vertex].width;
			if (maxX<rightX) maxX=rightX;
		}
	}
	document.querySelector(tree.svgName).style.width=maxX+1+"px";
}
