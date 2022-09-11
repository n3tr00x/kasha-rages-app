import champions from './champions.js';

const setPresentDay = () => {
	document.querySelector('.date-input').valueAsDate = new Date();
};

const assignChampionsToDatalist = () => {
	for (const iterator of champions) {
		const option = document.createElement('option');
		option.setAttribute('value', iterator);
		document.querySelector('.champions').appendChild(option);
	}
}

const init = () => {
	setPresentDay();
	assignChampionsToDatalist();
}

init();

