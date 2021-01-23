let arr;
let index;

function next() {
	const estimationText = document.getElementById('estimation-info-text');
	const estimationValue = document.getElementById('est-value-disabled');
	index = index == arr.length - 1 ? 0 : index + 1;
	estimationValue.value = arr[index].value;
	estimationText.value = arr[index].text
}

function prev() {
	const estimationText = document.getElementById('estimation-info-text');
	const estimationValue = document.getElementById('est-value-disabled');
	index = index == 0 ? arr.length - 1 : index - 1;
	estimationValue.value = arr[index].value;
	estimationText.value = arr[index].text
}

(() => {
	index = 0;
	arr = [
		{text: "Ala Bala", value: 1},
		{text: "KO STAA", value: 3},
		{text: "pesho be tuk", value: 4.5},
		{text: "i sya kvo?", value: 5},
		{text: "ko, ne", value: 1.5},
		{text: "pylen minus", value: 2}
	];

	const estimationText = document.getElementById('estimation-info-text');
	const estimationValue = document.getElementById('est-value-disabled');
	estimationValue.value = arr[index].value;
	estimationText.value = arr[index].text
})();