function makeTreeAndCalc () {
    getNodes("other").then( nodes => {
        var tree = new Tree();
        tree.init(".tree",nodes.length,false);
        tree.addTreeData(nodes);
        window.onresize = drawAndCalc(tree);
    });
}
function fillSums (v, adjList, sums) {
    for (let to of adjList[v]) {
        fillSums(to,adjList,sums);
        sums[v]+=sums[to];
    }
}
function drawAndCalc (tree) {
    tree.draw(true);
    for (let i=0; i<tree.n; i++) {
        if ((tree.svgVertices[i]!==undefined)&&(tree.svgVertices[i].text!==undefined)) {
            tree.svgVertices[i].text.undrag();
        }
    }
    setTimeout( () => {
        getEstimations().then(estimations => {
            sums = [];
            cnt = [];
            for (let i=0; i<tree.n; i++) {
                sums[i]=0;
                cnt[i]=0;
            }
            for (let estimation of estimations) {
                for (let i=0; i<tree.n; i++) {
                    if (estimation.nodeId==i) {
                        sums[i]+=estimation.estimationValue;
                        cnt[i]++;
                    }
                }
            }
            fillSums(0,tree.adjList,sums);
            
            for (let i=0; i<tree.n; i++) {
                let sum=tree.s.text(0,0,sums[i]+" ч.");
                tree.svgVertices[i].text=tree.s.group(tree.svgVertices[i].text,sum);
                sum.attr({"font-size": 30, "text-align": "center", class: "unselectable", fill: "#B22222"});
                if (i!=0) {
                    sum.attr({
                        x: tree.svgVertices[i].coord[0] + tree.svgVertices[i].width/2, 
                        y: tree.svgVertices[i].coord[1] - sum.getBBox().h/2
                    });
                }
                else {
                    sum.attr({
                        x: tree.svgVertices[i].coord[0] + tree.svgVertices[i].width/2, 
                        y: tree.svgVertices[i].coord[1] + tree.svgVertices[i].height + sum.getBBox().h/2
                    });
                }
                sum.attr({dy: "0.34em", "text-anchor": "middle"});
            }
        });
    }, 800);
}

// get all estimations
async function getEstimations() {
    let response = await fetch('../php/estimations.php')
        .then(response => response.json());
    
    if (response.success) {
        return response.estimations;
    } else {
        console.log(response.errors);
    }
}