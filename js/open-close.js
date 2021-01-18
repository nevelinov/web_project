function openForm(elementId) {
    document.getElementById(elementId).style.display = "flex";
}

function closeForm(event, elementId) {
	if (event.target.id === elementId)
    document.getElementById(elementId).style.display = "none";
}