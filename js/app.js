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

	let errorsState = {};

	if (!checkChampionValidity(champion.value)) {
		errorsState = {
			...errorsState,
			championError: 'Wpisz poprawną nazwę postaci!',
		};
	}

	if (!description.value) {
		errorsState = {
			...errorsState,
			descError: 'Wpisz opis inwektywy',
		};
	}

	if (Object.keys(errorsState).length) throw errorsState;

	return {
		id: Date.now(),
		date: new Date(date.value).toISOString().slice(0, 10),
		champion: champion.value,
		description: description.value,
	};
};

const getChampionCount = async () => {
	try {
		const response = await fetch('https://kasha-rages-db-default-rtdb.firebaseio.com/rages.json');
		const data = await response.json();
		
		const championsCountArr = Object.values(data);
		const championsCount = {};

		championsCountArr.forEach(row => {
			championsCount[row.champion] = (championsCount[row.champion] || 0) + 1;
		});

		console.log(championsCount);

		return championsCount;
	} catch (error) {
		console.error(error);
	}
};

const submitData = async event => {
	event.preventDefault();

	try {
		await fetch('https://kasha-rages-db-default-rtdb.firebaseio.com/rages.json', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify(dataHandler()),
		});
		modalHandler({ text: 'Pomyślnie przesłano formularz!' }, true);
		chartHandler();
	} catch (error) {
		formErrorHandler();
		modalHandler(error, false);
	}

	resetInputs();
};

const formErrorHandler = () => {
	const form = document.querySelector('.form-container');

	form.classList.add('error');
	setTimeout(() => {
		form.classList.remove('error');
	}, 201);
};

const modalHandler = (info, type) => {
	const modal = document.querySelector('.modal');
	type ? (type = 'accept') : (type = 'error');
	modal.classList.add('show', type);

	document.querySelector('.submit-btn').setAttribute('disabled', 'disabled');

	for (const value of Object.values(info)) {
		const p = document.createElement('p');
		p.classList.add('modal__message');
		p.textContent = value;
		modal.appendChild(p);
	}

	const messages = document.getElementsByClassName('modal__message');

	setTimeout(() => {
		modal.classList.remove('show', type);
		Array.from(messages).forEach(child => child.remove());
		document.querySelector('.submit-btn').removeAttribute('disabled');
	}, 1500);
};

const checkChampionValidity = value => {
	if (champions.includes(value)) return true;
	return false;
};

const resetInputs = () => {
	document.querySelectorAll('.input__field').forEach(field => (field.value = ''));
	setPresentDay();
};

const generateChart = () => {
	const canvas = document.createElement('canvas');
	canvas.classList.add('chart');
	document.querySelector('.canvas-container').appendChild(canvas);

	return canvas;
};

const chartHandler = async () => {
	if (document.querySelector('.chart') !== null)
		document.querySelector('.chart').remove();

	const canvas = generateChart();

	new Chart(canvas, {
		type: 'pie',
		data: {
			labels: Object.keys(await getChampionCount()),
			datasets: [
				{
					backgroundColor: ['#3e95cd', '#8e5ea2'],
					data: Object.values(await getChampionCount()),
				},
			],
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					labels: {
						color: '#fff',
					},
				},
				title: {
					display: 'true',
					text: 'Postacie',
					color: '#fff',
					size: 40
				},
			},
		},
	});
};

const init = async () => {
	setPresentDay();
	assignChampionsToDatalist();
	chartHandler();
	document.querySelector('.submit-btn').addEventListener('click', submitData);
	document.querySelector('.nav').addEventListener('click', () => {
		document.querySelectorAll('.side').forEach(side => side.classList.toggle('slide-left'))
	});
};

init();
