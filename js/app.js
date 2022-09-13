import champions from './champions.js';

const setPresentDay = () => {
	const date = new Date();
	const result = date.toLocaleDateString('af-ZA', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});
	document.querySelector('.input__field--date').value = result;
};

const assignChampionsToDatalist = () => {
	for (const iterator of champions) {
		const option = document.createElement('option');
		option.setAttribute('value', iterator);
		document.querySelector('#champions').appendChild(option);
	}
};

const dataHandler = () => {
	const date = document.querySelector('.input__field--date');
	const champion = document.querySelector('.input__field--champion');
	const description = document.querySelector('.input__field--desc');

	if (!checkChampionValidity(champion.value))
		throw new Error('Wprowadzono błędną postać!');

	return {
		id: Date.now(),
		date: new Date(date.value).toISOString().slice(0, 10),
		champion: champion.value,
		description: description.value,
	};
};

const submitData = async event => {
	event.preventDefault();

	try {
		await fetch('https://sheetdb.io/api/v1/uprq1nzevlt46', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(dataHandler()),
		});
	} catch (error) {
		console.error(error.message);
	}

	resetInputs();
};

const checkChampionValidity = value => {
	if (champions.includes(value)) return true;

	return false;
};

const resetInputs = () => {
	document.querySelectorAll('.input__field').forEach(field => (field.value = ''));
	setPresentDay();
};

const init = () => {
	setPresentDay();
	assignChampionsToDatalist();
	document.querySelector('.submit-btn').addEventListener('click', submitData);
};

init();
