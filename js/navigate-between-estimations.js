let arr;
let index;

function next(vertexInfo) {
    if (arr.length == 0) return ;
    const estimationText = document.getElementById('estimation-info-text');
	const estimationValue = document.getElementById('est-value-disabled');
	index = index == arr.length - 1 ? 0 : index + 1;
    estimationValue.value = arr[index].value;
	estimationText.value = arr[index].text
}

function prev(vertexInfo) {
    if (arr.length == 0) return ;
	const estimationText = document.getElementById('estimation-info-text');
	const estimationValue = document.getElementById('est-value-disabled');
	index = index == 0 ? arr.length - 1 : index - 1;
	estimationValue.value = arr[index].value;
	estimationText.value = arr[index].text
}