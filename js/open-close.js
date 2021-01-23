function openForm(elementId) {
    document.getElementById(elementId).style.display = "flex";
}

function closeForm(elementId) {
    document.getElementById(elementId).style.display = "none";
}

function closeForm(event, elementId) {
	if (event.target.id === elementId)
    document.getElementById(elementId).style.display = "none";
}

function showMessage(event, elementId) {
    if (event.target.id !== elementId) return;
    let span = document.getElementById("notify");
    span.style.display = "flex";
    span.style.top = `${event.clientY - 50}px`;
    span.style.left = `${event.clientX - 80}px`;

    setTimeout(()=>{
        span.style.display = "none";
    }, 275);
}