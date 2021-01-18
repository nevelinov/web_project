var arr = [1, 3, 4, 5, 7];
var cur = 0;

function next() {
	const estimation = document.getElementById('estimation-info-text');
	cur = cur == arr.length - 1 ? 0 : cur + 1;
	estimation.value = arr[cur];
}

function prev() {
	const estimation = document.getElementById('estimation-info-text');
	cur = cur == 0 ? arr.length - 1 : cur - 1;
	estimation.value = arr[cur];
}