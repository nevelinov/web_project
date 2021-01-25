function vertexMove (dx, dy, posx, posy) {
    this.transform("t" + (this.coord[0]+dx) + " " + (this.coord[1]+dy));
}
function findSubTree (v, adjList, subtree) {
    subtree.push(v);
    for (let to of adjList[v]) {
        findSubTree(to,adjList,subtree);
    }
}
function dragFinish (vertex) {
    let currX=vertex.text.transform().totalMatrix.e,currY=vertex.text.transform().totalMatrix.f;
    
    let near=-1,ind;
    for (let i=0; i<this.n; i++) {
        if ((this.svgVertices[i]===undefined)||(this.svgVertices[i].text===undefined)) continue;
        if (this.svgVertices[i].text==vertex.text) {
            ind=i;
            continue;
        }
        
        let verX=this.svgVertices[i].text.transform().totalMatrix.e,verY=this.svgVertices[i].text.transform().totalMatrix.f;
        if ((currX>=verX-vertex.width-10)&&(currX<=verX+this.svgVertices[i].width+10)&&
            (currY>=verY-vertex.height-10)&&(currY<=verY+this.svgVertices[i].height+10)) near=i;
    }
    if (near!=-1) {
        let subtree = [];
        findSubTree(ind,this.adjList,subtree);
        let found = false;
        for (v of subtree) {
            if (v==near) {
                found=true;
                break;
            }
        }
        if (found==false) {
            for (let i=0; i<this.edgeList.length; i++) {
                if (this.edgeList[i][1]==ind) {
                    this.edgeList[i][0]=near;
                    break;
                }
            }
            this.fillAdjListAndMatrix();
            this.draw(true);
            return ;
        }
    }
    vertex.text.transform("t" + this.svgVertices[ind].coord[0] + " " + this.svgVertices[ind].coord[1]);
}
Tree.prototype = {
    addDrag: function () {
        for (i=0; i<this.n; i++) {
            if ((this.svgVertices[i]!==undefined)&&(this.svgVertices[i].text!==undefined)) {
                this.svgVertices[i].text.coord=this.svgVertices[i].coord;
                this.svgVertices[i].text.drag(vertexMove, () => {},dragFinish.bind(this,this.svgVertices[i]));
            }
        }
    }
}