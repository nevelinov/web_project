function vertexAddTime (v, event) {
    let vertexInfo=this.vertices[v];
    event.preventDefault();
    get_session_data(['role']).then(data => {
        if (data.role=="admin") {
			let moreTimeForm = document.getElementById("popupMoreTimeForm");
            moreTimeForm.style.display="flex";
			document.getElementById("more-time-reason").value="";
            document.getElementById("more-time-time-value").value="0.5";
            document.getElementById("more-time-submit-button").onclick = function (event) {
                event.preventDefault();
                postMoreTime(vertexInfo);
                moreTimeForm.style.display="none";
            }
		}
    });
}

function leafClick (v) {
    let vertexInfo=this.vertices[v];
    // better with cookies?
    get_session_data(['role']).then(data => {
        if (data.role=="student") {
            let estimationForm = document.getElementById("popupEstimateForm");
			estimationForm.style.display="flex";
            if (vertexInfo.url!="") {
                const link = document.getElementById("more-info-student");
                link.href = vertexInfo.url;
            }
            document.getElementById("est-title").innerHTML=vertexInfo.name;
            document.getElementById("estimation-text").value="";
            document.getElementById("est-value").value="6";
            document.getElementById("estimate-submit-button").onclick = function (event) {
                event.preventDefault();
                postEstimation(vertexInfo);
                estimationForm.style.display="none";
            }
        }
        else if (data.role=="teacher") {
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
                if (arr.length==0) {
                    myErrors(["Няма поставени оценки от студентите"]);
                    return ;
                }
                
                document.getElementById("popupPriorityForm").style.display="flex";
                if (vertexInfo.url!="") {
                    const link = document.getElementById("more-info-teacher");
                    link.href = vertexInfo.url;
                }
                document.getElementById("prior-title").innerHTML=vertexInfo.name;
                document.getElementById("slider").value=1;

                
                document.getElementById('estimation-info-text').value = arr[index].text;
	            document.getElementById('est-value-disabled').value = arr[index].value;
                document.getElementById("prev-button").onclick = function (event) {
                    prev(vertexInfo);
                }
                document.getElementById("next-button").onclick = function (event) {
                    next(vertexInfo);
                }

                document.getElementById("priority-submit-button").onclick = function (event) {
                    event.preventDefault();
                    postPriority();
                }   
            });
        } else {
			let moreTimeForm = document.getElementById("popupMoreTimeForm");
            moreTimeForm.style.display="flex";
			document.getElementById("more-time-reason").value="";
            document.getElementById("more-time-time-value").value="0.5";
            document.getElementById("more-time-submit-button").onclick = function (event) {
                event.preventDefault();
                postMoreTime(vertexInfo);
                moreTimeForm.style.display="none";
            }
		}
    });
}